"use client";

import dynamic from "next/dynamic";

const DestinationMap = dynamic(() => import("./DestinationMap"), {
  ssr: false,
  loading: () => (
    <div className="map-loading" role="status" aria-live="polite">
      Loading the Ethiopia destination map…
    </div>
  ),
});

export default function MapLoader({ items, ...props }) {
  return <DestinationMap items={items} {...props} />;
}
