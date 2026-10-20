"use client";

import { useMemo, useState } from "react";
import {
  BANK_ACCOUNTS,
  SERVICE_FEE_RATE,
  formatETB,
  normalizeEthiopianPhone,
} from "@/lib/payment-config";
import "./payment-options.css";

export default function PaymentOptions({ amount = 0, onSubmit }) {
  const [method, setMethod] = useState("telebirr");
  const [phone, setPhone] = useState("");
  const [bankId, setBankId] = useState("amhara");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = Number(amount);
  const validAmount =
    Number.isFinite(subtotal) &&
    subtotal > 0 &&
    Number.isSafeInteger(Math.round(subtotal * 100));

  const displaySubtotal = validAmount ? Math.round(subtotal * 100) / 100 : 0;

  const { fee, total } = useMemo(() => {
    const subtotalCents = Math.round(displaySubtotal * 100);
    const feeCents = Math.round(subtotalCents * SERVICE_FEE_RATE);

    return {
      fee: feeCents / 100,
      total: (subtotalCents + feeCents) / 100,
    };
  }, [displaySubtotal]);

  const selectedBank = BANK_ACCOUNTS.find((bank) => bank.id === bankId);

  const bankReady = Boolean(
    selectedBank?.accountName?.trim() && selectedBank?.accountNumber?.trim(),
  );

  const canSubmit =
    validAmount && !submitting && (method !== "bank_transfer" || bankReady);

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setError("");

    if (!validAmount) {
      setError("The booking amount is invalid. Please review your booking.");
      return;
    }

    if (typeof onSubmit !== "function") {
      setError("Payment submission is not connected to the server yet.");
      return;
    }

    let paymentDetails;

    if (method === "telebirr") {
      const normalizedPhone = normalizeEthiopianPhone(phone);

      if (!normalizedPhone) {
        setError(
          "Enter a valid Ethiopian mobile number, such as 0912345678 or +251912345678.",
        );
        return;
      }

      paymentDetails = {
        method: "telebirr",
        phone: normalizedPhone,
      };
    } else if (method === "bank_transfer") {
      if (!selectedBank || !bankReady) {
        setError(
          "This bank's receiving account is not configured. Please contact the site administrator.",
        );
        return;
      }

      const cleanReference = reference.trim();

      if (cleanReference.length < 3 || cleanReference.length > 120) {
        setError("Enter a transfer reference between 3 and 120 characters.");
        return;
      }

      paymentDetails = {
        method: "bank_transfer",
        bankId: selectedBank.id,
        reference: cleanReference,
      };
    } else {
      setError("Please select a supported payment method.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        ...paymentDetails,
        currency: "ETB",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="payment-panel"
      onSubmit={handleSubmit}
      aria-busy={submitting}
    >
      <h2>Payment</h2>

      <p className="payment-muted">
        Choose a payment method for your EthioTourism booking.
      </p>

      <div className="payment-total" aria-label="Booking cost summary">
        <div>
          <span>Booking amount</span>
          <strong>{formatETB(displaySubtotal)}</strong>
        </div>

        <div>
          <span>Service fee ({SERVICE_FEE_RATE * 100}%)</span>
          <strong>{formatETB(fee)}</strong>
        </div>

        <div className="payment-grand-total">
          <span>Total to pay</span>
          <strong>{formatETB(total)}</strong>
        </div>
      </div>

      <label htmlFor="payment-method">Payment method</label>

      <select
        id="payment-method"
        value={method}
        onChange={(event) => {
          setMethod(event.target.value);
          setError("");
        }}
        disabled={submitting}
        required
      >
        <option value="telebirr">Telebirr</option>
        <option value="bank_transfer">Bank transfer</option>
      </select>

      {method === "telebirr" && (
        <div className="payment-fields">
          <label htmlFor="telebirr-phone">Ethiopian mobile number</label>

          <input
            id="telebirr-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="0912345678 or +251912345678"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setError("");
            }}
            disabled={submitting}
            required
          />

          <small>
            This form records a payment request; it does not initiate or confirm
            a Telebirr transaction.
          </small>
        </div>
      )}

      {method === "bank_transfer" && (
        <div className="payment-fields">
          <label htmlFor="bank">Select your bank</label>

          <select
            id="bank"
            name="bankId"
            value={bankId}
            onChange={(event) => {
              setBankId(event.target.value);
              setError("");
            }}
            disabled={submitting}
            required
          >
            {BANK_ACCOUNTS.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>

          {bankReady ? (
            <div className="bank-account-details">
              <p>
                <strong>Account name:</strong> {selectedBank.accountName}
              </p>

              <p>
                <strong>Account number:</strong> {selectedBank.accountNumber}
              </p>

              <p>
                <strong>Transfer amount:</strong> {formatETB(total)}
              </p>
            </div>
          ) : (
            <p className="payment-notice" role="status">
              Official receiving account details must be configured before this
              bank can accept transfers.
            </p>
          )}

          <label htmlFor="bank-reference">Transfer reference number</label>

          <input
            id="bank-reference"
            name="reference"
            type="text"
            autoComplete="off"
            minLength={3}
            maxLength={120}
            value={reference}
            onChange={(event) => {
              setReference(event.target.value);
              setError("");
            }}
            placeholder="Enter your bank transaction reference"
            aria-describedby="reference-help"
            disabled={submitting || !bankReady}
            required
          />

          <small id="reference-help">
            Enter the transaction reference shown on your bank receipt. Your
            payment remains pending until the transfer is verified.
          </small>
        </div>
      )}

      {error && (
        <p className="payment-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button className="payment-submit" type="submit" disabled={!canSubmit}>
        {submitting ? "Submitting payment request…" : "Continue to payment"}
      </button>

      <p className="payment-disclaimer">
        Your payment request remains pending until the transaction is
        independently verified. A submitted reference is not proof of payment.
      </p>
    </form>
  );
}
