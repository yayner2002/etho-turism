"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const EMPTY_DATA = {
  users: [],
  bookings: [],
  payments: [],
};

const VALID_ROLES = ["customer", "staff", "admin"];

const ETB_FORMATTER = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatETB(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return "ETB —";
  }

  return ETB_FORMATTER.format(amount);
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.error ||
        result.message ||
        `Request failed with status ${response.status}.`,
    );
  }

  return result;
}

export default function AdminDashboard() {
  const [data, setData] = useState(EMPTY_DATA);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyAction, setBusyAction] = useState("");

  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/admin", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await readResponse(response);

      if (
        !Array.isArray(result.users) ||
        !Array.isArray(result.bookings) ||
        !Array.isArray(result.payments)
      ) {
        throw new Error("The admin API returned an invalid data format.");
      }

      setData({
        users: result.users,
        bookings: result.bookings,
        payments: result.payments,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load administration data.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function adminAction(payload, successMessage) {
    if (busyAction) return;

    setError("");
    setNotice("");

    const actionKey = `${payload.action}:${payload.userId || payload.paymentId || ""}`;
    setBusyAction(actionKey);

    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      await readResponse(response);

      setNotice(successMessage);
      await load({ silent: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The requested action failed.",
      );
    } finally {
      setBusyAction("");
    }
  }

  function changeRole(user, newRole) {
    if (!VALID_ROLES.includes(newRole) || newRole === user.role) {
      return;
    }

    const confirmed = window.confirm(
      `Change ${user.name || user.email}'s role from ${user.role} to ${newRole}?`,
    );

    if (!confirmed) return;

    adminAction(
      {
        action: "set_role",
        userId: user.id,
        role: newRole,
      },
      `Role update requested for ${user.email}.`,
    );
  }

  function verifyPayment(payment) {
    const reference = window
      .prompt(
        "Enter the transaction reference you independently verified with Telebirr or the bank:",
      )
      ?.trim();

    if (!reference) return;

    const confirmed = window.confirm(
      `Confirm that payment ${payment.id} was actually received and verified using the provider or bank records?`,
    );

    if (!confirmed) return;

    adminAction(
      {
        action: "verify_payment",
        paymentId: payment.id,
        decision: "paid",
        verificationReference: reference,
      },
      `Verification decision submitted for payment ${payment.id}.`,
    );
  }

  function rejectPayment(payment) {
    const confirmed = window.confirm(
      `Reject payment request ${payment.id}? Make sure the decision is supported by your payment records.`,
    );

    if (!confirmed) return;

    adminAction(
      {
        action: "verify_payment",
        paymentId: payment.id,
        decision: "rejected",
      },
      `Rejection decision submitted for payment ${payment.id}.`,
    );
  }

  if (loading) {
    return (
      <section className="container section">
        <h1>Admin Dashboard</h1>
        <p role="status" aria-live="polite">
          Loading administration data…
        </p>
      </section>
    );
  }

  if (
    error &&
    !data.users.length &&
    !data.bookings.length &&
    !data.payments.length
  ) {
    return (
      <section className="container section">
        <h1>Admin Dashboard</h1>
        <p className="error-message" role="alert">
          {error}
        </p>
        <button className="button" type="button" onClick={() => load()}>
          Try again
        </button>
      </section>
    );
  }

  const pendingPayments = data.payments.filter(
    (payment) => payment.status === "pending",
  ).length;

  return (
    <section className="container section">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Admin Dashboard</h1>

      <p>
        Manage account roles, review bookings, and assess payment requests. Only
        mark a payment as paid after independently verifying the actual
        transaction with the payment provider or bank.
      </p>

      {error && (
        <p className="error-message" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {notice && (
        <p role="status" aria-live="polite">
          {notice}
        </p>
      )}

      <button
        className="button button-secondary"
        type="button"
        disabled={refreshing || Boolean(busyAction)}
        onClick={() => load({ silent: true })}
      >
        {refreshing ? "Refreshing…" : "Refresh dashboard"}
      </button>

      <div className="dashboard-stats">
        <div>
          <strong>{data.users.length}</strong>
          <span>Accounts</span>
        </div>
        <div>
          <strong>{data.bookings.length}</strong>
          <span>Bookings</span>
        </div>
        <div>
          <strong>{pendingPayments}</strong>
          <span>Pending payments</span>
        </div>
      </div>

      <p>
        <Link href="/staff">Open staff workspace</Link>
        {" · "}
        <Link href="/notifications">View notifications</Link>
      </p>

      <h2>Account roles</h2>

      {data.users.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current role</th>
                <th>Change role</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || "—"}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <select
                      aria-label={`Role for ${user.email}`}
                      value={user.role}
                      disabled={
                        Boolean(busyAction) || !VALID_ROLES.includes(user.role)
                      }
                      onChange={(event) => changeRole(user, event.target.value)}
                    >
                      {VALID_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Payment requests</h2>

      {data.payments.length === 0 ? (
        <p>No payment requests yet.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Booking ID</th>
                <th>Method / Bank</th>
                <th>Total</th>
                <th>Status</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.bookingId || "—"}</td>
                  <td>
                    {payment.method || "—"}
                    {payment.bankName ? ` — ${payment.bankName}` : ""}
                  </td>
                  <td>{formatETB(payment.totalETB)}</td>
                  <td>{payment.status || "unknown"}</td>
                  <td>
                    {payment.status === "pending" ? (
                      <div>
                        <button
                          className="button button-secondary"
                          type="button"
                          disabled={Boolean(busyAction)}
                          onClick={() => verifyPayment(payment)}
                        >
                          Verify payment
                        </button>{" "}
                        <button
                          className="button button-secondary"
                          type="button"
                          disabled={Boolean(busyAction)}
                          onClick={() => rejectPayment(payment)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      payment.verificationReference || "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
