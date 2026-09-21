import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { pool } from "./db";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "webhooks.json");

export async function webhookDeliverySeen(id: string): Promise<boolean> {
  if (pool) {
    const res = await pool.query(
      "select 1 from webhook_deliveries where id = $1",
      [id],
    );
    return (res.rowCount ?? 0) > 0;
  }
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return (JSON.parse(raw) as string[]).includes(id);
  } catch {
    return false;
  }
}

export async function recordWebhookDelivery(id: string, eventType?: string) {
  if (pool) {
    await pool.query(
      `insert into webhook_deliveries (id, provider, event_type)
       values ($1, 'yoco', $2)
       on conflict (id) do nothing`,
      [id, eventType ?? null],
    );
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  let ids: string[] = [];
  try {
    ids = JSON.parse(await fs.readFile(FILE, "utf8")) as string[];
  } catch {
    ids = [];
  }
  if (!ids.includes(id)) {
    ids.push(id);
    await fs.writeFile(FILE, JSON.stringify(ids), "utf8");
  }
}