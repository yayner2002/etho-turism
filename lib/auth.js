import "server-only";

import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/store";

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = "ethio_tourism_session";

const SESSION_SECONDS = 60 * 60 * 8;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_BYTES = 16;
const MAX_PASSWORD_LENGTH = 1024;
const MAX_SESSION_TOKEN_LENGTH = 4096;

const ALLOWED_ROLES = ["customer", "staff", "admin"];

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (typeof secret !== "string" || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error(
      "SESSION_SECRET must be configured with at least 32 bytes.",
    );
  }

  return secret;
}

function isValidPassword(password) {
  return (
    typeof password === "string" &&
    password.length > 0 &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}

/**
 * Hash a password using scrypt and a random salt.
 * This function must only be used on the server.
 */
export async function hashPassword(password) {
  if (!isValidPassword(password)) {
    throw new Error("Password must contain between 1 and 1024 characters.");
  }

  const salt = randomBytes(PASSWORD_SALT_BYTES).toString("hex");

  const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH);

  return `scrypt:${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

/**
 * Verify a password without exposing authentication errors.
 */
export async function verifyPassword(password, storedHash) {
  try {
    if (
      !isValidPassword(password) ||
      typeof storedHash !== "string" ||
      storedHash.length > 256
    ) {
      return false;
    }

    const parts = storedHash.split(":");

    if (parts.length !== 3) {
      return false;
    }

    const [algorithm, salt, savedKey] = parts;

    if (
      algorithm !== "scrypt" ||
      !/^[a-f0-9]{32}$/i.test(salt) ||
      !/^[a-f0-9]{128}$/i.test(savedKey)
    ) {
      return false;
    }

    const derivedKey = Buffer.from(
      await scrypt(password, salt, PASSWORD_KEY_LENGTH),
    );

    const expectedKey = Buffer.from(savedKey, "hex");

    if (derivedKey.length !== expectedKey.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, expectedKey);
  } catch {
    return false;
  }
}

function sign(value) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function isValidUser(user) {
  return Boolean(
    user &&
    typeof user.id === "string" &&
    user.id.length > 0 &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    ALLOWED_ROLES.includes(user.role),
  );
}

/**
 * Create a signed session token.
 * Call only after verifying credentials.
 */
export function createSessionToken(user) {
  if (!isValidUser(user)) {
    throw new Error("Cannot create a session for an invalid user.");
  }

  const now = Math.floor(Date.now() / 1000);

  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      role: user.role,
      iat: now,
      exp: now + SESSION_SECONDS,
      nonce: randomBytes(16).toString("hex"),
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

/**
 * Validate the signature and session payload.
 */
function verifySessionToken(token) {
  try {
    if (
      typeof token !== "string" ||
      token.length === 0 ||
      token.length > MAX_SESSION_TOKEN_LENGTH
    ) {
      return null;
    }

    const parts = token.split(".");

    if (parts.length !== 2) {
      return null;
    }

    const [payload, suppliedSignature] = parts;

    if (
      !payload ||
      !/^[A-Za-z0-9_-]+$/.test(payload) ||
      !/^[A-Za-z0-9_-]{43}$/.test(suppliedSignature)
    ) {
      return null;
    }

    const expectedSignature = sign(payload);
    const supplied = Buffer.from(suppliedSignature, "utf8");
    const expected = Buffer.from(expectedSignature, "utf8");

    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      return null;
    }

    const decoded = Buffer.from(payload, "base64url");

    // Reject malformed or noncanonical base64url payloads.
    if (decoded.toString("base64url") !== payload) {
      return null;
    }

    const session = JSON.parse(decoded.toString("utf8"));
    const now = Math.floor(Date.now() / 1000);

    if (
      !session ||
      typeof session !== "object" ||
      Array.isArray(session) ||
      typeof session.sub !== "string" ||
      session.sub.length === 0 ||
      !ALLOWED_ROLES.includes(session.role) ||
      !Number.isInteger(session.iat) ||
      !Number.isInteger(session.exp) ||
      session.iat > now + 60 ||
      session.exp <= now ||
      session.exp <= session.iat ||
      session.exp - session.iat > SESSION_SECONDS ||
      typeof session.nonce !== "string" ||
      !/^[a-f0-9]{32}$/i.test(session.nonce)
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Set a secure session cookie.
 */
export async function setSessionCookie(user) {
  if (!isValidUser(user)) {
    throw new Error("Cannot set a session cookie for an invalid user.");
  }

  const token = createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

/**
 * Clear the session cookie.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

/**
 * Return the current authenticated user, or null.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const session = verifySessionToken(token);

    if (!session) {
      return null;
    }

    const user = await getUserById(session.sub);

    if (
      !user ||
      String(user.id) !== session.sub ||
      user.role !== session.role ||
      !ALLOWED_ROLES.includes(user.role)
    ) {
      return null;
    }

    // Never expose password hashes or internal authentication fields.
    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      favorites: Array.isArray(user.favorites)
        ? user.favorites.filter((id) => typeof id === "string")
        : [],
    };
  } catch {
    // Fail closed if the session cannot be verified.
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  return user?.role === "admin" ? user : null;
}

export async function requireStaffOrAdmin() {
  const user = await getCurrentUser();

  if (!user || !["staff", "admin"].includes(user.role)) {
    return null;
  }

  return user;
}

// Backward-compatible alias for existing imports.
export async function requireAdminUser() {
  return requireAdmin();
}
