import { NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/newsletter";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: string };
  const token = typeof body.token === "string" && body.token ? body.token : "";
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const email = await unsubscribeByToken(token);
  if (!email) {
    return NextResponse.json(
      { error: "That unsubscribe link is invalid." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, email });
}