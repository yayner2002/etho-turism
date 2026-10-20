import { NextResponse } from "next/server";
import { createUser, getUserByEmail, publicUser } from "@/lib/store";
import { hashPassword, setSessionCookie, verifyPassword } from "@/lib/auth";
import {
  checkLoginLimit,
  recordFailedLogin,
  clearFailedLogin,
} from "@/lib/rate-limit";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  const password = typeof body?.password === "string" ? body.password : "";

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length > 1024
  ) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 400 },
    );
  }

  // Limit repeated login attempts.
  const limit = checkLoginLimit(request, email);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfter),
        },
      },
    );
  }

  let user;

  try {
    user = getUserByEmail(email);
  } catch (error) {
    console.error("Login account lookup failed:", error);

    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again." },
      { status: 500 },
    );
  }

  // Provision an administrator only using server-side credentials.
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    adminEmail &&
    adminPassword &&
    email === adminEmail &&
    password === adminPassword
  ) {
    if (!user) {
      try {
        user = createUser({
          name: "Site Administrator",
          email,
          passwordHash: await hashPassword(adminPassword),
          role: "admin",
          emailVerifiedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Administrator provisioning failed:", error);

        try {
          user = getUserByEmail(email);
        } catch {
          user = null;
        }
      }
    }

    // Never promote a public customer account to administrator.
    if (user && user.role !== "admin") {
      recordFailedLogin(request, email);

      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }
  }

  let valid = false;

  try {
    valid =
      Boolean(user) &&
      Boolean(user.passwordHash) &&
      (await verifyPassword(password, user.passwordHash));
  } catch (error) {
    console.error("Password verification failed:", error);
  }

  if (!valid) {
    recordFailedLogin(request, email);

    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  // Email verification is not required for login.
  // Staff permissions and booking approval rules remain enforced
  // by the protected server-side routes.
  clearFailedLogin(request, email);

  try {
    await setSessionCookie(user);
  } catch (error) {
    console.error("Session creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create a session. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Signed in successfully.",
    user: publicUser(user),
  });
}
