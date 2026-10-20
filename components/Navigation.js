"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  const loadUser = useCallback(async (signal) => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal,
      });

      if (response.status === 401) {
        setUser(null);
        setError("");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to check your account.");
      }

      const result = await response.json();
      setUser(result?.user ?? null);
      setError("");
    } catch (err) {
      if (err.name !== "AbortError") {
        setUser(null);
        setError("Account status could not be checked.");
      }
    } finally {
      if (!signal?.aborted) {
        setChecked(true);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadUser(controller.signal);

    return () => controller.abort();
  }, [loadUser]);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));

        throw new Error(
          result.error ||
            result.message ||
            "Sign out failed. Please try again.",
        );
      }

      setUser(null);
      window.location.assign("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign out. Please try again.",
      );

      setSigningOut(false);
    }
  }

  return (
    <nav aria-label="Main navigation">
      <Link href="/">Home</Link>
      <Link href="/destinations">Destinations</Link>
      <Link href="/plan-trip">Plan a Trip</Link>
      <Link href="/about">About</Link>

      {!checked ? (
        <span className="sr-only" role="status">
          Checking account…
        </span>
      ) : !user ? (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      ) : (
        <>
          <Link href="/dashboard">My Dashboard</Link>
          <Link href="/notifications">Notifications</Link>

          {user.role === "staff" && <Link href="/staff">Staff Workspace</Link>}

          {user.role === "admin" && (
            <>
              <Link href="/staff">Staff Workspace</Link>
              <Link href="/admin">Admin</Link>
            </>
          )}

          <span className="nav-user" aria-label={`Signed in as ${user.role}`}>
            {user.name || user.email || "Account"} ({user.role})
          </span>

          <button
            className="nav-button"
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </>
      )}

      {error && (
        <span className="error-message" role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </nav>
  );
}
