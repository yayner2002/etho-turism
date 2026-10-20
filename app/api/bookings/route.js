import { NextResponse } from "next/server";
import { destinations } from "@/data/destinations";
import {
  createBooking,
  getBookings,
  createNotification,
  updateBooking,
} from "@/lib/store";
import { getCurrentUser, requireStaffOrAdmin } from "@/lib/auth";

const ALLOWED_STATUSES = ["pending", "approved", "cancelled", "completed"];

function isValidEmail(email) {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

function getAddisAbabaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Addis_Ababa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function isValidTravelDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value >= getAddisAbabaToday()
  );
}

// -----------------------------------------------------------------------------
// POST /api/bookings — Create a booking request
// -----------------------------------------------------------------------------

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in before creating a booking." },
        { status: 401 },
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 },
      );
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

    const destinationId =
      body?.destinationId != null ? String(body.destinationId).trim() : "";

    const travelDate =
      typeof body?.travelDate === "string" ? body.travelDate : "";

    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (
      name.length < 2 ||
      name.length > 100 ||
      !isValidEmail(email) ||
      phone.length > 40 ||
      !destinationId ||
      !isValidTravelDate(travelDate) ||
      message.length > 1000
    ) {
      return NextResponse.json(
        { error: "Please provide valid booking details." },
        { status: 400 },
      );
    }

    const travelers = Number(body?.travelers ?? 1);

    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) {
      return NextResponse.json(
        { error: "Travelers must be between 1 and 50." },
        { status: 400 },
      );
    }

    const destination = destinations.find(
      (item) => String(item.id) === destinationId,
    );

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found." },
        { status: 404 },
      );
    }

    const price = Number(destination.price);

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        {
          error: "This destination has no valid published base price.",
        },
        { status: 400 },
      );
    }

    const amountETB = Math.round(price * travelers * 100) / 100;

    // Never accept userId, booking status, payment status, or price
    // from the client. These values are determined on the server.
    const booking = await createBooking({
      userId: user.id,
      name,
      email,
      phone,
      destinationId: String(destination.id),
      destinationName: destination.name,
      travelDate,
      travelers,
      message,
      amountETB,
      currency: "ETB",
    });

    await createNotification({
      userId: user.id,
      type: "booking_created",
      title: "Booking request received",
      message: `Your trip to ${destination.name} on ${travelDate} is awaiting review.`,
      relatedId: booking.id,
    });

    await createNotification({
      role: "staff_admin",
      type: "booking_created",
      title: "New booking request",
      message: `${name} requested ${destination.name} for ${travelDate}.`,
      relatedId: booking.id,
    });

    return NextResponse.json(
      {
        message: "Booking request saved and awaiting review.",
        booking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      { error: "Unable to submit the booking. Please try again." },
      { status: 500 },
    );
  }
}

// -----------------------------------------------------------------------------
// GET /api/bookings — List the current user's bookings
// -----------------------------------------------------------------------------

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sign in to view bookings." },
        { status: 401 },
      );
    }

    const allBookings = await getBookings();

    const bookings = ["staff", "admin"].includes(user.role)
      ? allBookings
      : allBookings.filter(
          (booking) => String(booking.userId) === String(user.id),
        );

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve bookings." },
      { status: 500 },
    );
  }
}

// -----------------------------------------------------------------------------
// PATCH /api/bookings — Staff/admin booking status updates
// -----------------------------------------------------------------------------

export async function PATCH(request) {
  try {
    const actor = await requireStaffOrAdmin();

    if (!actor) {
      return NextResponse.json(
        { error: "Staff or administrator access required." },
        { status: 403 },
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 },
      );
    }

    const bookingId =
      typeof body?.bookingId === "string" ? body.bookingId.trim() : "";

    const status = typeof body?.status === "string" ? body.status : "";

    if (!bookingId || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking update." },
        { status: 400 },
      );
    }

    const allBookings = await getBookings();

    const existing = allBookings.find(
      (booking) => String(booking.id) === bookingId,
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    }

    // Do not allow staff to mark an unpaid booking completed.
    // Payment approval must happen through the payment-verification flow.
    if (status === "completed" && existing.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          error:
            "This booking cannot be completed until payment has been verified.",
        },
        { status: 409 },
      );
    }

    const updated = await updateBooking(bookingId, { status });

    if (!updated) {
      return NextResponse.json(
        { error: "Unable to update the booking." },
        { status: 500 },
      );
    }

    if (updated.userId) {
      await createNotification({
        userId: updated.userId,
        type: "booking_status",
        title: "Booking status updated",
        message: `Your booking for ${updated.destinationName} is now ${status}.`,
        relatedId: updated.id,
      });
    }

    return NextResponse.json({
      message: "Booking status updated.",
      booking: updated,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    return NextResponse.json(
      { error: "Unable to update the booking." },
      { status: 500 },
    );
  }
}
