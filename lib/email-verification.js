import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { getUserByEmailVerificationTokenHash, markEmailVerified, setEmailVerificationToken } from "@/lib/store";

const TOKEN_TTL_MS = 30 * 60 * 1000;

export function hashVerificationToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createEmailVerificationToken(userId) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();
  const saved = setEmailVerificationToken(userId, hashVerificationToken(token), expiresAt);
  if (!saved) throw new Error("Unable to create email verification token.");
  return token;
}

export function verifyEmailToken(token) {
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
  const user = getUserByEmailVerificationTokenHash(hashVerificationToken(token));
  if (!user || user.emailVerifiedAt || !user.emailVerificationExpiresAt) return null;
  if (Date.parse(user.emailVerificationExpiresAt) <= Date.now()) return null;
  return markEmailVerified(user.id);
}

export async function sendVerificationEmail({ email, name, token }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  if (!apiKey || !from) throw new Error("Email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  const verifyUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Verify your Ethio Tourism email address",
      text: `Hello ${name},\n\nPlease verify your email address by opening this link within 30 minutes:\n${verifyUrl}\n\nIf you did not create an Ethio Tourism account, you can ignore this message.`,
      html: `<p>Hello ${escapeHtml(name)},</p><p>Please verify your email address by clicking the button below. This link expires in 30 minutes.</p><p><a href="${verifyUrl}">Verify my email address</a></p><p>If you did not create an Ethio Tourism account, you can ignore this message.</p>`,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Email provider rejected verification email:", response.status, detail.slice(0, 300));
    throw new Error("Unable to send verification email. Check the email provider configuration and try again.");
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
