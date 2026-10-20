import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export const metadata = {
  title: "Checkout",
  description:
    "Review your EthioTourism booking and submit a pending payment request.",
  robots: { index: false, follow: false },
};

function CheckoutLoading() {
  return (
    <section className="section container">
      <p className="eyebrow">SECURE CHECKOUT</p>
      <h1>Complete your booking</h1>
      <p className="lead">Loading your booking details...</p>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
