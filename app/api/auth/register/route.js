import { NextResponse } from "next/server";
import { createUser, getUserByEmail, publicUser } from "@/lib/store";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";

  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  const password = typeof body?.password === "string" ? body.password : "";

  // Validate registration fields.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    name.length < 2 ||
    name.length > 80 ||
    email.length > 254 ||
    !emailPattern.test(email) ||
    password.length < 12 ||
    password.length > 1024
  ) {
    return NextResponse.json(
      {
        error:
          "Provide a valid name and email. Passwords must be at least 12 characters.",
      },
      { status: 400 },
    );
  }

  // Prevent public registration using the configured admin email.
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (adminEmail && email === adminEmail) {
    return NextResponse.json(
      {
        error: "This email cannot be registered as a customer account.",
      },
      { status: 409 },
    );
  }

  // Reject duplicate accounts.
  try {
    if (getUserByEmail(email)) {
      return NextResponse.json(
        {
          error: "An account with this email already exists. Please sign in.",
        },
        { status: 409 },
      );
    }
  } catch (error) {
    console.error("Account lookup failed:", error);

    return NextResponse.json(
      {
        error: "Unable to check account details. Please try again.",
      },
      { status: 500 },
    );
  }

  try {
    const passwordHash = await hashPassword(password);

    // The store should assign the default customer role.
    const user = createUser({
      name,
      email,
      passwordHash,
    });

    // Create a session using the project's shared auth helper.
    await setSessionCookie(user);

    return NextResponse.json(
      {
        message: "Account created successfully. You can now sign in.",
        user: publicUser(user),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration failed:", error?.message || "Unknown error");

    return NextResponse.json(
      {
        error: "We could not create your account. Please try again.",
      },
      { status: 500 },
    );
  }
}
