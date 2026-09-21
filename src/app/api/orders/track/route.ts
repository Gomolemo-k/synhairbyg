import { NextRequest, NextResponse } from "next/server";
import { loadOrder } from "@/lib/orders";

export async function GET(req: NextRequest) {
  const orderId = (req.nextUrl.searchParams.get("order") ?? "").trim();
  const email = (req.nextUrl.searchParams.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!orderId || !email) {
    return NextResponse.json(
      { error: "Please enter your order number and email." },
      { status: 400 },
    );
  }

  const order = await loadOrder(orderId.toUpperCase());
  if (
    !order ||
    order.customer.email.trim().toLowerCase() !== email ||
    order.status === "demo"
  ) {
    // Return the same message whether the order is missing or the email
    // doesn't match, so strangers can't probe for valid order numbers.
    return NextResponse.json(
      { error: "We couldn't find an order matching those details." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      paymentProvider: order.paymentProvider,
      paxi: order.paxi,
      lines: order.lines,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
    },
  });
}