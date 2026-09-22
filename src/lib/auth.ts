import "server-only";
import {
  createHash,
  randomBytes,
  scrypt as _scrypt,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { pool } from "./db";

export const SESSION_COOKIE = "synh_session";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
};

const scrypt = promisify(_scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)).toString("hex");
  return `${salt}:${derived}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  return (
    derived.length === expected.length && timingSafeEqual(derived, expected)
  );
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "admin";
}) {
  if (!pool) throw new Error("Database not configured.");
  const exists = await pool.query("select 1 from users where email = $1", [
    input.email,
  ]);
  if (exists.rowCount) return { error: "exists" as const };
  const passwordHash = await hashPassword(input.password);
  const res = await pool.query(
    `insert into users (name, email, password_hash, role)
     values ($1, $2, $3, $4)
     returning id, name, email, role`,
    [input.name, input.email, passwordHash, input.role ?? "customer"],
  );
  const row = res.rows[0];
  return {
    user: {
      id: String(row.id),
      name: String(row.name),
      email: String(row.email),
      role: row.role as AuthUser["role"],
    },
  };
}

export async function getUserByEmail(email: string) {
  if (!pool) return undefined;
  const res = await pool.query("select * from users where email = $1", [email]);
  return res.rowCount ? res.rows[0] : undefined;
}

export async function getUserById(id: string) {
  if (!pool) return undefined;
  const res = await pool.query("select * from users where id = $1", [id]);
  return res.rowCount ? res.rows[0] : undefined;
}

/** Re-hashes the password and invalidates all existing sessions + reset
 *  tokens so an old leaked session can't survive a password change. */
export async function updatePassword(userId: string, password: string) {
  if (!pool) throw new Error("Database not configured.");
  const passwordHash = await hashPassword(password);
  await pool.query("update users set password_hash = $1 where id = $2", [
    passwordHash,
    userId,
  ]);
  await pool.query("delete from sessions where user_id = $1", [userId]);
  await pool.query(
    "delete from email_tokens where user_id = $1 and type = 'reset'",
    [userId],
  );
}

export async function createSession(user: AuthUser) {
  if (!pool) throw new Error("Database not configured.");
  const token = randomBytes(32).toString("base64url");
  await pool.query(
    "insert into sessions (token_hash, user_id, expires_at) values ($1, $2, now() + interval '30 days')",
    [sha256(token), user.id],
  );
  return token;
}

export async function destroySession(token: string) {
  if (!pool) return;
  await pool.query("delete from sessions where token_hash = $1", [
    sha256(token),
  ]);
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !pool) return null;
  const res = await pool.query(
    `select u.id, u.name, u.email, u.role
     from sessions s
     join users u on u.id = s.user_id
     where s.token_hash = $1 and s.expires_at > now()`,
    [sha256(token)],
  );
  if (!res.rowCount) return null;
  const row = res.rows[0];
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    role: row.role as AuthUser["role"],
  };
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  };
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function isAdmin(user: AuthUser | null): user is AuthUser & { role: "admin" } {
  return user?.role === "admin";
}