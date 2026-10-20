"use client";

import Link from "next/link";
import { useSitePreferences } from "@/components/SitePreferences";

const content = {
  en: {
    eyebrow: "THE LAND OF ORIGINS",
    title: "Discover Ethiopia.",
    subtitle: "Experience the extraordinary.",
    intro:
      "A journey through ancient history, extraordinary landscapes, vibrant cultures, and unforgettable destinations.",
    explore: "Explore Destinations",
    story: "Our Story",
    welcome: "WELCOME TO ETHIOTOURISM",
    heading: "Every destination tells a story.",
    paragraphs: [
      "EthioTourism helps people explore the beauty and diversity of Ethiopia, from historic cities and sacred sites to peaceful lakes and dramatic mountain landscapes.",
      "Whether you are planning your first visit or discovering somewhere new within the country, use this guide to find places that inspire curiosity and adventure.",
    ],
    valuesTitle: "Travel with purpose",
    valuesIntro:
      "We believe exploring a place is also a way to understand its people, heritage, and environment.",
    values: [
      {
        title: "Our Mission",
        text: "Help travelers discover Ethiopia's destinations, cultural traditions, historical landmarks, and natural wonders.",
      },
      {
        title: "Responsible Tourism",
        text: "Encourage respectful travel and care for Ethiopia's cultural and natural heritage.",
      },
      {
        title: "Our Vision",
        text: "Make exploring Ethiopia easier and inspire visitors to experience its extraordinary diversity.",
      },
    ],
    highlightsTitle: "Discover what makes Ethiopia special",
    highlights: [
      {
        title: "Ancient Heritage",
        text: "Discover Gondar's royal castles, Lalibela's rock-hewn churches, and the ancient city of Axum.",
      },
      {
        title: "Natural Wonders",
        text: "Experience Lake Tana, the Blue Nile Falls, the Simien Mountains, and the beautiful highlands.",
      },
      {
        title: "Living Cultures",
        text: "Explore regional traditions, local food, arts, festivals, and Ethiopian hospitality.",
      },
    ],
    ctaTitle: "There is more to discover.",
    ctaText:
      "Find your next destination and experience the many sides of Ethiopia.",
    start: "Start Exploring",
  },
  am: {
    eyebrow: "የሥልጣኔ መገኛ ምድር",
    title: "ኢትዮጵያን ያግኙ።",
    subtitle: "ድንቅ ተሞክሮ ይኑርዎት።",
    intro: "የጥንት ታሪክን፣ አስደናቂ ተፈጥሮን፣ የተለያዩ ባህሎችን እና የማይረሱ መዳረሻዎችን የሚያስቃኝ ጉዞ።",
    explore: "መዳረሻዎችን ይመልከቱ",
    story: "ስለ እኛ",
    welcome: "እንኳን ወደ ኢትዮቱሪዝም በደህና መጡ",
    heading: "እያንዳንዱ መዳረሻ ታሪክ አለው።",
    paragraphs: [
      "ኢትዮቱሪዝም ከታሪካዊ ከተሞችና ቅዱሳን ስፍራዎች እስከ ሐይቆችና ውብ ተራራማ አካባቢዎች ድረስ የኢትዮጵያን ውበትና ልዩነት እንዲያውቁ ይረዳል።",
      "የመጀመሪያ ጉብኝትዎን እያቀዱ ይሁን በአገርዎ ውስጥ አዲስ ቦታ እየፈለጉ፣ ይህን መመሪያ ተጠቅመው የሚያስደስቱ መዳረሻዎችን ያግኙ።",
    ],
    valuesTitle: "በዓላማ ይጓዙ",
    valuesIntro: "አንድን ቦታ መጎብኘት ሕዝቡን፣ ቅርሱንና አካባቢውን ለመረዳት ይረዳል።",
    values: [
      {
        title: "ተልዕኳችን",
        text: "ተጓዦች የኢትዮጵያን መዳረሻዎች፣ ባህሎች፣ ታሪካዊ ቅርሶችና የተፈጥሮ ድንቆች እንዲያውቁ መርዳት።",
      },
      {
        title: "ኃላፊነት ያለው ቱሪዝም",
        text: "ለአካባቢው ሕዝብ፣ ለባህላዊ ቅርሶችና ለተፈጥሮ አክብሮት ያለውን ጉዞ ማበረታታት።",
      },
      {
        title: "ራዕያችን",
        text: "ኢትዮጵያን ማሰስ ቀላል ማድረግና ጎብኚዎች የአገሪቱን ልዩነት እንዲያውቁ ማነሳሳት።",
      },
    ],
    highlightsTitle: "ኢትዮጵያን ልዩ የሚያደርጋትን ያግኙ",
    highlights: [
      {
        title: "ጥንታዊ ቅርሶች",
        text: "የጎንደርን ንጉሣዊ ቤተመንግሥቶች፣ የላሊበላን ከዓለት የተፈለፈሉ አብያተ ክርስቲያናትና ጥንታዊቷን አክሱም ይጎብኙ።",
      },
      {
        title: "የተፈጥሮ ድንቆች",
        text: "ጣና ሐይቅን፣ የዓባይ ፏፏቴን፣ የሰሜን ተራሮችንና ውብ ደጋማ አካባቢዎችን ይመልከቱ።",
      },
      {
        title: "ሕያው ባህሎች",
        text: "የክልሎችን ባህሎች፣ የአካባቢ ምግቦችን፣ ጥበቦችን፣ በዓላትንና የኢትዮጵያን እንግዳ ተቀባይነት ያውቁ።",
      },
    ],
    ctaTitle: "ገና የሚያገኟቸው ብዙ ቦታዎች አሉ።",
    ctaText: "ቀጣዩን መዳረሻዎን ይምረጡና የኢትዮጵያን ውበት ይለማመዱ።",
    start: "ጉዞዎን ይጀምሩ",
  },
};

