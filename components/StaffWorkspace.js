"use client";

import { useCallback, useEffect, useState } from "react";

const BOOKING_STATUSES = ["pending", "approved", "cancelled", "completed"];

function formatETB(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "ETB 0.00";
  }

  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session may have expired. Please sign in again.");
    }

    if (response.status === 403) {
      throw new Error("You do not have permission to manage bookings.");
    }

    throw new Error(
      data.error || data.message || "The request could not be completed.",
    );
  }

  return data;
}

export default function StaffWorkspace() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingIds, setUpdatingIds] = useState([]);

  const loadBookings = useCallback(async ({ refresh = false } = {}) => {
    setError("");

    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await readResponse(response);

      if (!Array.isArray(data.bookings)) {
        throw new Error("The server returned an invalid bookings response.");
      }

      setBookings(data.bookings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load bookings. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();

    // Avoid setting state after unmounting and cancel stale requests.
    // The initial request is managed by the effect's AbortController below.
  }, [loadBookings]);

  async function updateBooking(bookingId, status) {
    if (
      !bookingId ||
      !BOOKING_STATUSES.includes(status) ||
      updatingIds.includes(bookingId)
    ) {
      return;
    }

    const previousBooking = bookings.find(
      (booking) => booking.id === bookingId,
    );

    if (!previousBooking || previousBooking.status === status) {
      return;
    }

    setError("");
    setNotice("");
    setUpdatingIds((current) => [...current, bookingId]);

    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          bookingId,
          status,
        }),
      });

      const data = await readResponse(response);

      if (!data.booking || data.booking.id !== bookingId) {
        throw new Error("The server returned an invalid booking update.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? data.booking : booking,
        ),
      );

      setNotice("Booking status updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the booking. Please try again.",
      );
    } finally {
      setUpdatingIds((current) => current.filter((id) => id !== bookingId));
    }
  }

  if (loading) {
    return (
      <section className="staff-workspace" aria-busy="true">
        <p role="status" aria-live="polite">
          Loading booking requests…
        </p>
      </section>
    );
  }

  return (
    <section className="staff-workspace">
      <div className="staff-workspace-header">
        <div>
          <p className="eyebrow">BOOKING MANAGEMENT</p>
          <h2>Staff workspace</h2>
          <p>Review customer reservations and update their booking status.</p>
        </div>

        <button
          type="button"
          className="button button-secondary"
          onClick={() => loadBookings({ refresh: true })}
          disabled={refreshing || updatingIds.length > 0}
        >
          {refreshing ? "Refreshing…" : "Refresh bookings"}
        </button>
      </div>

      {error && (
        <div className="error-message" role="alert" aria-live="assertive">
          <p>{error}</p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => loadBookings({ refresh: true })}
            disabled={refreshing}
          >
            Try again
          </button>
        </div>
      )}

      {notice && (
        <p className="success-message" role="status" aria-live="polite">
          {notice}
        </p>
      )}

      {!loading && bookings.length === 0 && !error && (
        <div className="empty-state">
          <h2>No booking requests</h2>
          <p>New customer booking requests will appear here.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Customer bookings and their current status
            </caption>

            <thead>
              <tr>
                <th scope="col">Destination</th>
                <th scope="col">Customer</th>
                <th scope="col">Travel date</th>
                <th scope="col">Travelers</th>
                <th scope="col">Amount</th>
                <th scope="col">Booking status</th>
                <th scope="col">Payment status</th>
                <th scope="col">Update</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => {
                const isUpdating = updatingIds.includes(booking.id);
                const validStatus = BOOKING_STATUSES.includes(booking.status);

                return (
                  <tr key={booking.id}>
                    <td>{booking.destinationName || "Unknown destination"}</td>

                    <td>
                      <strong>{booking.name || "Unknown customer"}</strong>
                      <br />
                      <a href={`mailto:${booking.email || ""}`}>
                        {booking.email || "No email provided"}
                      </a>
                    </td>

                    <td>{booking.travelDate || "Not specified"}</td>

                    <td>
                      {Number.isFinite(Number(booking.travelers))
                        ? Number(booking.travelers)
                        : "—"}
                    </td>

                    <td>{formatETB(booking.amountETB)}</td>

                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status || "Unknown"}
                      </span>
                    </td>

                    <td>{booking.paymentStatus || "pending"}</td>

                    <td>
                      <label
                        className="sr-only"
                        htmlFor={`booking-status-${booking.id}`}
                      >
                        Update booking for{" "}
                        {booking.destinationName || "destination"}
                      </label>

                      <select
                        id={`booking-status-${booking.id}`}
                        value={validStatus ? booking.status : "pending"}
                        disabled={isUpdating || !validStatus}
                        onChange={(event) =>
                          updateBooking(booking.id, event.target.value)
                        }
                      >
                        {!validStatus && (
                          <option value="pending" disabled>
                            Invalid status
                          </option>
                        )}

                        {BOOKING_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>

                      {isUpdating && (
                        <span role="status" aria-live="polite">
                          Saving…
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="staff-workspace-count">
        Total bookings: <strong>{bookings.length}</strong>
      </p>
    </section>
  );
}
