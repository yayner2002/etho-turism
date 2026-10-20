import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getBookingById } from "@/lib/store";

export async function GET(_request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to view this booking." }, { status: 401 });
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  if (booking.userId !== user.id && !["staff", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "You cannot view this booking." }, { status: 403 });
  }
  return NextResponse.json({ booking });
}
