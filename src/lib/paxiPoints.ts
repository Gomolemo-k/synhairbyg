import "server-only";
import { pool } from "./db";

export type PaxiPoint = {
  code: string;
  name: string;
  brand: string;
  address: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string | null;
  lat: number | null;
  lng: number | null;
};

type PaxiPointRow = {
  code: string;
  name: string;
  brand: string;
  address: string | null;
  suburb: string | null;
  city: string;
  province: string;
  postal_code: string | null;
  lat: string | null;
  lng: string | null;
};

function toPoint(row: PaxiPointRow): PaxiPoint {
  return {
    code: row.code,
    name: row.name,
    brand: row.brand,
    address: row.address ?? "",
    suburb: row.suburb ?? "",
    city: row.city,
    province: row.province,
    postalCode: row.postal_code,
    lat: row.lat == null ? null : Number(row.lat),
    lng: row.lng == null ? null : Number(row.lng),
  };
}

export async function listPaxiPoints(options?: {
  province?: string;
  city?: string;
  q?: string;
}): Promise<PaxiPoint[]> {
  if (!pool) return [];

  const params: unknown[] = [];
  const where: string[] = ["active = true"];
  const add = (value: unknown, clause: string) => {
    params.push(value);
    where.push(clause.replace("$N", `$${params.length}`));
  };

  if (options?.province) add(options.province, "province = $N");
  if (options?.city) add(options.city, "city = $N");
  if (options?.q?.trim()) {
    add(`%${options.q.trim()}%`, "(name ilike $N or suburb ilike $N or city ilike $N)");
  }

  const res = await pool.query(
    `select * from paxi_points
     where ${where.join(" and ")}
     order by province, city, name
     limit 200`,
    params,
  );
  return res.rows.map(toPoint);
}

export async function listPaxiProvinces(): Promise<string[]> {
  if (!pool) return [];
  const res = await pool.query(
    "select distinct province from paxi_points where active = true order by province",
  );
  return res.rows.map((r) => String(r.province));
}

export async function listPaxiCities(province: string): Promise<string[]> {
  if (!pool) return [];
  const res = await pool.query(
    "select distinct city from paxi_points where active = true and province = $1 order by city",
    [province],
  );
  return res.rows.map((r) => String(r.city));
}

export async function getPaxiPoint(code: string): Promise<PaxiPoint | undefined> {
  if (!pool) return undefined;
  const res = await pool.query("select * from paxi_points where code = $1", [code]);
  return res.rowCount ? toPoint(res.rows[0]) : undefined;
}