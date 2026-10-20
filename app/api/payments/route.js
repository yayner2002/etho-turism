import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getBookingById,
  createPaymentRequest,
  createNotification,
  getPaymentRequests,
} from "@/lib/store";
import {
  BANK_ACCOUNTS,
  calculateServiceFee,
  normalizeEthiopianPhone,
} from "@/lib/payment-config";

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sign in before submitting payment details." },
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

    const bookingId =
      typeof body?.bookingId === "string" ? body.bookingId.trim() : "";
    const method = body?.method;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required." },
        { status: 400 },
      );
    }

    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    }

    if (String(booking.userId) !== String(user.id)) {
      return NextResponse.json(
        { error: "You cannot submit payment for this booking." },
        { status: 403 },
      );
    }

    if (["cancelled", "completed"].includes(booking.status)) {
      return NextResponse.json(
        { error: "This booking cannot accept a payment request." },
        { status: 409 },
      );
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "This booking is already marked paid." },
        { status: 409 },
      );
    }

    const existingRequests = await getPaymentRequests();

    const duplicatePending = existingRequests.some(
      (item) =>
        String(item.bookingId) === String(booking.id) &&
        item.status === "pending",
    );

    if (duplicatePending) {
      return NextResponse.json(
        {
          error: "A payment request is already pending for this booking.",
        },
        { status: 409 },
      );
    }

    const totals = calculateServiceFee(Number(booking.amountETB));

    if (!totals) {
      return NextResponse.json(
        { error: "The booking amount is invalid." },
        { status: 400 },
      );
    }

    let paymentDetails = {};

    if (method === "demo") {
      paymentDetails = {
        demoOnly: true,
        note: "SIMULATED PAYMENT — NO MONEY TRANSFERRED",
      };
    } else if (method === "telebirr") {
      const phone = normalizeEthiopianPhone(body?.phone);

      if (!phone) {
        return NextResponse.json(
          { error: "Enter a valid Ethiopian Telebirr phone number." },
          { status: 400 },
        );
      }

      paymentDetails = { phone };
    } else if (method === "bank_transfer") {
      const bankId = typeof body?.bankId === "string" ? body.bankId : "";
      const bank = BANK_ACCOUNTS.find((item) => item.id === bankId);
      const reference =
        typeof body?.reference === "string" ? body.reference.trim() : "";

      if (!bank) {
        return NextResponse.json(
          { error: "Select a supported bank." },
          { status: 400 },
        );
      }

      if (!bank.accountName || !bank.accountNumber) {
        return NextResponse.json(
          {
            error:
              "The receiving bank account is not configured. Use demo payment for development.",
          },
          { status: 409 },
        );
      }

      if (reference.length < 4 || reference.length > 100) {
        return NextResponse.json(
          { error: "Enter a valid bank transfer reference." },
          { status: 400 },
        );
      }

      paymentDetails = {
        bankId: bank.id,
        bankName: bank.name,
        reference,
      };
    } else {
      return NextResponse.json(
        { error: "Select demo, Telebirr, or bank transfer." },
        { status: 400 },
      );
    }

    const payment = await createPaymentRequest({
      bookingId: booking.id,
      userId: user.id,
      method,
      ...paymentDetails,
      ...totals,
      currency: "ETB",
      status: "pending",
      verifiedAt: null,
      verifiedBy: null,
    });

    await createNotification({
      userId: user.id,
      type: "payment_pending",
      title: "Payment request pending",
      message:
        method === "demo"
          ? `Demo payment ${payment.id} was submitted. No money was transferred.`
          : `Payment request ${payment.id} was received and needs verification.`,
      relatedId: booking.id,
    });

    await createNotification({
      role: "staff_admin",
      type: "payment_pending",
      title: "Payment needs review",
      message:
        `${method === "demo" ? "DEMO payment" : method} request ` +
        `${payment.id} for ${totals.totalETB} ETB needs review.`,
      relatedId: booking.id,
    });

    return NextResponse.json(
      {
        message:
          method === "demo"
            ? "Demo payment request saved. No money was transferred; staff review is required."
            : "Payment request saved as pending. Payment is not yet confirmed.",
        payment: {
          id: payment.id,
          bookingId: payment.bookingId,
          method: payment.method,
          subtotalETB: payment.subtotalETB,
          serviceFeeETB: payment.serviceFeeETB,
          totalETB: payment.totalETB,
          currency: payment.currency,
          status: payment.status,
          demoOnly: method === "demo",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create payment request error:", error);

    return NextResponse.json(
      { error: "Unable to submit the payment request." },
      { status: 500 },
    );
  }
}
