import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!pool) {
      return Response.json({ ok: false, error: "DATABASE_URL not configured" });
    }
    const res = await pool.query(
      "select (select count(*) from users) as users, (select count(*) from sessions) as sessions",
    );
    return Response.json({
      ok: true,
      users: String((res.rows[0] as { users: string }).users),
      sessions: String((res.rows[0] as { sessions: string }).sessions),
    });
  } catch (err) {
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}