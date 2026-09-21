import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import {
  createOrderId,
  saveOrder,
  type Order,
  type ShippingMethod,
} from "@/lib/orders";
import { getPaxiFee, type PaxiBag, type PaxiService } from "@/lib/paxiPricing";
import { createYocoCheckout, YocoError, yocoConfigured } from "@/lib/yoco";
import { getPaxiPoint } from "@/lib/paxiPoints";
import { getSessionUser } from "@/lib/auth";

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
    notes?: string;
    paxi?: {
      pointCode: string;
      pointName: string;
      pointAddress?: string;
      bag: PaxiBag;
      service: PaxiService;
    };
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

  if (body.shipping?.method !== "paxi") {
    return NextResponse.json(
      { error: "Please choose PAXI delivery." },
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

  const method = body.shipping.method;
  const bag: PaxiBag =
    body.shipping.paxi?.bag === "large" ? "large" : "standard";
  const service: PaxiService =
    body.shipping.paxi?.service === "express" ? "express" : "standard";

  let shippingFee = 0;
  let paxiPoint:
    | { code: string; name: string; address: string }
    | undefined;

  if (method === "paxi") {
    const submittedCode = body.shipping.paxi?.pointCode;
    if (!submittedCode || !body.shipping.paxi?.pointName) {
      return NextResponse.json(
        { error: "Please choose a PAXI collection point." },
        { status: 400 },
      );
    }

    paxiPoint = { code: submittedCode, name: body.shipping.paxi.pointName, address: body.shipping.paxi.pointAddress ?? "" };

    // Prefer the authoritative point from the database; fall back to what the
    // browser submitted when no database is configured (demo mode).
    const dbPoint = await getPaxiPoint(submittedCode);
    if (dbPoint) {
      paxiPoint = {
        code: dbPoint.code,
        name: dbPoint.name,
        address: [dbPoint.address, dbPoint.suburb, dbPoint.city]
          .filter(Boolean)
          .join(", "),
      };
    }

    shippingFee = getPaxiFee(bag, service);
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const total = subtotal + shippingFee;
  const paid = yocoConfigured;
  const user = await getSessionUser();

  const order: Order = {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    userId: user?.id,
    customer: body.customer,
    shipping: {
      method,
      address1: "",
      address2: "",
      city: paxiPoint?.address ?? "",
      province: "",
      postalCode: "",
      notes: body.shipping.notes ?? "",
    },
    paxi: paxiPoint
        ? {
            pointCode: paxiPoint.code,
            pointName: paxiPoint.name,
            pointAddress: paxiPoint.address,
            bag,
            service,
          }
        : undefined,
    lines,
    subtotal,
    shippingFee,
    total,
    status: paid ? ("pending" as const) : ("demo" as const),
    paymentProvider: paid ? ("yoco" as const) : ("demo" as const),
  };

  await saveOrder(order);

  if (!paid) {
    return NextResponse.json({ mode: "demo", orderId: order.id });
  }

  const baseUrl =
    (req.headers.get("origin") as string) ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  let checkout;
  try {
    checkout = await createYocoCheckout({
      amountCents: Math.round(total * 100),
      externalId: order.id,
      metadata: {
        orderId: order.id,
        customerEmail: order.customer.email,
      },
      lineItems: [
        ...lines.map((l) => ({
          displayName: l.name,
          quantity: l.qty,
          pricingDetails: { price: Math.round(l.price * 100) },
        })),
        {
          displayName: `PAXI ${service} delivery (${bag} bag)`,
          quantity: 1,
          pricingDetails: { price: Math.round(shippingFee * 100) },
        },
      ],
      successUrl: `${baseUrl}/order-confirmation?order=${encodeURIComponent(order.id)}`,
      cancelUrl: `${baseUrl}/checkout?cancelled=1`,
      failureUrl: `${baseUrl}/checkout?failed=1`,
    });
  } catch (err) {
    if (err instanceof YocoError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    throw err;
  }

  order.yocoCheckoutId = checkout.id;
  await saveOrder(order);

  return NextResponse.json({
    mode: "yoco",
    redirectUrl: checkout.redirectUrl,
    checkoutId: checkout.id,
    orderId: order.id,
  });
}