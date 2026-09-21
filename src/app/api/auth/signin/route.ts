import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  getUserByEmail,
  setSessionCookie,
  verifyPassword,
  type AuthUser,
} from "@/lib/auth";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter your email and password." },
      { status: 400 },
    );
  }

  const userRow = await getUserByEmail(email);
  if (!userRow || !userRow.password_hash) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 },
    );
  }

  const valid = await verifyPassword(password, String(userRow.password_hash));
  if (!valid) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 },
    );
  }

  let user: AuthUser = {
    id: String(userRow.id),
    name: String(userRow.name),
    email: String(userRow.email),
    role: String(userRow.role) === "admin" ? "admin" : "customer",
  };

  // Bootstrap: signing in with the store's admin password promotes this
  // account to admin (in addition to normal role use).
  if (
    process.env.ADMIN_PASSWORD &&
    password === process.env.ADMIN_PASSWORD &&
    user.role !== "admin"
  ) {
    await pool?.query("update users set role = 'admin' where id = $1", [
      user.id,
    ]);
    user = { ...user, role: "admin" };
  }

  const token = await createSession(user);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, user });
}