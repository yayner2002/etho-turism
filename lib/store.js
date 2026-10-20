import "server-only";

import { randomUUID } from "node:crypto";

// DEMO ONLY: This store is in memory, not a database.
// Data can be lost when the server process restarts.
// Use a durable database before production.

const STATE_KEY = "__ethioTourismState";

function createInitialState() {
  return {
    users: new Map(),
    emailIndex: new Map(),
    bookings: [],
    payments: [],
    notifications: [],
  };
}

if (!globalThis[STATE_KEY]) {
  globalThis[STATE_KEY] = createInitialState();
}

const state = globalThis[STATE_KEY];

const { users, emailIndex, bookings, payments, notifications } = state;

const ALLOWED_ROLES = ["customer", "staff", "admin"];

function normalizeEmail(email) {
  if (typeof email !== "string") {
    throw new Error("INVALID_EMAIL");
  }

  const normalized = email.trim().toLowerCase();

  if (
    normalized.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
  ) {
    throw new Error("INVALID_EMAIL");
  }

  return normalized;
}

function cloneRecord(record) {
  if (record == null) {
    return null;
  }

  return structuredClone(record);
}

function requireNonEmptyString(value, errorCode, maxLength = 200) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.trim().length > maxLength
  ) {
    throw new Error(errorCode);
  }

  return value.trim();
}

function isAllowedRole(role) {
  return ALLOWED_ROLES.includes(role);
}

function findRecordById(collection, id) {
  if (typeof id !== "string" || !id.trim()) {
    return null;
  }

  return collection.find((item) => item.id === id) || null;
}

// -----------------------------------------------------------------------------
// Users
// -----------------------------------------------------------------------------

export function getUserById(id) {
  if (typeof id !== "string" || !id) {
    return null;
  }

  return users.get(id) || null;
}

export function getUserByEmail(email) {
  let normalizedEmail;

  try {
    normalizedEmail = normalizeEmail(email);
  } catch {
    return null;
  }

  const id = emailIndex.get(normalizedEmail);

  return id ? users.get(id) || null : null;
}

export function listUsers() {
  return [...users.values()].map(publicUser);
}

/**
 * Create a user.
 *
 * Public registration routes should explicitly use role: "customer".
 * Only a trusted, authenticated administrative route should create
 * staff or admin users.
 */
export function createUser({
  name,
  email,
  passwordHash,
  emailVerifiedAt = null,
  role = "customer",
}) {
  const normalizedName = requireNonEmptyString(name, "INVALID_NAME", 120);

  const normalizedEmail = normalizeEmail(email);

  if (typeof passwordHash !== "string" || !passwordHash.startsWith("scrypt:")) {
    throw new Error("INVALID_PASSWORD_HASH");
  }

  if (emailIndex.has(normalizedEmail)) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  if (!isAllowedRole(role)) {
    throw new Error("INVALID_ROLE");
  }

  const user = {
    id: randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
    emailVerifiedAt,
    emailVerificationTokenHash: null,
    emailVerificationExpiresAt: null,
    role,
    favorites: [],
    createdAt: new Date().toISOString(),
  };

  users.set(user.id, user);
  emailIndex.set(normalizedEmail, user.id);

  return user;
}

/**
 * Call only after the route has verified administrator permissions.
 */
export function setUserRole(userId, role) {
  if (!isAllowedRole(role)) {
    return null;
  }

  const user = getUserById(userId);

  if (!user) {
    return null;
  }

  user.role = role;

  return publicUser(user);
}

export function publicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: Boolean(user.emailVerifiedAt),
    favorites: Array.isArray(user.favorites) ? [...user.favorites] : [],
    createdAt: user.createdAt,
  };
}

export function deleteUser(userId) {
  const user = getUserById(userId);

  if (!user) {
    return false;
  }

  users.delete(userId);
  emailIndex.delete(user.email);

  return true;
}

export function setEmailVerificationToken(userId, tokenHash, expiresAt) {
  const user = getUserById(userId);

  if (
    !user ||
    user.emailVerifiedAt ||
    typeof tokenHash !== "string" ||
    !tokenHash ||
    typeof expiresAt !== "string"
  ) {
    return false;
  }

  user.emailVerificationTokenHash = tokenHash;
  user.emailVerificationExpiresAt = expiresAt;

  return true;
}

export function getUserByEmailVerificationTokenHash(tokenHash) {
  if (typeof tokenHash !== "string" || !tokenHash) {
    return null;
  }

  for (const user of users.values()) {
    if (user.emailVerificationTokenHash === tokenHash) {
      return user;
    }
  }

  return null;
}

export function markEmailVerified(userId) {
  const user = getUserById(userId);

  if (!user || user.emailVerifiedAt) {
    return null;
  }

  user.emailVerifiedAt = new Date().toISOString();
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpiresAt = null;

  return publicUser(user);
}

// -----------------------------------------------------------------------------
// Favorites
// -----------------------------------------------------------------------------

