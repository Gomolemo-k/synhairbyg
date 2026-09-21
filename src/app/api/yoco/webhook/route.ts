import { loadOrder, saveOrder } from "@/lib/orders";
import { verifyYocoWebhook } from "@/lib/yoco";
import {
  recordWebhookDelivery,
  webhookDeliverySeen,
} from "@/lib/webhooks";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();

  const verified = verifyYocoWebhook(raw, {
    "webhook-id": req.headers.get("webhook-id") ?? undefined,
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? undefined,
    "webhook-signature": req.headers.get("webhook-signature") ?? undefined,
  });
  if (!verified) {
    return new Response("Signature verification failed", { status: 401 });
  }

  const webhookId = req.headers.get("webhook-id") as string;

  // Yoco may redeliver events; process each delivery id only once.
  if (await webhookDeliverySeen(webhookId)) {
    return new Response("OK (duplicate)", { status: 200 });
  }

  try {
    const payload = JSON.parse(raw) as {
      type?: string;
      payload?: {
        id?: string;
        metadata?: { orderId?: string; externalId?: string };
      };
    };

    const type = payload.type;
    const p = payload.payload;
    const orderId = p?.metadata?.orderId ?? p?.metadata?.externalId;

    if (orderId) {
      const order = await loadOrder(orderId);
      if (order) {
        if (type === "payment.succeeded" || type === "payment.failed") {
          order.status = type === "payment.succeeded" ? "paid" : "failed";
          order.paymentProvider = "yoco";
          order.yocoPaymentId = p?.id;
          await saveOrder(order);
        }
      }
    }

    await recordWebhookDelivery(webhookId, type);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Yoco webhook error:", err);
    return new Response("Error", { status: 500 });
  }
}