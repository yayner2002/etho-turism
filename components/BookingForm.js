"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const INITIAL_TRAVELERS = "2";

function getTodayInEthiopia() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Addis_Ababa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function createInitialForm(initialUser, destinations) {
  return {
    name: initialUser?.name ?? "",
    email: initialUser?.email ?? "",
    phone: "",
    destinationId: destinations[0]?.id ? String(destinations[0].id) : "",
    travelDate: "",
    travelers: INITIAL_TRAVELERS,
    message: "",
  };
}

export default function BookingForm({ destinations = [], initialUser = null }) {
  const [today, setToday] = useState("");
  const [form, setForm] = useState(() =>
    createInitialForm(initialUser, destinations),
  );
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToday(getTodayInEthiopia());
  }, []);

  // Keep the selected destination valid if the available list changes.
  useEffect(() => {
    if (!destinations.length) {
      setForm((previous) => ({
        ...previous,
        destinationId: "",
      }));
      return;
    }

    setForm((previous) => {
      const selectionExists = destinations.some(
        (item) => String(item.id) === previous.destinationId,
      );

      if (selectionExists) {
        return previous;
      }

      return {
        ...previous,
        destinationId: String(destinations[0].id),
      };
    });
  }, [destinations]);

  function update(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function submit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setBooking(null);

    if (!destinations.length) {
      setError("No destinations are available. Please try again later.");
      return;
    }

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    const email = form.email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!destinations.some((item) => String(item.id) === form.destinationId)) {
      setError("Please select a valid destination.");
      return;
    }

    if (!form.travelDate) {
      setError("Please select your preferred travel date.");
      return;
    }

    if (today && form.travelDate < today) {
      setError("Your travel date cannot be in the past.");
      return;
    }

    const travelers = Number(form.travelers);

    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 10) {
      setError("Please select between 1 and 10 travelers.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          name: form.name.trim(),
          email,
          phone: form.phone.trim(),
          destinationId: form.destinationId,
          travelDate: form.travelDate,
          travelers,
          message: form.message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error("Please sign in before submitting your trip inquiry.");
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "Unable to submit your inquiry. Please try again.",
        );
      }

      // Accept only a booking object returned by the API.
      if (!result.booking || typeof result.booking !== "object") {
        throw new Error(
          "The server response did not include booking details. Please check your bookings before submitting again.",
        );
      }

      setBooking(result.booking);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (booking) {
    const bookingId = booking.id ?? booking.bookingId ?? "";

    const destinationId = String(
      booking.destinationId ?? booking.destination ?? "",
    );

    const destinationName =
      booking.destinationName ||
      destinations.find((item) => String(item.id) === destinationId)?.name ||
      destinationId ||
      "Not specified";

    return (
      <div className="empty-state" role="status">
        <h2>Inquiry received</h2>

        <p>
          Reference: <strong>{bookingId || "Received"}</strong>
        </p>

        <p>Destination: {destinationName}</p>

        <p>
          Requested date:{" "}
          {booking.travelDate ?? booking.date ?? "Not specified"}
        </p>

        <p>
          Your booking request is pending review. It is not confirmed until
          authorized staff approve it. Payment is not confirmed until it has
          been verified.
        </p>

        {bookingId ? (
          <Link
            className="button"
            href={`/checkout?bookingId=${encodeURIComponent(
              String(bookingId),
            )}`}
          >
            Continue to checkout
          </Link>
        ) : (
          <p className="muted">
            A booking reference was not returned. Please contact the site
            administrator before proceeding to checkout.
          </p>
        )}

        <button
          className="button"
          onClick={() => {
            setBooking(null);
            setError("");
            setForm(createInitialForm(initialUser, destinations));
          }}
          type="button"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form className="form-stack" onSubmit={submit} noValidate>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <label htmlFor="booking-name">
        Full name
        <input
          id="booking-name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          value={form.name}
          onChange={update}
          disabled={loading}
        />
      </label>

      <label htmlFor="booking-email">
        Email address
        <input
          id="booking-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          value={form.email}
          onChange={update}
          disabled={loading}
        />
      </label>

      <label htmlFor="booking-phone">
        Phone number (optional)
        <input
          id="booking-phone"
          name="phone"
          type="tel"
          maxLength={40}
          autoComplete="tel"
          value={form.phone}
          onChange={update}
          disabled={loading}
        />
      </label>

      <label htmlFor="booking-destination">
        Destination
        <select
          id="booking-destination"
          name="destinationId"
          value={form.destinationId}
          onChange={update}
          required
          disabled={loading || !destinations.length}
        >
          <option value="" disabled>
            Select a destination
          </option>

          {destinations.map((item) => (
            <option value={String(item.id)} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="booking-travel-date">
        Preferred travel date
        <input
          id="booking-travel-date"
          name="travelDate"
          type="date"
          min={today || undefined}
          required
          value={form.travelDate}
          onChange={update}
          disabled={loading}
        />
      </label>

      <label htmlFor="booking-travelers">
        Travelers
        <select
          id="booking-travelers"
          name="travelers"
          value={form.travelers}
          onChange={update}
          required
          disabled={loading}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
            <option value={String(number)} key={number}>
              {number} {number === 1 ? "traveler" : "travelers"}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="booking-message">
        Trip interests or questions (optional)
        <textarea
          id="booking-message"
          name="message"
          rows={4}
          maxLength={1000}
          value={form.message}
          onChange={update}
          disabled={loading}
        />
      </label>

      <button
        className="button"
        type="submit"
        disabled={loading || !destinations.length}
      >
        {loading ? "Submitting..." : "Send trip inquiry"}
      </button>

      <p className="muted">
        This form submits a booking inquiry. It does not charge you or
        automatically confirm a reservation.
      </p>
    </form>
  );
}
