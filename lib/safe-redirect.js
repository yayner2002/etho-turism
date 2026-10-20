const INTERNAL_ORIGIN = "https://ethio-tourism.local";

export function safeRedirectPath(value, fallback = "/dashboard") {
  // Validate the fallback too, so an unsafe fallback cannot introduce
  // an external redirect.
  const safeFallback =
    typeof fallback === "string" &&
    fallback.startsWith("/") &&
    !fallback.startsWith("//") &&
    !fallback.includes("\\") &&
    !/[\u0000-\u001F\u007F]/.test(fallback)
      ? fallback
      : "/dashboard";

  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > 2048 ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return safeFallback;
  }

  try {
    const base = new URL(INTERNAL_ORIGIN);
    const target = new URL(value, base);

    // Allow only URLs that remain on the internal origin.
    if (target.origin !== base.origin) {
      return safeFallback;
    }

    // Reject credentials and any unexpected URL components.
    if (target.username || target.password) {
      return safeFallback;
    }

    // Return only a relative URL, never an absolute URL.
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return safeFallback;
  }
}
