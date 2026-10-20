import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getNotificationsForUser, markNotificationRead } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to view notifications." }, { status: 401 });
  return NextResponse.json({ notifications: getNotificationsForUser(user) });
}

export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to update notifications." }, { status: 401 });
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = typeof body?.notificationId === "string" ? body.notificationId : "";
  const notification = markNotificationRead(id, user);
  if (!notification) return NextResponse.json({ error: "Notification not found." }, { status: 404 });
  return NextResponse.json({ notification });
}
