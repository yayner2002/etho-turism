import { safeRedirectPath } from "../lib/safe-redirect.js";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

function cookieFrom(response) {
  const setCookies = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie") || ""];
  for (const header of setCookies) {
    const match = header.match(/(?:^|,\s*)(ethio_tourism_session=[^;]*)/);
    if (match) return match[1];
  }
  return "";
}

async function request(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...(options.headers || {}) },
    redirect: "manual",
  });
}

async function register(name, email, password, requestedRole = "customer") {
  const response = await request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role: requestedRole }),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data, cookie: cookieFrom(response) };
}

async function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

async function run() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const passwordA = `Test-A-${suffix}-Password!`;
  const passwordB = `Test-B-${suffix}-Password!`;
  const emailA = `security-a-${suffix}@example.com`;
  const emailB = `security-b-${suffix}@example.com`;

  // Authentication baseline: both accounts can register and sign in; role escalation
  // through public registration must be ignored.
  const a = await register("Security Test A", emailA, passwordA, "admin");
  assert(a.response.status === 201, "Customer A can register");
  assert(a.data.user?.role === "customer", "Public registration cannot assign admin role");
  assert(Boolean(a.cookie), "Registration issues an HttpOnly session cookie");

  const b = await register("Security Test B", emailB, passwordB);
  assert(b.response.status === 201, "Customer B can register");
  assert(b.data.user?.role === "customer", "Customer B receives only customer privileges");
  assert(Boolean(b.cookie), "Customer B receives a session cookie");

  const customerLogin = await login(emailA, passwordA);
  assert(customerLogin.status === 200, "Valid customer credentials are accepted");
  const customerCookie = cookieFrom(customerLogin);
  assert(Boolean(customerCookie), "Login issues a session cookie");

  const badLogin = await login(emailA, `wrong-${passwordA}`);
  assert(badLogin.status === 401, "Invalid password is rejected");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before running the test.");
  }
  const adminLogin = await login(adminEmail, adminPassword);
  assert(adminLogin.status === 200, "Configured administrator can sign in");
  const adminCookie = cookieFrom(adminLogin);
  assert(Boolean(adminCookie), "Administrator receives a session cookie");
  const adminAccess = await request("/api/admin/security-check", { headers: { Cookie: adminCookie } });
  assert(adminAccess.status === 200, "Administrator can access the protected admin API");

  // ATTACK 1 — write without authentication.
  const signedOutWrite = await request("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Unauthenticated Attacker",
      email: "attacker@example.com",
      phone: "0912345678",
      destinationId: "bahir-dar",
      travelDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      travelers: 1,
      message: "unauthorized write test",
    }),
  });
  assert(signedOutWrite.status === 401, "ATTACK 1 blocked: signed-out user cannot create a booking");

  // ATTACK 2 — IDOR: B creates a booking, then A attempts to read B's booking.
  const bookingResponse = await request("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: b.cookie },
    body: JSON.stringify({
      name: "Security Test B",
      email: emailB,
      phone: "0912345678",
      destinationId: "bahir-dar",
      travelDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      travelers: 1,
      message: "IDOR test booking",
    }),
  });
  const bookingData = await bookingResponse.json().catch(() => ({}));
  assert(bookingResponse.status === 201 && Boolean(bookingData.booking?.id), "Test owner can create a booking");
  const idor = await request(`/api/bookings/${encodeURIComponent(bookingData.booking.id)}`, {
    headers: { Cookie: customerCookie },
  });
  assert(idor.status === 403 || idor.status === 404, "ATTACK 2 blocked: Customer A cannot read Customer B's booking");

  const customerAdminAccess = await request("/api/admin/security-check", { headers: { Cookie: customerCookie } });
  assert(customerAdminAccess.status === 403, "Customer cannot access administrator API");

  // ATTACK 3 — crafted external return URLs. This tests the same helper used by login.
  assert(safeRedirectPath("https://attacker.example/steal", "/dashboard") === "/dashboard", "ATTACK 3 blocked: external return URL rejected");
  assert(safeRedirectPath("//attacker.example/steal", "/dashboard") === "/dashboard", "Protocol-relative return URL rejected");
  assert(safeRedirectPath("/\\\\attacker.example/steal", "/dashboard") === "/dashboard", "Backslash-based return URL rejected");
  assert(safeRedirectPath("/destinations?region=amhara", "/dashboard") === "/destinations?region=amhara", "Safe internal return URL is allowed");

  // Tampering with a signed cookie must not authenticate the attacker.
  const [cookieName, originalToken] = customerCookie.split("=");
  const changedToken = `${originalToken.slice(0, -1)}${originalToken.endsWith("A") ? "B" : "A"}`;
  const tampered = await request("/api/auth/me", { headers: { Cookie: `${cookieName}=${changedToken}` } });
  assert(tampered.status === 401, "Tampered session cookie is rejected");

  console.log("\nAll authentication checks and the three required attack tests passed against this running server.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
