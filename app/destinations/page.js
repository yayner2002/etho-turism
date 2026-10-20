"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { destinations, destinationGroups } from "@/data/destinations";
import FavoriteButton from "@/components/FavoriteButton";
import DestinationMap from "@/components/DestinationMapLoader";

export default function DestinationsPage() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesGroup = group === "all" || destination.group === group;

      const searchableText = [
        destination.name,
        destination.region,
        destination.category,
        destination.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesGroup && matchesSearch;
    });
  }, [group, search]);

  // Convert destination data into the format expected by DestinationMap.
  // Destinations without valid coordinates will be omitted by the map.
  const mapPlaces = useMemo(() => {
    return filtered
      .filter(
        (destination) =>
          Array.isArray(destination.coordinates) &&
          destination.coordinates.length === 2 &&
          destination.coordinates.every(
            (coordinate) =>
              typeof coordinate === "number" && Number.isFinite(coordinate),
          ),
      )
      .map((destination) => ({
        id: destination.id,
        name: destination.name,
        region: destination.region,
        coordinates: destination.coordinates,
      }));
  }, [filtered]);

  return (
    <main className="section container">
      <p className="eyebrow">THE COLLECTION</p>

      <h1>Explore Ethiopian Destinations</h1>

      <p className="lead">
        Search destinations, filter by group, discover places on the interactive
        map, and open destination details.
      </p>

      <div className="filter-bar">
        <label>
          Search destinations
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try Gondar, lake, or mountains"
            aria-label="Search destinations"
          />
        </label>

        <label>
          Destination group
          <select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
            aria-label="Filter by destination group"
          >
            <option value="all">All groups</option>

            {destinationGroups.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="muted" aria-live="polite">
        Showing {filtered.length} of {destinations.length} destinations
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2>No matching destinations</h2>
          <p>Try another search or select all destination groups.</p>

          <button
            type="button"
            className="button"
            onClick={() => {
              setSearch("");
              setGroup("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="destination-grid">
          {filtered.map((destination) => (
            <article
              className="destination-card"
              id={destination.id}
              key={destination.id}
            >
              <img
                src={destination.image}
                alt={`View of ${destination.name}`}
                loading="lazy"
              />

              <div className="card-body">
                <p className="eyebrow">
                  {destination.region} · {destination.category}
                </p>

                <h2>{destination.name}</h2>

                <p>{destination.description}</p>

                {destination.duration && (
                  <p>
                    <strong>Suggested duration:</strong> {destination.duration}
                  </p>
                )}

                <div className="actions">
                  <Link
                    className="button"
                    href={`/destinations/${destination.id}`}
                  >
                    View details
                  </Link>

                  <FavoriteButton destinationId={destination.id} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <section
        className="destination-map-section"
        aria-labelledby="destination-map-heading"
      >
        <div className="section-heading">
          <h2 id="destination-map-heading">Destination Map</h2>

          <p className="lead">
            Explore the approximate locations of your filtered destinations.
          </p>
        </div>

        {mapPlaces.length > 0 ? (
          <DestinationMap places={mapPlaces} />
        ) : (
          <div className="empty-state">
            <p>
              No coordinates are available for the matching destinations. Add a
              valid coordinates array to the destination data to show them on
              the map.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
