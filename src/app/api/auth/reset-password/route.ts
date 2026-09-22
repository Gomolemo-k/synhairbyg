import { NextResponse } from "next/server";
import { updatePassword } from "@/lib/auth";
import { consumeEmailToken } from "@/lib/emailTokens";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    token?: string;
    password?: string;
  };
  const token = typeof body.token === "string" && body.token ? body.token : "";
  const password = body.password ?? "";

  if (!token) {
    return NextResponse.json({ error: "Missing reset token." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  const userId = await consumeEmailToken(token, "reset");
  if (!userId) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  try {
    await updatePassword(userId, password);
  } catch (err) {
    console.error("Password reset failed:", err);
    return NextResponse.json(
      { error: "Could not reset your password. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}