export function toggleFavorite(userId, destinationId) {
  const user = getUserById(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (
    typeof destinationId !== "string" ||
    !destinationId.trim() ||
    destinationId.length > 200
  ) {
    throw new Error("INVALID_DESTINATION_ID");
  }

  const id = destinationId.trim();
  const favorites = Array.isArray(user.favorites) ? user.favorites : [];

  user.favorites = favorites.includes(id)
    ? favorites.filter((favoriteId) => favoriteId !== id)
    : [...new Set([...favorites, id])];

  return [...user.favorites];
}

// -----------------------------------------------------------------------------
// Bookings
// -----------------------------------------------------------------------------

export async function createBooking(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("INVALID_BOOKING");
  }

  const now = new Date().toISOString();

  // Never accept an ID or initial status from the caller.
  const booking = {
    ...cloneRecord(data),
    id: randomUUID(),
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: now,
    updatedAt: now,
  };

  bookings.push(booking);

  return cloneRecord(booking);
}

export async function getBookings() {
  return bookings.map((booking) => cloneRecord(booking));
}

export async function getBookingById(id) {
  return cloneRecord(findRecordById(bookings, String(id)));
}

/**
 * This is a low-level mutation helper, not an authorization boundary.
 *
 * The calling server route must verify permissions and validate
 * status transitions. Only a trusted payment-verification route
 * should set paymentStatus to "paid".
 */
export async function updateBooking(id, patch) {
  const booking = findRecordById(bookings, String(id));

  if (!booking || !patch || typeof patch !== "object" || Array.isArray(patch)) {
    return null;
  }

  const {
    id: ignoredId,
    createdAt: ignoredCreatedAt,
    updatedAt: ignoredUpdatedAt,
    ...safePatch
  } = patch;

  Object.assign(booking, cloneRecord(safePatch), {
    updatedAt: new Date().toISOString(),
  });

  return cloneRecord(booking);
}

// -----------------------------------------------------------------------------
// Notifications
// -----------------------------------------------------------------------------

export function createNotification({
  userId = null,
  role = null,
  type = "info",
  title = "Notification",
  message = "",
  relatedId = null,
} = {}) {
  if (userId !== null && typeof userId !== "string") {
    throw new Error("INVALID_NOTIFICATION_USER");
  }

  const validNotificationRoles = ["customer", "staff", "admin", "staff_admin"];

  if (role !== null && !validNotificationRoles.includes(role)) {
    throw new Error("INVALID_NOTIFICATION_ROLE");
  }

  const notification = {
    id: randomUUID(),
    userId,
    role,
    type: String(type).slice(0, 40),
    title: String(title).slice(0, 120),
    message: String(message).slice(0, 1000),
    relatedId: typeof relatedId === "string" ? relatedId.slice(0, 200) : null,
    readAt: null,
    createdAt: new Date().toISOString(),
  };

  notifications.push(notification);

  return cloneRecord(notification);
}

function canUserSeeNotification(notification, user) {
  if (!user || typeof user.id !== "string") {
    return false;
  }

  if (notification.userId === user.id) {
    return true;
  }

  if (notification.userId !== null) {
    return false;
  }

  if (notification.role === user.role) {
    return true;
  }

  return (
    notification.role === "staff_admin" &&
    ["staff", "admin"].includes(user.role)
  );
}

export function getNotificationsForUser(user) {
  if (!user) {
    return [];
  }

  return notifications
    .filter((notification) => canUserSeeNotification(notification, user))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((notification) => cloneRecord(notification));
}

export function markNotificationRead(notificationId, user) {
  const notification = findRecordById(notifications, String(notificationId));

  if (!notification || !canUserSeeNotification(notification, user)) {
    return null;
  }

  if (!notification.readAt) {
    notification.readAt = new Date().toISOString();
  }

  return cloneRecord(notification);
}

// -----------------------------------------------------------------------------
// Payment requests
// -----------------------------------------------------------------------------

export async function createPaymentRequest(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("INVALID_PAYMENT_REQUEST");
  }

  const now = new Date().toISOString();

  // A new request must always start pending.
  // Submitting a request does not prove that money was received.
  const payment = {
    ...cloneRecord(data),
    id: randomUUID(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  payments.push(payment);

  return cloneRecord(payment);
}

export function getPaymentRequests() {
  return payments.map((payment) => cloneRecord(payment));
}

/**
 * Call only from a trusted server route that verifies staff/admin
 * permissions, validates status transitions, and records who verified
 * the request. Never trust a client's claim that payment succeeded.
 */
export function updatePaymentRequest(id, patch) {
  const payment = findRecordById(payments, String(id));

  if (!payment || !patch || typeof patch !== "object" || Array.isArray(patch)) {
    return null;
  }

  const {
    id: ignoredId,
    createdAt: ignoredCreatedAt,
    updatedAt: ignoredUpdatedAt,
    ...safePatch
  } = patch;

  Object.assign(payment, cloneRecord(safePatch), {
    updatedAt: new Date().toISOString(),
  });

  return cloneRecord(payment);
}
