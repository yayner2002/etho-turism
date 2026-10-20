"use client";

import dynamic from "next/dynamic";
import { destinations } from "@/data/destinations";

const MapViewClient = dynamic(() => import("./MapViewClient"), {
  ssr: false,
  loading: () => (
    <div className="map-loading" role="status" aria-live="polite">
      Loading the Ethiopia destination map…
    </div>
  ),
});

export default function MapView({ items, ...props }) {
  const mapItems = Array.isArray(items) ? items : destinations;

  return <MapViewClient items={mapItems} {...props} />;
}
