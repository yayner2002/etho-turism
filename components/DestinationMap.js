"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [9.145, 40.4897];

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function isValidPlace(place) {
  return (
    place &&
    place.id != null &&
    Array.isArray(place.coordinates) &&
    place.coordinates.length === 2 &&
    Number.isFinite(place.coordinates[0]) &&
    Number.isFinite(place.coordinates[1]) &&
    place.coordinates[0] >= -90 &&
    place.coordinates[0] <= 90 &&
    place.coordinates[1] >= -180 &&
    place.coordinates[1] <= 180
  );
}

function createPopupContent(place) {
  const container = document.createElement("div");
  const title = document.createElement("strong");

  title.textContent = place.name || "Ethiopian destination";
  container.appendChild(title);

  if (place.region) {
    const region = document.createElement("p");
    region.textContent = place.region;
    container.appendChild(region);
  }

  return container;
}

export default function DestinationMap({ places = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Avoid initializing a second map on the same DOM element.
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    const map = L.map(container, {
      center: DEFAULT_CENTER,
      zoom: 5,
      scrollWheelZoom: false,
    });

    L.tileLayer(TILE_URL, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const validPlaces = Array.isArray(places)
      ? places.filter(isValidPlace)
      : [];

    const markers = [];

    validPlaces.forEach((place) => {
      const marker = L.marker(place.coordinates, {
        icon: markerIcon,
      })
        .bindPopup(createPopupContent(place))
        .addTo(map);

      markers.push(marker);
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map((marker) => marker.getLatLng()),
      );

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [30, 30],
          maxZoom: 10,
        });
      }
    }

    // Invalidate the map size after the container is laid out.
    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => {
      // Remove this map instance and its layers before cleanup.
      map.remove();

      // Ensure Leaflet can initialize the element again later.
      if (container._leaflet_id) {
        delete container._leaflet_id;
      }
    };
  }, [places]);

  return (
    <div
      className="map-frame"
      style={{
        width: "100%",
        height: "480px",
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <div
        ref={containerRef}
        aria-label="Interactive map of Ethiopian destinations"
        role="application"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
