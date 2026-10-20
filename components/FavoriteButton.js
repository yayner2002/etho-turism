"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({
  destinationId,
  initialSaved = false,
}) {
  const router = useRouter();

  const [saved, setSaved] = useState(initialSaved);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved, destinationId]);

  async function toggle() {
    if (loading || !destinationId) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ destinationId }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to save your favorite destinations.");
        }

        throw new Error(
          result.error ||
            result.message ||
            "Could not update your favorite. Please try again.",
        );
      }

      if (
        !Array.isArray(result.favorites) ||
        !result.favorites.every((id) => typeof id === "string")
      ) {
        throw new Error("The server returned an invalid favorites response.");
      }

      setSaved(result.favorites.includes(String(destinationId)));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "A network error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="button button-secondary"
        type="button"
        onClick={toggle}
        disabled={loading || !destinationId}
        aria-pressed={saved}
        aria-busy={loading}
      >
        {loading ? "Saving…" : saved ? "Remove favorite" : "Save favorite"}
      </button>

      {error && (
        <p className="error-message" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
