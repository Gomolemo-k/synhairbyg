import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  destroySession,
} from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  const store = await cookies();
  const token = store.get("synh_session")?.value;
  if (token) await destroySession(token);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}