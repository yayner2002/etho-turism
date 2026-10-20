"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { isValidEmail, normalizeEmail } from "@/lib/email-utils";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    const email = normalizeEmail(form.email);
    if (!isValidEmail(email)) { setError("Please enter a valid email address."); return; }
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Sign-in failed.");
      }

      const roleHome = result.user.role === "admin"
        ? "/admin"
        : result.user.role === "staff"
          ? "/staff"
          : "/dashboard";
      // Only allow safe same-origin relative return paths. External, protocol-relative,
      // and backslash-based URLs fall back to the user's role-specific home page.
      const requestedNext = new URLSearchParams(window.location.search).get("next");
      router.replace(safeRedirectPath(requestedNext, roleHome));
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-section container">
      <div className="auth-panel">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in</h1>
        <p>Sign in to manage your saved Ethiopian destinations.</p>
        <p>New accounts must verify their email address before signing in.</p>
        <p><Link href="/verify-email">Open email verification</Link></p>

        <form className="form-stack" onSubmit={submit}>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <label>
            Email address
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              maxLength={128}
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
          </label>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p>
          Don't have an account? <Link href="/register">Register here</Link>
        </p>
      </div>
    </section>
  );
}
