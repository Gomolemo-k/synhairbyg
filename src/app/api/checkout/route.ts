import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { createOrderId, saveOrder, type ShippingMethod } from "@/lib/orders";
import { buildPaymentForm, payfastConfigured } from "@/lib/payfast";

export const runtime = "nodejs";

type CheckoutBody = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping: {
    method: ShippingMethod;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    notes?: string;
  };
  lines: { productId: string; qty: number }[];
};

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    !body.customer?.firstName ||
    !body.customer?.lastName ||
    !body.customer?.email ||
    !body.customer?.phone
  ) {
    return NextResponse.json(
      { error: "Please fill in all contact details." },
      { status: 400 },
    );
  }

  if (!body.shipping?.method || !body.shipping?.address1 || !body.shipping?.city) {
    return NextResponse.json(
      { error: "Please complete your delivery details." },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const lines: {
    productId: string;
    name: string;
    qty: number;
    price: number;
  }[] = [];

  for (const line of body.lines) {
    const product = getProductById(line.productId);
    const qty = Math.max(1, Math.min(Number(line.qty) || 1, product?.stock ?? 1));
    if (!product) {
      return NextResponse.json(
        { error: "One of the items in your cart is no longer available." },
        { status: 400 },
      );
    }
    lines.push({
      productId: product.id,
      name: product.name,
      qty,
      price: product.price,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const shippingFee =
    body.shipping.method === "collection" || subtotal >= 1500 ? 0 : 129;

  const order = {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    customer: body.customer,
    shipping: body.shipping,
    lines,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    status: payfastConfigured ? ("pending" as const) : ("demo" as const),
  };

  await saveOrder(order);

  if (!payfastConfigured) {
    return NextResponse.json({ mode: "demo", orderId: order.id });
  }

  const baseUrl =
    (req.headers.get("origin") as string) ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { action, fields } = buildPaymentForm(order, baseUrl);

  return NextResponse.json({ mode: "payfast", action, fields, orderId: order.id });
}