export const destinationGroups = [
  { id: "amhara", name: "Amhara Region" },
  { id: "afar", name: "Afar Region" },
  { id: "oromia", name: "Oromia Region" },
  { id: "sidama", name: "Sidama Region" },
  { id: "south-ethiopia", name: "South Ethiopia Region" },
  { id: "central-ethiopia", name: "Central Ethiopia Region" },
  { id: "southwest-ethiopia", name: "South West Ethiopia Peoples' Region" },
  { id: "somali", name: "Somali Region" },
  { id: "tigray", name: "Tigray Region" },
  { id: "benishangul-gumuz", name: "Benishangul-Gumuz Region" },
  { id: "gambella", name: "Gambella Region" },
  { id: "harari-dire-dawa", name: "Harari and Dire Dawa" },
];

export const destinations = [
  // AMHARA
  {
    id: "bahir-dar",
    name: "Bahir Dar and Lake Tana",
    group: "amhara",
    region: "Amhara",
    category: "Lake and culture",
    coordinates: [11.5936, 37.3908],
    tagline: "Discover the islands and shores of Lake Tana",
    description:
      "Explore Lake Tana, lakeside scenery, boat excursions, and historic monasteries where visitor access is permitted.",
    duration: "2–3 days",
    bestTime: "Check seasonal weather and local access",
    price: 6500,
    image: "/images/lake-tana.jpg",
    highlights: ["Lake Tana", "Lakeside views", "Historic monasteries"],
    itinerary: [
      "Explore Bahir Dar",
      "Arrange a guided lake excursion",
      "Visit local markets",
    ],
  },
  {
    id: "blue-nile-falls",
    name: "Blue Nile Falls (Tis Abay)",
    group: "amhara",
    region: "Amhara",
    category: "Nature",
    coordinates: [11.487, 37.589],
    tagline: "Experience the power of the Blue Nile",
    description:
      "Visit the Blue Nile Falls area and its viewpoints, subject to current conditions and access.",
    duration: "Half to 1 day",
    bestTime: "Check seasonal flow and road conditions",
    price: 2500,
    image: "/images/blue-nile-falls.jpg",
    highlights: ["Waterfall viewpoints", "River scenery", "Local guiding"],
    itinerary: [
      "Travel to Tis Abay",
      "Walk with a local guide",
      "Return to Bahir Dar",
    ],
  },
  {
    id: "gondar",
    name: "Gondar and Fasil Ghebbi",
    group: "amhara",
    region: "Amhara",
    category: "History",
    coordinates: [12.603, 37.452],
    tagline: "Explore Ethiopia's historic royal enclosure",
    description:
      "Discover Gondar's castles, historic buildings, and cultural heritage with a knowledgeable local guide.",
    duration: "1–2 days",
    bestTime: "Confirm site access before travel",
    price: 5000,
    image: "/images/gondar.jpg",
    highlights: ["Fasil Ghebbi", "Fasilides' Castle", "Historic architecture"],
    itinerary: [
      "Explore the royal enclosure",
      "Visit local heritage sites",
      "Discover Gondar's markets",
    ],
  },
  {
    id: "debre-markos",
    name: "Debre Markos",
    group: "amhara",
    region: "Amhara",
    category: "Highlands and culture",
    coordinates: [10.34, 37.72],
    tagline: "Discover the East Gojjam highlands",
    description:
      "Use Debre Markos as a starting point for exploring highland scenery, local markets, and nearby communities.",
    duration: "1–2 days",
    bestTime: "Check local weather",
    price: 3500,
    image: "/images/debre-markos.jpg",
    highlights: ["Highland scenery", "Local markets", "Regional culture"],
    itinerary: [
      "Explore the town",
      "Arrange a local excursion",
      "Sample regional food",
    ],
  },
  {
    id: "debre-dima",
    name: "Debre Dima",
    group: "amhara",
    region: "Amhara",
    category: "Local discovery",
    coordinates: [10.65, 37.55],
    tagline: "Explore a lesser-known highland destination",
    description:
      "A destination entry for local discovery in the Amhara highlands. Confirm the exact location, route, and visitor access with local authorities before travelling.",
    duration: "Flexible",
    bestTime: "Confirm locally",
    price: 3000,
    image: "/images/debre-dima.jpg",
    highlights: ["Local landscapes", "Community visits", "Regional travel"],
    itinerary: [
      "Confirm the destination and route",
      "Arrange local guidance",
      "Explore only accessible areas",
    ],
  },
  {
    id: "gish-abay",
    name: "Gish Abay and Gish Abay River",
    group: "amhara",
    region: "Amhara",
    category: "Nature and spirituality",
    coordinates: [10.97, 37.77],
    tagline: "Explore the Gish Abay area in Sekela",
    description:
      "Discover the Gish Abay area and nearby river landscapes. Verify access, road conditions, and culturally sensitive sites locally.",
    duration: "1–2 days",
    bestTime: "Check local conditions",
    price: 3500,
    image: "/images/gish-abay.jpg",
    highlights: ["River landscapes", "Highland scenery", "Local heritage"],
    itinerary: [
      "Travel with local advice",
      "Explore approved viewpoints",
      "Respect local customs",
    ],
  },
  {
    id: "lalibela",
    name: "Lalibela Rock-Hewn Churches",
    group: "amhara",
    region: "Amhara",
    category: "World heritage",
    coordinates: [12.0319, 39.0419],
    tagline: "Discover remarkable churches carved from rock",
    description:
      "Explore Lalibela's extraordinary rock-hewn churches and living religious traditions respectfully.",
    duration: "2–3 days",
    bestTime: "Confirm ceremonies and site access",
    price: 8500,
    image: "/images/lalibela.jpg",
    highlights: ["Rock-hewn churches", "Local guides", "Religious heritage"],
    itinerary: [
      "Meet a local guide",
      "Explore permitted church sites",
      "Discover local crafts",
    ],
  },
  {
    id: "simien-mountains",
    name: "Simien Mountains National Park",
    group: "amhara",
    region: "Amhara",
    category: "Adventure",
    coordinates: [13.18, 38.05],
    tagline: "Walk among dramatic mountain landscapes",
    description:
      "Plan a guided visit to the Simien Mountains, checking park rules, trail conditions, and safety advice.",
    duration: "2–5 days",
    bestTime: "Confirm conditions with park authorities",
    price: 12500,
    image: "/images/simien.jpg",
    highlights: ["Mountain viewpoints", "Guided hikes", "Highland wildlife"],
    itinerary: [
      "Check in with park staff",
      "Hike with an authorized guide",
      "Return according to trail conditions",
    ],
  },
  {
    id: "menz-guassa",
    name: "Menz and Guassa Highlands",
    group: "amhara",
    region: "Amhara",
    category: "Nature and community",
    coordinates: [10.75, 39.75],
    tagline: "Discover highland landscapes and community conservation",
    description:
      "Explore the Menz highlands and Guassa community conservation area with local guidance and respect for conservation rules.",
    duration: "2–3 days",
    bestTime: "Check local and conservation guidance",
    price: 7000,
    image: "/images/menz-guassa.jpg",
    highlights: [
      "Highland landscapes",
      "Community conservation",
      "Guided walks",
    ],
    itinerary: [
      "Arrange local guidance",
      "Visit permitted conservation areas",
      "Learn about local conservation",
    ],
  },
  {
    id: "debre-birhan",
    name: "Debre Birhan",
    group: "amhara",
    region: "Amhara",
    category: "Highlands",
    coordinates: [9.68, 39.53],
    tagline: "Explore cool highland landscapes",
    description:
      "Discover Debre Birhan and the surrounding highlands, checking transport and weather before setting out.",
    duration: "1–2 days",
    bestTime: "Check local weather",
    price: 3500,
    image: "/images/debre-birhan.jpg",
    highlights: ["Highland scenery", "Local culture", "Nearby excursions"],
    itinerary: [
      "Explore the town",
      "Plan a nearby excursion",
      "Visit local markets",
    ],
  },
  {
    id: "dessie-kombolcha",
    name: "Dessie and Kombolcha",
    group: "amhara",
    region: "Amhara",
    category: "Cities and highlands",
    coordinates: [11.13, 39.63],
    tagline: "Explore towns surrounded by highland scenery",
    description:
      "Discover local culture, markets, and regional routes around Dessie and Kombolcha.",
    duration: "1–2 days",
    bestTime: "Check transport and local conditions",
    price: 4000,
    image: "/images/dessie.jpg",
    highlights: ["Regional markets", "Highland scenery", "Local food"],
    itinerary: [
      "Explore the towns",
      "Ask local guides about nearby sites",
      "Plan the onward journey",
    ],
  },
  {
    id: "lake-hayq",
    name: "Lake Hayq and Istifanos Monastery",
    group: "amhara",
    region: "Amhara",
    category: "Lake and heritage",
    coordinates: [11.33, 39.95],
    tagline: "Discover a lakeside heritage destination",
    description:
      "Visit the Lake Hayq area and inquire locally about monastery access, visitor etiquette, and boat or walking options.",
    duration: "1 day",
    bestTime: "Confirm local access",
    price: 3000,
    image: "/images/lake-hayq.jpg",
    highlights: ["Lake views", "Religious heritage", "Local guidance"],
    itinerary: [
      "Travel to the lake",
      "Visit accessible sites respectfully",
      "Return with local transport",
    ],
  },

  // AFAR
  {
    id: "danakil",
    name: "Danakil Depression",
    group: "afar",
    region: "Afar",
    category: "Geology and adventure",
    coordinates: [14.24, 40.3],
    tagline: "Explore extraordinary geological landscapes",
    description:
      "A remote and extreme environment that should only be visited with qualified operators and current safety advice.",
    duration: "3–4 days",
    bestTime: "Check current safety and weather guidance",
    price: 18000,
    image: "/images/danakil.jpg",
    highlights: [
      "Geological formations",
      "Salt landscapes",
      "Guided expedition",
    ],
    itinerary: [
      "Confirm current travel advice",
      "Travel with an experienced operator",
      "Follow guide and safety instructions",
    ],
  },

  // OROMIA
  {
    id: "bale-mountains",
    name: "Bale Mountains National Park",
    group: "oromia",
    region: "Oromia",
    category: "Nature and wildlife",
    coordinates: [6.85, 39.75],
    tagline: "Discover high-altitude habitats and wildlife",
    description:
      "Plan a responsible nature visit, following park guidance and staying on permitted trails.",
    duration: "2–4 days",
    bestTime: "Confirm park and weather conditions",
    price: 9500,
    image: "/images/bale-mountains.jpg",
    highlights: ["Highland habitats", "Wildlife viewing", "Guided walks"],
    itinerary: [
      "Check in with park staff",
      "Explore permitted trails",
      "Leave wildlife undisturbed",
    ],
  },
  {
    id: "sof-omer",
    name: "Sof Omar Caves",
    group: "oromia",
    region: "Oromia",
    category: "Caves and geology",
    coordinates: [6.9, 40.85],
    tagline: "Explore a remarkable cave system",
    description:
      "Visit the Sof Omar area with local guidance and check current access and cave safety requirements.",
    duration: "1–2 days",
    bestTime: "Check local conditions",
    price: 5000,
    image: "/images/sof-omar.jpg",
    highlights: ["Cave formations", "River scenery", "Local guiding"],
    itinerary: [
      "Arrange an authorized guide",
      "Follow cave safety instructions",
      "Explore the surrounding area",
    ],
  },

  // SIDAMA
  {
    id: "hawassa",
    name: "Hawassa",
    group: "sidama",
    region: "Sidama",
    category: "Lake and city",
    coordinates: [7.05, 38.48],
    tagline: "Enjoy lakeside views and regional food",
    description:
      "Discover Hawassa's lakeside setting, markets, and food culture while respecting wildlife and local communities.",
    duration: "1–2 days",
    bestTime: "Check weather and local events",
    price: 4500,
    image: "/images/hawassa.jpg",
    highlights: ["Lake Hawassa", "Lakeside walks", "Local food"],
    itinerary: [
      "Explore the lakeside",
      "Visit a local market",
      "Try regional dishes",
    ],
  },

  // SOUTH ETHIOPIA
  {
    id: "omo-valley",
    name: "Omo Valley",
    group: "south-ethiopia",
    region: "South Ethiopia",
    category: "Culture and landscapes",
    coordinates: [5.3, 36.6],
    tagline: "Travel thoughtfully through southern landscapes",
    description:
      "Arrange community-led experiences through trusted local guides, prioritizing consent and respect for privacy and traditions.",
    duration: "4–6 days",
    bestTime: "Confirm local conditions",
    price: 16500,
    image: "/images/omo-valley.jpg",
    highlights: ["Local guiding", "Regional markets", "Southern landscapes"],
    itinerary: [
      "Plan with local guides",
      "Join pre-arranged activities with consent",
      "Follow community guidance",
    ],
  },

  // CENTRAL ETHIOPIA
  {
    id: "wenchi",
    name: "Wenchi Crater Lake",
    group: "central-ethiopia",
    region: "Central Ethiopia",
    category: "Lake and nature",
    coordinates: [8.78, 37.88],
    tagline: "Discover a crater lake and surrounding highlands",
    description:
      "Explore the Wenchi area with local guidance and verify walking, riding, and lake-access arrangements before travel.",
    duration: "1 day",
    bestTime: "Check local weather",
    price: 4500,
    image: "/images/wenchi.jpg",
    highlights: ["Crater lake", "Highland walks", "Local guides"],
    itinerary: [
      "Arrange local transport",
      "Explore approved routes",
      "Respect community and environmental guidance",
    ],
  },

  // SOUTHWEST ETHIOPIA
  {
    id: "kaffa",
    name: "Kaffa Coffee Landscapes",
    group: "southwest-ethiopia",
    region: "South West Ethiopia",
    category: "Nature and coffee heritage",
    coordinates: [7.25, 36.25],
    tagline: "Explore forest landscapes and coffee heritage",
    description:
      "Discover the region's coffee-growing landscapes through locally arranged visits and responsible forest tourism.",
    duration: "2–3 days",
    bestTime: "Confirm local access",
    price: 6500,
    image: "/images/kaffa.jpg",
    highlights: ["Coffee heritage", "Forest landscapes", "Local producers"],
    itinerary: [
      "Arrange a local host",
      "Learn about coffee cultivation",
      "Follow forest conservation guidance",
    ],
  },

  // SOMALI
  {
    id: "kebri-dehar",
    name: "Kebri Dehar and Somali Region",
    group: "somali",
    region: "Somali",
    category: "Regional culture",
    coordinates: [6.73, 44.27],
    tagline: "Learn about eastern Ethiopia's landscapes and culture",
    description:
      "Plan carefully with local advice and verify security, transport, accommodation, and access before travelling.",
    duration: "Flexible",
    bestTime: "Confirm current travel advice",
    price: 6000,
    image: "/images/somali-region.jpg",
    highlights: ["Regional culture", "Local markets", "Landscape discovery"],
    itinerary: [
      "Check current travel guidance",
      "Arrange local transport",
      "Follow local advice",
    ],
  },

  // TIGRAY
  {
    id: "axum",
    name: "Axum",
    group: "tigray",
    region: "Tigray",
    category: "History and archaeology",
    coordinates: [14.12, 38.72],
    tagline: "Trace the history of an ancient kingdom",
    description:
      "Explore Aksumite heritage and archaeological sites only where access is currently permitted.",
    duration: "1–2 days",
    bestTime: "Confirm current travel advice and site access",
    price: 7000,
    image: "/images/axum.jpg",
    highlights: ["Ancient stelae", "Archaeological heritage", "Local history"],
    itinerary: [
      "Verify access before travel",
      "Visit open heritage sites",
      "Consult local guides",
    ],
  },

  // BENISHANGUL-GUMUZ
  {
    id: "assosa",
    name: "Assosa",
    group: "benishangul-gumuz",
    region: "Benishangul-Gumuz",
    category: "Regional discovery",
    coordinates: [10.07, 34.55],
    tagline: "Discover western Ethiopia",
    description:
      "Use Assosa as a starting point for learning about regional landscapes and cultures, subject to current travel advice.",
    duration: "1–2 days",
    bestTime: "Check current local conditions",
    price: 5000,
    image: "/images/assosa.jpg",
    highlights: ["Regional landscapes", "Local markets", "Cultural discovery"],
    itinerary: [
      "Confirm transport and access",
      "Explore accessible local sites",
      "Follow community guidance",
    ],
  },

  // GAMBELLA
  {
    id: "gambella",
    name: "Gambella National Park Area",
    group: "gambella",
    region: "Gambella",
    category: "Nature and wildlife",
    coordinates: [8.25, 34.6],
    tagline: "Discover western Ethiopia's natural landscapes",
    description:
      "Wildlife trips require current park information, appropriate permits, experienced guides, and careful seasonal planning.",
    duration: "2–4 days",
    bestTime: "Confirm seasonal and park conditions",
    price: 10000,
    image: "/images/gambella.jpg",
    highlights: [
      "Natural landscapes",
      "Wildlife habitats",
      "Guided excursions",
    ],
    itinerary: [
      "Check park status and permits",
      "Arrange an experienced guide",
      "Follow conservation rules",
    ],
  },

  // HARARI AND DIRE DAWA
  {
    id: "harar",
    name: "Harar Jugol",
    group: "harari-dire-dawa",
    region: "Harari",
    category: "History and culture",
    coordinates: [9.31, 42.12],
    tagline: "Explore a historic walled city",
    description:
      "Discover Harar's lanes, markets, architecture, and cultural history with respectful local guidance.",
    duration: "1–2 days",
    bestTime: "Check local conditions",
    price: 6500,
    image: "/images/harar.jpg",
    highlights: [
      "Historic old town",
      "Markets and crafts",
      "Local food and coffee",
    ],
    itinerary: [
      "Walk the old town with a guide",
      "Visit accessible heritage sites",
      "Explore local markets",
    ],
  },
  {
    id: "dire-dawa",
    name: "Dire Dawa",
    group: "harari-dire-dawa",
    region: "Dire Dawa",
    category: "City and architecture",
    coordinates: [9.6, 41.85],
    tagline: "Discover a distinctive eastern Ethiopian city",
    description:
      "Explore Dire Dawa's urban character, markets, and architecture while checking local conditions and transport options.",
    duration: "1–2 days",
    bestTime: "Check local weather",
    price: 4500,
    image: "/images/dire-dawa.jpg",
    highlights: ["City architecture", "Local markets", "Regional food"],
    itinerary: [
      "Explore central areas",
      "Visit local markets",
      "Plan the next journey",
    ],
  },
];

