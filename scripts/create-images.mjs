import { mkdir, writeFile } from "node:fs/promises";

const names = [
  "lake-tana",
  "blue-nile-falls",
  "gondar",
  "debre-markos",
  "debre-dima",
  "gish-abay",
  "lalibela",
  "simien",
  "menz-guassa",
  "debre-birhan",
  "dessie",
  "lake-hayq",
  "danakil",
  "bale-mountains",
  "sof-omar",
  "hawassa",
  "omo-valley",
  "wenchi",
  "kaffa",
  "somali-region",
  "axum",
  "assosa",
  "gambella",
  "harar",
  "dire-dawa",
];

await mkdir("public/images", { recursive: true });

for (const name of names) {
  const label = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-labelledby="title">
  <title id="title">${label} landscape illustration</title>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b9d8cf"/>
      <stop offset="100%" stop-color="#f5e4bd"/>
    </linearGradient>
    <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#426f50"/>
      <stop offset="100%" stop-color="#173c30"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="url(#sky)"/>
  <circle cx="940" cy="145" r="64" fill="#e7b95f"/>
  <path d="M0 460 L190 260 L350 420 L520 220 L740 455 L920 300 L1200 470 V720 H0Z" fill="#8ba995"/>
  <path d="M0 520 L230 380 L410 500 L650 335 L870 510 L1060 385 L1200 480 V720 H0Z" fill="url(#land)"/>
  <path d="M0 595 Q250 520 460 610 T900 590 T1200 575 V720 H0Z" fill="#d5b878" opacity=".8"/>
  <path d="M0 640 Q260 590 520 650 T1000 630 T1200 640 V720 H0Z" fill="#244e3a"/>
  <rect x="54" y="520" width="1092" height="132" rx="20" fill="#102c22" opacity=".74"/>
  <text x="90" y="578" fill="#ffffff" font-size="44" font-family="Arial, Helvetica, sans-serif" font-weight="700">${label}</text>
  <text x="90" y="619" fill="#e7d8b2" font-size="22" font-family="Arial, Helvetica, sans-serif">ETHIOTOURISM · LOCAL LANDSCAPE ART</text>
</svg>`;

  await writeFile(`public/images/${name}.svg`, svg, "utf8");
}

console.log(
  `Created ${names.length} local SVG illustrations in public/images.`,
);

("scripts.images:generate=node scripts/create-images.mjs");
