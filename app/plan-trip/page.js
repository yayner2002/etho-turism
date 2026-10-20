"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";

export default function PlanTripPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destinationId: "",
    travelDate: "",
    travelers: "1",
    message: "",
  });

  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Addis_Ababa",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const values = Object.fromEntries(
      parts.map((part) => [part.type, part.value]),
    );

    setToday(`${values.year}-${values.month}-${values.day}`);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const destinationId = form.destinationId;
    const travelDate = form.travelDate;
    const travelers = Number(form.travelers);
    const message = form.message.trim();

    if (name.length < 2 || name.length > 100) {
      setError("Enter your name (2–100 characters).");
      return;
    }

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (phone.length > 40) {
      setError("Your phone number must be 40 characters or fewer.");
      return;
    }

    const selectedDestination = destinations.find(
      (destination) => String(destination.id) === destinationId,
    );

    if (!selectedDestination) {
      setError("Please select a valid destination.");
      return;
    }

    if (!today || !travelDate || travelDate < today) {
      setError("Please select today or a future travel date.");
      return;
    }

    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) {
      setError("Please enter between 1 and 50 travelers.");
      return;
    }

    if (message.length > 1000) {
      setError("Your additional message must be 1,000 characters or fewer.");
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
          name,
          email,
          phone,
          destinationId,
          travelDate,
          travelers,
          message,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error(
          "Please sign in before submitting your booking request.",
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "Unable to save your booking request.",
        );
      }

      const bookingId = result.booking?.id;

      if (
        bookingId === undefined ||
        bookingId === null ||
        String(bookingId).trim() === ""
      ) {
        throw new Error(
          "The server did not return a booking ID. Check your bookings before trying again.",
        );
      }

      setSuccess("Your booking request was saved successfully.");

      router.push(
        `/checkout?bookingId=${encodeURIComponent(String(bookingId))}`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
        Explore Ethiopia
      </p>

      <h1 className="mb-3 text-3xl font-bold">Plan Your Trip</h1>

      <p className="mb-8 text-gray-600">
        Choose your destination, select your travel date, and submit your
        booking request.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block font-medium">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 p-3"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-medium">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            maxLength={254}
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 p-3"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block font-medium">
            Phone number (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            maxLength={40}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 p-3"
            placeholder="Enter your phone number"
          />
          <p className="mt-1 text-sm text-gray-500">
            Provide a phone number if required for your booking.
          </p>
        </div>

        <div>
          <label htmlFor="destinationId" className="mb-2 block font-medium">
            Destination
          </label>
          <select
            id="destinationId"
            name="destinationId"
            value={form.destinationId}
            onChange={handleChange}
            required
            disabled={loading || destinations.length === 0}
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="">Choose a destination</option>
            {destinations.map((destination) => (
              <option key={destination.id} value={String(destination.id)}>
                {destination.name}
              </option>
            ))}
          </select>

          {destinations.length === 0 && (
            <p className="mt-1 text-sm text-red-600">
              No destinations are currently available.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="travelDate" className="mb-2 block font-medium">
            Travel date
          </label>
          <input
            id="travelDate"
            name="travelDate"
            type="date"
            min={today || undefined}
            value={form.travelDate}
            onChange={handleChange}
            required
            disabled={loading || !today}
            className="w-full rounded-lg border border-gray-300 p-3"
          />
        </div>

        <div>
          <label htmlFor="travelers" className="mb-2 block font-medium">
            Number of travelers
          </label>
          <input
            id="travelers"
            name="travelers"
            type="number"
            min="1"
            max="50"
            step="1"
            value={form.travelers}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 p-3"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block font-medium">
            Additional requests (optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 p-3"
            placeholder="Tell us about any special travel requirements."
          />
        </div>

        {error && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
            role="status"
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !today || destinations.length === 0}
          className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting booking..." : "Submit Booking Request"}
        </button>

        <p className="text-sm text-gray-500">
          Submitting creates a booking request. It does not automatically
          confirm your trip or verify payment.
        </p>
      </form>

      <p className="mt-8">
        <Link
          href="/destinations"
          className="text-blue-700 underline hover:text-blue-900"
        >
          Explore destinations
        </Link>
      </p>
    </main>
  );
}
