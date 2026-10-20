"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PaymentOptions from "@/components/PaymentOptions";
import { formatETB } from "@/lib/payment-config";

export default function CheckoutPanel({ bookingId }) {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setError("Select a booking first. Submit a trip request from the Plan a trip page.");
      setLoading(false);
      return;
    }
    fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load booking.");
        return data.booking;
      })
      .then(setBooking)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [bookingId]);

  async function submitPayment(details) {
    setError("");
    setMessage("");
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, ...details }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Unable to submit payment request.");
      return;
    }
    setMessage(`${result.message} Reference: ${result.payment.id}`);
  }

  if (loading) return <p role="status">Loading booking…</p>;
  if (error && !booking) return <div className="empty-state"><p role="alert">{error}</p><p><Link href="/login">Sign in</Link> · <Link href="/booking">Plan a trip</Link></p></div>;

  return (
    <div className="checkout-layout">
      <section className="card">
        <h2>Booking summary</h2>
        <p><strong>{booking.destinationName}</strong></p>
        <p>Travel date: {booking.travelDate}</p>
        <p>Travelers: {booking.travelers}</p>
        <p>Booking status: {booking.status}</p>
        <p>Payment status: {booking.paymentStatus}</p>
        <hr />
        <p>Tour subtotal: <strong>{formatETB(booking.amountETB)}</strong></p>
        <p className="muted">The server calculates the service fee from the saved booking amount. Values entered by the browser are not trusted.</p>
      </section>
      {booking.paymentStatus === "paid" ? (
        <div className="empty-state"><h2>Payment recorded</h2><p>This booking is already marked paid.</p></div>
      ) : (
        <PaymentOptions amount={booking.amountETB} onSubmit={submitPayment} />
      )}
      {error && <p className="error-message" role="alert">{error}</p>}
      {message && <div className="empty-state" role="status"><h2>Payment request received</h2><p>{message}</p><p>Keep your reference. This is still pending until an administrator verifies the payment.</p><Link href="/notifications">View notifications</Link></div>}
    </div>
  );
}
