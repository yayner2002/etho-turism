import "server-only";

const attempts = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_KEYS = 10_000;

// Prevent attacker-controlled identifiers from creating oversized keys.
const MAX_EMAIL_LENGTH = 254;
const MAX_IP_LENGTH = 128;

function normalizeEmail(email) {
  if (typeof email !== "string") return "";

  return email.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH);
}

/**
 * Configure TRUSTED_PROXY_MODE only when your hosting environment
 * guarantees that the corresponding headers are set by a trusted proxy.
 *
 * Supported values:
 * - "x-real-ip": trust X-Real-IP from your trusted proxy.
 * - "x-forwarded-for": trust the first X-Forwarded-For address only when
 *   your proxy is configured to overwrite/sanitize this header correctly.
 * - unset: use "unknown"; configure a trusted source for production.
 *
 * Never enable a mode just because a client sends that header.
 */
export function getClientIp(request) {
  const mode = process.env.TRUSTED_PROXY_MODE;

  if (mode === "x-real-ip") {
    const value = request.headers.get("x-real-ip")?.trim();

    return value && value.length <= MAX_IP_LENGTH ? value : "unknown";
  }

  if (mode === "x-forwarded-for") {
    const value = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    return value && value.length <= MAX_IP_LENGTH ? value : "unknown";
  }

  return "unknown";
}

function getKeys(request, email) {
  const ip = getClientIp(request);
  const normalizedEmail = normalizeEmail(email);

  // Always limit by IP, and add an account-specific limit when an email
  // is provided. Keep the IP in the account key to avoid global account
  // lockouts caused by unrelated clients.
  return [`ip:${ip}`, `account:${ip}:${normalizedEmail || "invalid-email"}`];
}

function pruneExpired(now) {
  for (const [key, entry] of attempts) {
    if (entry.resetAt <= now) {
      attempts.delete(key);
    }
  }
}

function ensureCapacity(now, requiredKeys) {
  pruneExpired(now);

  if (attempts.size + requiredKeys > MAX_KEYS) {
    // Remove oldest entries until the map is within its capacity.
    const excess = attempts.size + requiredKeys - MAX_KEYS;

    let removed = 0;

    for (const key of attempts.keys()) {
      attempts.delete(key);
      removed += 1;

      if (removed >= excess) break;
    }
  }

  // Do not silently create an unbounded Map if capacity is exhausted.
  return attempts.size + requiredKeys <= MAX_KEYS;
}

function getEntry(key, now) {
  let entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = {
      count: 0,
      resetAt: now + WINDOW_MS,
    };

    attempts.set(key, entry);
  }

  return entry;
}

/**
 * Check whether a login attempt is allowed.
 *
 * Call this before verifying credentials.
 */
export function checkLoginLimit(request, email) {
  const now = Date.now();
  const keys = getKeys(request, email);

  if (!ensureCapacity(now, keys.length)) {
    return {
      allowed: false,
      retryAfter: Math.ceil(WINDOW_MS / 1000),
    };
  }

  const entries = keys.map((key) => getEntry(key, now));
  const blocked = entries.some((entry) => entry.count >= MAX_ATTEMPTS);

  const latestResetAt = Math.max(...entries.map((entry) => entry.resetAt));

  return {
    allowed: !blocked,
    retryAfter: blocked
      ? Math.max(1, Math.ceil((latestResetAt - now) / 1000))
      : 0,
  };
}

/**
 * Record a failed login.
 *
 * Call this only after a credential check fails.
 */
export function recordFailedLogin(request, email) {
  const now = Date.now();
  const keys = getKeys(request, email);

  if (!ensureCapacity(now, keys.length)) {
    return;
  }

  for (const key of keys) {
    const entry = getEntry(key, now);
    entry.count += 1;
  }
}

/**
 * Clear the IP and account counters after a successful login.
 */
export function clearFailedLogin(request, email) {
  for (const key of getKeys(request, email)) {
    attempts.delete(key);
  }
}