/**
 * Find a destination by ID.
 * Returns null when the ID is invalid or not found.
 */
export function getDestination(id) {
  if (typeof id !== "string" || !id.trim()) {
    return null;
  }

  return destinations.find((destination) => destination.id === id) ?? null;
}

/**
 * Find a destination group by ID.
 * Returns null when the ID is invalid or not found.
 */
export function getGroup(groupId) {
  if (typeof groupId !== "string" || !groupId.trim()) {
    return null;
  }

  return destinationGroups.find((group) => group.id === groupId) ?? null;
}

/**
 * Get destinations for a specific group.
 * Returns an empty array for an invalid or unknown group ID.
 */
export function getDestinationsByGroup(groupId) {
  if (typeof groupId !== "string" || !groupId.trim()) {
    return [];
  }

  return destinations.filter((destination) => destination.group === groupId);
}

/**
 * Validate destination IDs, groups, prices, coordinates, and image paths.
 * Returns an array of error messages. An empty array means the checks passed.
 */
export function validateDestinations() {
  const errors = [];
  const groupIds = new Set();
  const destinationIds = new Set();

  for (const group of destinationGroups) {
    if (
      typeof group.id !== "string" ||
      !group.id.trim() ||
      typeof group.name !== "string" ||
      !group.name.trim()
    ) {
      errors.push("Every destination group must have a valid ID and name.");
      continue;
    }

    if (groupIds.has(group.id)) {
      errors.push(`Duplicate destination group ID: ${group.id}`);
    }

    groupIds.add(group.id);
  }

  for (const destination of destinations) {
    const label = destination?.id || destination?.name || "Unknown destination";

    if (
      !destination ||
      typeof destination.id !== "string" ||
      !destination.id.trim() ||
      typeof destination.name !== "string" ||
      !destination.name.trim()
    ) {
      errors.push(`${label}: missing or invalid destination ID or name.`);
      continue;
    }

    if (destinationIds.has(destination.id)) {
      errors.push(`Duplicate destination ID: ${destination.id}`);
    }

    destinationIds.add(destination.id);

    if (!groupIds.has(destination.group)) {
      errors.push(
        `${label}: unknown destination group "${destination.group}".`,
      );
    }

    if (
      typeof destination.price !== "number" ||
      !Number.isFinite(destination.price) ||
      destination.price <= 0
    ) {
      errors.push(`${label}: price must be a positive number.`);
    }

    if (
      !Array.isArray(destination.coordinates) ||
      destination.coordinates.length !== 2 ||
      !destination.coordinates.every(
        (coordinate) =>
          typeof coordinate === "number" && Number.isFinite(coordinate),
      ) ||
      destination.coordinates[0] < -90 ||
      destination.coordinates[0] > 90 ||
      destination.coordinates[1] < -180 ||
      destination.coordinates[1] > 180
    ) {
      errors.push(`${label}: invalid latitude or longitude.`);
    }

    if (
      typeof destination.image !== "string" ||
      !destination.image.startsWith("/images/") ||
      destination.image.length <= "/images/".length
    ) {
      errors.push(`${label}: image must be a valid /images/ path.`);
    }

    if (!Array.isArray(destination.highlights)) {
      errors.push(`${label}: highlights must be an array.`);
    }

    if (!Array.isArray(destination.itinerary)) {
      errors.push(`${label}: itinerary must be an array.`);
    }
  }

  return errors;
}
