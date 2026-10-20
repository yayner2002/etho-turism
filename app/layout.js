import "./globals.css";
import Link from "next/link";
import { SitePreferencesProvider } from "@/components/SitePreferences";
import SitePreferences from "@/components/SitePreferences";
import LanguageTranslator from "@/components/LanguageTranslator";
import Navigation from "@/components/Navigation";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "EthioTourism | Discover Ethiopia",
    template: "%s | EthioTourism",
  },
  description:
    "Discover Ethiopian landscapes, historic places, and cultural experiences with EthioTourism.",
  openGraph: {
    title: "EthioTourism | Discover Ethiopia",
    description:
      "Explore Ethiopia's landscapes, historic destinations, and cultural experiences.",
    siteName: "EthioTourism",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/">
          EthioTourism
        </Link>

        <Navigation />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <strong>EthioTourism</strong>
        <p>Discover thoughtfully. Travel respectfully.</p>
        <p>
          Ethiopian travelers only. Destination information, access, and prices
          must be checked locally.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SitePreferencesProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>

          <Header />

          <SitePreferences />
          <LanguageTranslator />

          <main id="main">{children}</main>

          <Footer />
        </SitePreferencesProvider>
      </body>
    </html>
  );
}
