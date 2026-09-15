import { loadOrder, saveOrder } from "@/lib/orders";
import {
  verifyItn,
  validateItnAgainstPayFast,
  type PayFastStatus,
} from "@/lib/payfast";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();
  const body: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(raw)) {
    body[key] = value;
  }

  const orderId = body.m_payment_id;
  const order = orderId ? await loadOrder(orderId) : undefined;

  if (!order) {
    return new Response("NOT VALID", { status: 400 });
  }

  if (!verifyItn(body, order)) {
    return new Response("NOT VALID", { status: 400 });
  }

  const validated = await validateItnAgainstPayFast(body);
  if (validated === false) {
    return new Response("NOT VALID", { status: 400 });
  }

  const status = body.payment_status as PayFastStatus | undefined;
  if (status) {
    const statusMap: Record<PayFastStatus, typeof order.status> = {
      COMPLETE: "paid",
      PENDING: "pending",
      CANCELLED: "cancelled",
      FAILED: "failed",
    };
    order.status = statusMap[status] ?? order.status;
    order.pfPaymentId = body.pf_payment_id;
    order.pfToken = body.pf_token;
    await saveOrder(order);
  }

  return new Response("OK", { status: 200 });
}