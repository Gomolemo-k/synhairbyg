import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { consumeEmailToken } from "@/lib/emailTokens";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: string };
  const token = typeof body.token === "string" && body.token ? body.token : "";
  if (!token) {
    return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
  }

  const userId = await consumeEmailToken(token, "verify");
  if (!userId) {
    return NextResponse.json(
      { error: "This verification link is invalid or has expired." },
      { status: 400 },
    );
  }

  await pool?.query("update users set email_verified = true where id = $1", [
    userId,
  ]);

  return NextResponse.json({ ok: true });
}