import { destinations } from "@/data/destinations";

export default function sitemap() {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/+$/, "");

  const lastModified = new Date();

  const publicPages = ["", "/destinations", "/booking", "/about", "/contact"];

  const staticEntries = publicPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const destinationEntries = destinations.map((destination) => ({
    url: `${siteUrl}/destinations/${encodeURIComponent(destination.id)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...destinationEntries];
}
