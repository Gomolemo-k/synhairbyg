import "server-only";
import { randomBytes } from "crypto";
import { pool } from "./db";

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export type EmailTokenType = "verify" | "reset";

export async function createEmailToken(
  userId: string,
  type: EmailTokenType,
): Promise<string> {
  if (!pool) throw new Error("Database not configured.");
  const token = randomBytes(32).toString("base64url");
  const ttl = type === "verify" ? VERIFY_TTL_MS : RESET_TTL_MS;
  const expiresAt = new Date(Date.now() + ttl).toISOString();
  await pool.query(
    "insert into email_tokens (token, user_id, type, expires_at) values ($1, $2, $3, $4)",
    [token, userId, type, expiresAt],
  );
  return token;
}

/**
 * Marks a token used and returns the owner's user id — but only if the token
 * exists, is unused and hasn't expired. Tokens are single-use.
 */
export async function consumeEmailToken(
  token: string,
  type: EmailTokenType,
): Promise<string | null> {
  if (!pool) return null;
  const res = await pool.query(
    `update email_tokens
        set used_at = now()
      where token = $1 and type = $2 and used_at is null and expires_at > now()
      returning user_id`,
    [token, type],
  );
  return res.rowCount ? String(res.rows[0].user_id) : null;
}

export async function deleteUserTokens(userId: string, type?: EmailTokenType) {
  if (!pool) return;
  if (type) {
    await pool.query(
      "delete from email_tokens where user_id = $1 and type = $2",
      [userId, type],
    );
  } else {
    await pool.query("delete from email_tokens where user_id = $1", [userId]);
  }
}