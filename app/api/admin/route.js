//
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  listUsers,
  getBookings,
  getPaymentRequests,
  setUserRole,
  updatePaymentRequest,
  updateBooking,
  createNotification,
} from "@/lib/store";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 },
    );
  return NextResponse.json({
    users: listUsers(),
    bookings: await getBookings(),
    payments: getPaymentRequests(),
  });
}

export async function PATCH(request) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 },
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body?.action === "set_role") {
    const userId = typeof body.userId === "string" ? body.userId : "";
    const role = body.role;
    if (userId === admin.id)
      return NextResponse.json(
        { error: "You cannot change your own role." },
        { status: 400 },
      );
    const user = setUserRole(userId, role);
    if (!user)
      return NextResponse.json(
        { error: "User or role is invalid." },
        { status: 400 },
      );
    createNotification({
      userId,
      type: "role_changed",
      title: "Account access updated",
      message: `Your account role is now ${role}.`,
    });
    return NextResponse.json({ user });
  }

  if (body?.action === "verify_payment") {
    const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
    const decision = body.decision;
    const verificationReference =
      typeof body.verificationReference === "string"
        ? body.verificationReference.trim()
        : "";
    if (!paymentId || !["paid", "rejected"].includes(decision)) {
      return NextResponse.json(
        { error: "Provide a valid payment decision." },
        { status: 400 },
      );
    }
    if (decision === "paid" && verificationReference.length < 4) {
      return NextResponse.json(
        {
          error:
            "A verified transaction reference is required before marking paid.",
        },
        { status: 400 },
      );
    }
    const payment = updatePaymentRequest(paymentId, {
      status: decision,
      verifiedAt: new Date().toISOString(),
      verifiedBy: admin.id,
      verificationReference: decision === "paid" ? verificationReference : null,
    });
    if (!payment)
      return NextResponse.json(
        { error: "Payment request not found." },
        { status: 404 },
      );
    await updateBooking(payment.bookingId, { paymentStatus: decision });
    createNotification({
      userId: payment.userId,
      type: `payment_${decision}`,
      title: decision === "paid" ? "Payment verified" : "Payment not verified",
      message:
        decision === "paid"
          ? "An administrator recorded the payment as verified. Keep your transaction reference."
          : "The submitted payment could not be verified. Contact support or submit corrected details.",
      relatedId: payment.bookingId,
    });
    return NextResponse.json({ payment });
  }

  return NextResponse.json({ error: "Unknown admin action." }, { status: 400 });
}
