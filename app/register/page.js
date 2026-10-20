"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isValidEmail, normalizeEmail } from "@/lib/email-utils";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = normalizeEmail(form.email);
    const password = form.password;

    if (name.length < 2 || name.length > 80) {
      setError("Please enter your full name (2–80 characters).");
      return;
    }

    if (!isValidEmail(email) || email.length > 254) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 12 || password.length > 1024) {
      setError("Your password must contain 12–1024 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Unable to create account.",
        );
      }

      // Registration succeeds without email verification.
      // Continue to sign-in; registration does not automatically
      // grant staff or administrator privileges.
      router.push("/login?registered=1");
    } catch (err) {
      setError(err.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-section container">
      <div className="auth-panel">
        <p className="eyebrow">CREATE AN ACCOUNT</p>

        <h1>Register</h1>

        <p>
          Create your Ethio Tourism account to explore destinations and submit
          trip requests. No email verification is required.
        </p>

        <form className="form-stack" onSubmit={submit}>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <label htmlFor="register-name">
            Full name
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              value={form.name}
              onChange={updateField}
              disabled={loading}
            />
          </label>

          <label htmlFor="register-email">
            Email address
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              value={form.email}
              onChange={updateField}
              disabled={loading}
            />
          </label>

          <label htmlFor="register-password">
            Password
            <input
              id="register-password"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={1024}
              value={form.password}
              onChange={updateField}
              disabled={loading}
            />
            <small>Use at least 12 characters.</small>
          </label>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p>
          Already registered? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
