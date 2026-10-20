import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination, destinations } from "@/data/destinations";
import FavoriteButton from "@/components/FavoriteButton";

export const instant = false;

export function generateStaticParams() {
  return destinations.map((destination) => ({ id: destination.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const destination = getDestination(id);

  if (!destination) return { title: "Destination not found" };

  return {
    title: destination.name,
    description: destination.description,
  };
}

export default async function DestinationDetailsPage({ params }) {
  const { id } = await params;
  const destination = getDestination(id);

  if (!destination) notFound();

  return (
    <section className="section container detail-page">
      <Link href="/destinations">← All destinations</Link>
      <p className="eyebrow">
        {destination.region} · {destination.category}
      </p>
      <h1>{destination.name}</h1>
      <img
        className="detail-image"
        src={destination.image}
        alt={`Illustration for ${destination.name}`}
      />
      <p className="lead">{destination.tagline}</p>
      <p>{destination.description}</p>

      <div className="dashboard-stats">
        <div>
          <strong>{destination.duration}</strong>
          <span>Suggested duration</span>
        </div>
        <div>
          <strong>{destination.bestTime}</strong>
          <span>When to visit</span>
        </div>
        <div>
          <strong>{destination.price.toLocaleString("en-US")} ETB</strong>
          <span>Illustrative planning estimate</span>
        </div>
      </div>

      <h2>Highlights</h2>
      <ul>
        {destination.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Suggested itinerary</h2>
      <ol>
        {destination.itinerary.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <FavoriteButton destinationId={destination.id} />

      <p className="notice">
        This is a tourism discovery demo. Confirm travel advice, opening hours,
        permits, prices, and access with local authorities or qualified guides
        before making arrangements.
      </p>
    </section>
  );
}
