import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDestination } from "@/data/destinations";
import FavoriteButton from "@/components/FavoriteButton";

export const metadata = {
  title: "My dashboard",
  robots: { index: false, follow: false },
};

function DashboardLoading() {
  return (
    <section className="section container">
      <p className="eyebrow">YOUR TRAVEL SPACE</p>
      <h1>Loading your dashboard...</h1>
      <p role="status" aria-live="polite">
        Checking your account and saved destinations.
      </p>
    </section>
  );
}

async function DashboardContent() {
  // This request-dependent work is now inside the Suspense boundary.
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const favoriteDestinations = (user.favorites || [])
    .map((id) => getDestination(id))
    .filter(Boolean);

  return (
    <section className="section container">
      <p className="eyebrow">YOUR TRAVEL SPACE</p>
      <h1>Welcome, {user.name}</h1>
      <p>Review your saved destinations and keep exploring.</p>

      <div className="dashboard-stats">
        <div>
          <strong>{favoriteDestinations.length}</strong>
          <span>Saved destinations</span>
        </div>

        <div>
          <strong>
            {user.role === "admin"
              ? "Administrator"
              : user.role === "staff"
                ? "Staff"
                : "Traveler"}
          </strong>
          <span>Account type</span>
        </div>
      </div>

      <div className="section-heading">
        <h2>Your favorites</h2>
        <Link href="/destinations">Find more places →</Link>
      </div>

      {favoriteDestinations.length === 0 ? (
        <div className="empty-state">
          <h3>No favorites saved yet</h3>
          <p>Browse destinations and select “Save favorite” to add one here.</p>
          <Link className="button" href="/destinations">
            Explore destinations
          </Link>
        </div>
      ) : (
        <div className="destination-grid">
          {favoriteDestinations.map((destination) => (
            <article className="destination-card" key={destination.id}>
              <img
                src={destination.image}
                alt={destination.name}
                loading="lazy"
              />

              <div className="card-body">
                <p className="eyebrow">{destination.region}</p>
                <h3>{destination.name}</h3>
                <p>{destination.tagline}</p>

                <FavoriteButton destinationId={destination.id} initialSaved />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