export default function AboutContent() {
  const { language } = useSitePreferences();
  const t = content[language];

  return (
    <main className="about-page" lang={language}>
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="about-eyebrow">{t.eyebrow}</span>
          <h1>
            {t.title}
            <br />
            <span>{t.subtitle}</span>
          </h1>
          <p>{t.intro}</p>

          <div className="about-hero-actions">
            <Link href="/destinations" className="about-primary-button">
              {t.explore} <span aria-hidden="true">→</span>
            </Link>
            <a href="#our-story" className="about-secondary-button">
              {t.story}
            </a>
          </div>
        </div>

        <div className="about-hero-caption">
          <span className="about-caption-dot" />
          {t.eyebrow}
        </div>
      </section>

      <section className="about-intro" id="our-story">
        <div className="about-intro-label">
          <span className="about-eyebrow">{t.welcome}</span>
          <h2>{t.heading}</h2>
        </div>

        <div className="about-intro-text">
          {t.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-section-heading">
          <span className="about-eyebrow">{t.welcome}</span>
          <h2>{t.valuesTitle}</h2>
          <p>{t.valuesIntro}</p>
        </div>

        <div className="about-values-grid">
          {t.values.map((value, index) => (
            <article className="about-value-card" key={value.title}>
              <div className="about-value-icon" aria-hidden="true">
                {["🌍", "🤝", "✨"][index]}
              </div>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-highlights">
        <div className="about-section-heading">
          <span className="about-eyebrow">{t.eyebrow}</span>
          <h2>{t.highlightsTitle}</h2>
        </div>

        <div className="about-highlights-list">
          {t.highlights.map((item, index) => (
            <article className="about-highlight" key={item.title}>
              <span className="about-highlight-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="about-highlight-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <span className="about-eyebrow">{t.eyebrow}</span>
        <h2>{t.ctaTitle}</h2>
        <p>{t.ctaText}</p>
        <Link href="/destinations" className="about-primary-button">
          {t.start} <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
