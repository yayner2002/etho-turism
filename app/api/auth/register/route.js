import { NextResponse } from "next/server";
import { createUser, getUserByEmail, publicUser } from "@/lib/store";
import { hashPassword, setSessionCookie } from "@/lib/auth";

// export const runtime = "nodejs";

export async function POST(request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 },
      );
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    const password = typeof body?.password === "string" ? body.password : "";

    // Correct email validation.
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
            "Enter a valid name and email. Passwords must contain at least 12 characters.",
        },
        { status: 400 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (adminEmail && email === adminEmail) {
      return NextResponse.json(
        {
          error: "This email cannot be registered as a customer account.",
        },
        { status: 409 },
      );
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this email already exists. Please sign in.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await createUser({
      name,
      email,
      passwordHash,
      role: "customer",
    });

    if (!user || !user.id) {
      throw new Error("Account creation returned no valid user.");
    }

    await setSessionCookie(user);

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: publicUser(user),
      },
      { status: 201 },
    );
  } catch (error) {
    // Detailed errors stay in the server terminal.
    console.error("Registration failed:", error);

    return NextResponse.json(
      {
        error: "We could not create your account. Please try again.",
      },
      { status: 500 },
    );
  }
}
