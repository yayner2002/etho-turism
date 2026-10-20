"use client";

import { useSearchParams } from "next/navigation";
import CheckoutPanel from "@/components/CheckoutPanel";

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";

  return (
    <section className="section container">
      <p className="eyebrow">SECURE CHECKOUT</p>

      <h1>Complete your booking</h1>

      <p className="lead">
        Payments remain pending until verified. Never share your PIN or one-time
        password.
      </p>

      {!bookingId ? (
        <div className="rounded-lg border border-amber-300 p-4" role="alert">
          <h2 className="font-semibold">Booking reference required</h2>
          <p>
            Please submit your trip booking request first, then open checkout
            using the booking link.
          </p>
        </div>
      ) : (
        <CheckoutPanel bookingId={bookingId} />
      )}
    </section>
  );
}
