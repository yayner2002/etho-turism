"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("Checking verification link…");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setStatus(params.get("sent") === "1" ? "Check your email inbox and click the verification link. Check spam/junk if needed." : "Open the verification link sent to your email. Verification links expire after 30 minutes.");
      return;
    }
    let cancelled = false;
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (response) => {
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to verify this email address.");
      if (!cancelled) { setVerified(true); setStatus(result.message || "Email verified successfully."); }
    }).catch((err) => { if (!cancelled) { setError(err.message); setStatus(""); } });
    return () => { cancelled = true; };
  }, []);

  return <section className="auth-section container"><div className="auth-panel">
    <p className="eyebrow">EMAIL VERIFICATION</p><h1>Verify your email</h1>
    {status && <p role="status" aria-live="polite">{status}</p>}
    {error && <p className="error-message" role="alert">{error}</p>}
    {verified && <p>You can now sign in with the account you registered.</p>}
    <p><Link href="/login">Go to sign in</Link> · <Link href="/register">Register</Link></p>
  </div></section>;
}
