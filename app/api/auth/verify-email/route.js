import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email-verification";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const token = typeof body?.token === "string" ? body.token : "";
  const user = verifyEmailToken(token);
  if (!user)
    return NextResponse.json(
      {
        error:
          "This verification link is invalid, expired, or already used. Register again or request a new link.",
      },
      { status: 400 },
    );
  return NextResponse.json({
    message: "Email address verified successfully. You can now sign in.",
    user,
  });
}
