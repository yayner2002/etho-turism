import Link from "next/link";
import {
  ArrowRight,
  Compass,
  MapPinned,
  Globe2,
  Mountain,
  Sparkles,
} from "lucide-react";

import { destinations, destinationGroups } from "@/data/destinations";

import MapView from "@/components/MapView";

export const metadata = {
  title: "Discover Ethiopia",
  description:
    "Explore Ethiopian destinations, landscapes, heritage, and local travel experiences with EthioTourism.",
};

export default function HomePage() {
  const featured = destinations.slice(0, 6);

  return (
    <main className="home-page">
      {/* Ethiopian flag-inspired accent */}
      <div className="flag-stripe" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-pattern" aria-hidden="true" />

        <div className="container home-hero-content">
          <div className="home-hero-copy">
            <p className="home-eyebrow">
              <Globe2 size={17} />
              ETHIOTOURISM · DISCOVER ETHIOPIA
            </p>

            <h1>
              Find your own
              <br />
              <span className="hero-highlight">extraordinary.</span>
            </h1>

            <p className="home-lead">
              From ancient castles and rock-hewn churches to spectacular
              highlands and beautiful lakes, discover the places and cultures
              that make Ethiopia special.
            </p>

            <div className="home-actions">
              <Link
                className="home-button home-button-primary"
                href="/destinations"
              >
                Explore destinations
                <ArrowRight size={19} />
              </Link>

              <Link
                className="home-button home-button-outline"
                href="/register"
              >
                Create an account
              </Link>
            </div>

            <div className="home-highlights">
              <div>
                <Mountain size={21} />
                <span>Beautiful landscapes</span>
              </div>

              <div>
                <Compass size={21} />
                <span>Historic destinations</span>
              </div>

              <div>
                <Sparkles size={21} />
                <span>Living cultures</span>
              </div>
            </div>
          </div>

          <div className="home-hero-art" aria-label="Explore Ethiopia">
            <div className="hero-art-circle">
              <span className="hero-art-star">✦</span>
              <Globe2 className="hero-art-globe" strokeWidth={1.2} />
              <span className="hero-art-label">LAND OF ORIGINS</span>
              <span className="hero-art-subtitle">Discover Ethiopia</span>
            </div>

            <div className="hero-art-badge">
              <span className="badge-dot" />
              Your next adventure starts here
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="section container home-section">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">
              <span className="eyebrow-dot" />
              START EXPLORING
            </p>
            <h2>Discover Ethiopia</h2>
            <p className="home-section-description">
              Find your next unforgettable destination.
            </p>
          </div>

          <Link className="home-text-link" href="/destinations">
            View all destinations
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="home-destination-grid">
          {featured.map((destination, index) => (
            <article
              className={`home-destination-card accent-${index % 3}`}
              key={destination.id}
            >
              <Link
                className="home-image-link"
                href={`/destinations#${destination.id}`}
                aria-label={`Explore ${destination.name}`}
              >
                <img
                  src={destination.image}
                  alt={`Explore ${destination.name}, ${destination.region}`}
                  loading="lazy"
                />

                <span className="home-image-tag">{destination.region}</span>
              </Link>

              <div className="home-card-body">
                <p className="home-card-number">
                  DESTINATION {String(index + 1).padStart(2, "0")}
                </p>

                <h3>{destination.name}</h3>

                <p className="home-card-description">{destination.tagline}</p>

                <Link
                  className="home-card-link"
                  href={`/destinations#${destination.id}`}
                >
                  Discover this place
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {featured.length === 0 && (
          <div className="empty-state">
            <h3>Destinations coming soon</h3>
            <p>We are preparing places for your next adventure.</p>
          </div>
        )}

        <div className="home-browse-row">
          <Link className="home-button home-button-green" href="/destinations">
            Browse all {destinations.length} destinations
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* MAP */}
      <section className="home-map-section">
        <div className="container home-section">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">
                <MapPinned size={17} />
                FIND YOUR WAY
              </p>
              <h2>Explore the map</h2>
              <p className="home-section-description">
                Get to know Ethiopia's destinations geographically.
              </p>
            </div>
          </div>

          <div className="home-map-frame">
            <MapView />
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section className="section container home-section">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">
              <Compass size={17} />
              EXPLORE BY REGION
            </p>
            <h2>Choose your next adventure</h2>
            <p className="home-section-description">
              Browse destination groups to find places that match your
              interests.
            </p>
          </div>

          <span className="home-count">{destinationGroups.length} groups</span>
        </div>

        <div className="home-group-grid">
          {destinationGroups.map((group, index) => {
            const count = destinations.filter(
              (destination) => destination.group === group.id,
            ).length;

            return (
              <Link
                className={`home-group-card group-accent-${index % 3}`}
                href={`/destinations?group=${encodeURIComponent(group.id)}`}
                key={group.id}
              >
                <div className="home-group-icon">
                  <Compass size={22} />
                </div>

                <div className="home-group-content">
                  <strong>{group.name}</strong>
                  <span>
                    {count} {count === 1 ? "destination" : "destinations"}
                  </span>
                </div>

                <ArrowRight className="home-group-arrow" size={19} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="container home-cta-wrap">
        <div className="home-cta">
          <div className="home-cta-decoration" aria-hidden="true">
            ✦
          </div>

          <div className="home-cta-copy">
            <p className="home-eyebrow home-cta-eyebrow">PLAN THOUGHTFULLY</p>

            <h2>Make room for meaningful travel.</h2>

            <p>
              Save your favorite places, plan your journey, and start
              discovering the beauty of Ethiopia.
            </p>

            <div className="home-actions">
              <Link
                className="home-button home-button-yellow"
                href="/destinations"
              >
                Start exploring
                <ArrowRight size={18} />
              </Link>

              <Link className="home-cta-secondary" href="/dashboard">
                Open my dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

