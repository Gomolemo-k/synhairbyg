import { NextResponse } from "next/server";
import {
  listPaxiCities,
  listPaxiPoints,
  listPaxiProvinces,
} from "@/lib/paxiPoints";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const province = searchParams.get("province") ?? undefined;
  const city = searchParams.get("city") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const [points, provinces, cities] = await Promise.all([
    listPaxiPoints({ province, city, q }),
    province ? Promise.resolve([]) : listPaxiProvinces(),
    province ? listPaxiCities(province) : Promise.resolve([]),
  ]);

  return NextResponse.json({ points, provinces, cities });
}