import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import NotificationsList from "@/components/NotificationsList";

export const metadata = {
  title: "Notifications",
  robots: {
    index: false,
    follow: false,
  },
};

function NotificationsLoading() {
  return (
    <section className="section container">
      <p className="eyebrow">ACCOUNT UPDATES</p>
      <h1>Notifications</h1>
      <p role="status" aria-live="polite">
        Checking your account and loading notifications...
      </p>
    </section>
  );
}

async function NotificationsContent() {
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/notifications");
  }

  return (
    <section className="section container">
      <p className="eyebrow">ACCOUNT UPDATES</p>
      <h1>Notifications</h1>
      <p>Booking, payment, and account updates for your signed-in account.</p>
      <NotificationsList />
    </section>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<NotificationsLoading />}>
      <NotificationsContent />
    </Suspense>
  );
}
