import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { loadOrder, updateOrderStatus, type OrderStatus } from "@/lib/orders";
import { sendOrderReadyEmail } from "@/lib/mail/templates";

const ALLOWED: OrderStatus[] = [
  "paid",
  "packed",
  "sent",
  "delivered",
  "complete",
  "cancelled",
  "failed",
];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const status = body.status as OrderStatus;
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await updateOrderStatus(
    String(id).toUpperCase(),
    status,
  );
  if (!updated) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // The moment an order is marked packed it's ready to be handed to PAXI —
  // tell the customer it's on its way to their PEP store.
  if (status === "packed") {
    const order = await loadOrder(String(id).toUpperCase());
    if (order) {
      try {
        await sendOrderReadyEmail({
          to: order.customer.email,
          name: order.customer.firstName,
          orderId: order.id,
          items: order.lines.map((l) => ({
            name: l.name,
            qty: l.qty,
            price: l.price,
          })),
          collectionPoint: order.paxi
            ? `${order.paxi.pointName} — ${order.paxi.pointAddress}`
            : undefined,
        });
      } catch (err) {
        // Never let an email failure roll back a successful status update.
        console.error("Order ready email failed:", order.id, err);
      }
    }
  }

  return NextResponse.json({ ok: true, status });
}