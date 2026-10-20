import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { toggleFavorite } from "@/lib/store";
import { getDestination } from "@/data/destinations";

export async function POST(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Please sign in first." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const destinationId =
      typeof body.destinationId === "string" ? body.destinationId : "";

    if (!getDestination(destinationId)) {
      return NextResponse.json(
        { message: "Destination not found." },
        { status: 400 },
      );
    }

    const favorites = toggleFavorite(user.id, destinationId);

    return NextResponse.json({ success: true, favorites });
  } catch {
    return NextResponse.json(
      { message: "Could not update favorites." },
      { status: 400 },
    );
  }
}
