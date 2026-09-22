import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  createUser,
  setSessionCookie,
} from "@/lib/auth";
import { createEmailToken } from "@/lib/emailTokens";
import { sendVerificationEmail } from "@/lib/mail/templates";

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Please fill in your name, email and password." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  const role =
    process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD
      ? ("admin" as const)
      : ("customer" as const);

  let result;
  try {
    result = await createUser({ name, email, password, role });
  } catch (err) {
    console.error("Signup failed to create user:", err);
    return NextResponse.json(
      { error: "Could not create your account. Please try again." },
      { status: 500 },
    );
  }

  if (result.error === "exists") {
    return NextResponse.json(
      { error: "An account with that email already exists. Try signing in." },
      { status: 409 },
    );
  }

  const token = await createSession(result.user);
  await setSessionCookie(token);

  // Send the verification email before responding so the link lands as soon as
  // possible. Serverless runtimes can freeze background tasks after the
  // response, which made the email arrive late. Failures are logged, never
  // surfaced (users can re-verify later). The welcome email is sent after
  // verification succeeds.
  try {
    const verifyToken = await createEmailToken(result.user.id, "verify");
    await sendVerificationEmail(
      result.user.email,
      result.user.name,
      verifyToken,
    );
  } catch (err) {
    console.error("Verification email failed:", err);
  }

  return NextResponse.json({ ok: true, user: result.user });
}