export default function robots() {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/destinations",
        "/destinations/",
        "/booking",
        "/about",
        "/contact",
      ],
      disallow: [
        "/api/",
        "/admin",
        "/admin/",
        "/dashboard",
        "/dashboard/",
        "/staff",
        "/staff/",
        "/notifications",
        "/notifications/",
        "/login",
        "/register",
        "/checkout",
        "/profile",
        "/account",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
