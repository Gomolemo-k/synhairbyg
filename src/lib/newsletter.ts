import "server-only";
import { randomBytes } from "crypto";
import { pool } from "./db";

export type NewsSubscriber = {
  email: string;
  unsubToken: string;
};

export async function subscribeToNewsletter(
  email: string,
  source = "footer",
): Promise<{ ok: true; already: boolean } | { ok: false; error: string }> {
  if (!pool) return { ok: false, error: "Database not configured." };
  const normalized = email.trim().toLowerCase();
  const existing = await pool.query(
    "select id from newsletter_subscribers where email = $1",
    [normalized],
  );
  if (existing.rowCount) {
    // Re-subscribing clears the unsubscribed flag.
    await pool.query(
      "update newsletter_subscribers set unsubscribed_at = null where email = $1",
      [normalized],
    );
    return { ok: true, already: true };
  }
  const unsubToken = randomBytes(24).toString("base64url");
  await pool.query(
    "insert into newsletter_subscribers (email, unsub_token, source) values ($1, $2, $3)",
    [normalized, unsubToken, source],
  );
  return { ok: true, already: false };
}

export async function unsubscribeByToken(
  token: string,
): Promise<string | null> {
  if (!pool) return null;
  const res = await pool.query(
    "update newsletter_subscribers set unsubscribed_at = now() where unsub_token = $1 returning email",
    [token],
  );
  return res.rowCount ? String(res.rows[0].email) : null;
}

export async function getUnsubscribeToken(email: string): Promise<string | null> {
  if (!pool) return null;
  const res = await pool.query(
    "select unsub_token from newsletter_subscribers where email = $1",
    [email],
  );
  return res.rowCount ? String(res.rows[0].unsub_token) : null;
}

export async function listActiveSubscribers(): Promise<NewsSubscriber[]> {
  if (!pool) return [];
  const res = await pool.query(
    "select email, unsub_token from newsletter_subscribers where unsubscribed_at is null",
  );
  return res.rows.map((row) => ({
    email: String(row.email),
    unsubToken: String(row.unsub_token),
  }));
}