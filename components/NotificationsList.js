"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyIds, setBusyIds] = useState([]);

  const loadNotifications = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/notifications", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Please sign in to view your notifications."
            : data.error || data.message || "Unable to load notifications.",
        );
      }

      if (!Array.isArray(data.notifications)) {
        throw new Error(
          "The server returned an invalid notifications response.",
        );
      }

      setItems(data.notifications);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load notifications. Please try again.",
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadNotifications(controller.signal);

    return () => controller.abort();
  }, [loadNotifications]);

  async function markRead(id) {
    if (!id || busyIds.includes(id)) return;

    setActionError("");
    setBusyIds((current) => [...current, id]);

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ notificationId: id }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Your session may have expired. Please sign in again."
            : data.error ||
                data.message ||
                "Unable to mark notification as read.",
        );
      }

      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                readAt: data.notification?.readAt || new Date().toISOString(),
              }
            : item,
        ),
      );
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Could not update the notification. Please try again.",
      );
    } finally {
      setBusyIds((current) => current.filter((busyId) => busyId !== id));
    }
  }

  if (loading) {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <p>Loading your notifications…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <p className="error-message" role="alert">
          {error}
        </p>
        {error.toLowerCase().includes("sign in") && (
          <Link href="/login?next=/notifications">Sign in</Link>
        )}
        <button
          className="button button-secondary"
          type="button"
          onClick={() => loadNotifications()}
        >
          Try again
        </button>
      </div>
    );
  }

  const unreadCount = items.filter((item) => !item.readAt).length;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>No notifications yet</h2>
        <p>Booking and payment updates will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <p aria-live="polite">
        {unreadCount} unread{" "}
        {unreadCount === 1 ? "notification" : "notifications"}
      </p>

      {actionError && (
        <p className="error-message" role="alert" aria-live="polite">
          {actionError}
        </p>
      )}

      <div className="card-grid">
        {items.map((item) => {
          const isBusy = busyIds.includes(item.id);

          return (
            <article className="card" key={item.id}>
              <p className="eyebrow">
                {String(item.type || "update").replaceAll("_", " ")}
              </p>

              <h2>{item.title || "Account update"}</h2>
              <p>{item.message || "You have a new account update."}</p>

              {item.createdAt && (
                <small>
                  {Number.isNaN(Date.parse(item.createdAt))
                    ? "Date unavailable"
                    : new Date(item.createdAt).toLocaleString()}
                </small>
              )}

              {item.readAt ? (
                <p>
                  <small>Read</small>
                </p>
              ) : (
                <p>
                  <button
                    className="button button-secondary"
                    type="button"
                    disabled={isBusy}
                    onClick={() => markRead(item.id)}
                  >
                    {isBusy ? "Updating…" : "Mark as read"}
                  </button>
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
