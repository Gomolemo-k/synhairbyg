import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { syncCartForUser, type CartSyncItem } from "@/lib/cart";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { items?: unknown };
  const incoming = Array.isArray(body.items) ? body.items : [];
  const items: CartSyncItem[] = [];
  for (const raw of incoming) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as { productId?: unknown; qty?: unknown };
    if (typeof item.productId !== "string" || !item.productId) continue;
    items.push({
      productId: item.productId,
      qty: Number(item.qty) || 1,
    });
  }

  await syncCartForUser(user.id, items);
  return NextResponse.json({ ok: true });
}