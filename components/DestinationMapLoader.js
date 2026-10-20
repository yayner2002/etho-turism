"use client";

import dynamic from "next/dynamic";

const DestinationMap = dynamic(() => import("@/components/DestinationMap"), {
  ssr: false,
  loading: () => (
    <div
      className="map-frame"
      role="status"
      style={{
        width: "100%",
        height: "480px",
        display: "grid",
        placeItems: "center",
        background: "#f3f4f6",
        color: "#374151",
        borderRadius: "12px",
      }}
    >
      Loading destination map...
    </div>
  ),
});

export default function DestinationMapLoader({ places = [] }) {
  return <DestinationMap places={places} />;
}
