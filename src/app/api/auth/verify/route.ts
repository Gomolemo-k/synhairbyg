import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getUserById } from "@/lib/auth";
import { consumeEmailToken } from "@/lib/emailTokens";
import { sendWelcomeEmail } from "@/lib/mail/templates";

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

  const user = await getUserById(userId);
  if (user) {
    try {
      await sendWelcomeEmail(String(user.email), String(user.name));
    } catch (err) {
      console.error("Welcome email failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}