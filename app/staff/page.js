import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import StaffWorkspace from "@/components/StaffWorkspace";

export const metadata = {
  title: "Staff workspace",
  robots: {
    index: false,
    follow: false,
  },
};

function StaffLoading() {
  return (
    <section className="section container">
      <p className="eyebrow">OPERATIONS</p>
      <h1>Loading staff workspace...</h1>
      <p role="status" aria-live="polite">
        Verifying your account permissions.
      </p>
    </section>
  );
}

async function StaffContent() {
  // Keep request-dependent work inside the Suspense boundary.
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!["staff", "admin"].includes(user.role)) {
    redirect("/dashboard");
  }

  return (
    <section className="section container">
      <p className="eyebrow">OPERATIONS</p>

      <h1>Staff workspace</h1>

      <p>
        Review booking requests and update their status. Payment verification is
        reserved for administrators.
      </p>

      <StaffWorkspace />
    </section>
  );
}

export default function StaffPage() {
  return (
    <Suspense fallback={<StaffLoading />}>
      <StaffContent />
    </Suspense>
  );
}
