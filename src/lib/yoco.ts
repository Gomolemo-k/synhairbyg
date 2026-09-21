import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const SECRET_KEY = process.env.YOCO_SECRET_KEY ?? "";
const WEBHOOK_SECRET = process.env.YOCO_WEBHOOK_SECRET ?? "";

export const YOCO_API_URL =
  process.env.YOCO_API_URL ?? "https://payments.yoco.com/api";

export const yocoConfigured = Boolean(SECRET_KEY);

export type YocoLineItem = {
  displayName: string;
  quantity: number;
  pricingDetails: { price: number };
};

export type YocoCheckoutInput = {
  amountCents: number;
  externalId: string;
  metadata?: Record<string, unknown>;
  lineItems?: YocoLineItem[];
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
};

export type YocoCheckout = {
  id: string;
  redirectUrl: string;
  mode: string;
  status: string;
};

export class YocoError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "YocoError";
    this.status = status;
  }
}

export async function createYocoCheckout(
  input: YocoCheckoutInput,
): Promise<YocoCheckout> {
  const res = await fetch(`${YOCO_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.externalId,
    },
    body: JSON.stringify({
      amount: input.amountCents,
      currency: "ZAR",
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      failureUrl: input.failureUrl,
      externalId: input.externalId,
      metadata: {
        externalId: input.externalId,
        ...input.metadata,
      },
      lineItems: input.lineItems,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    id?: string;
    redirectUrl?: string;
    processingMode?: string;
    status?: string;
    message?: string;
    reason?: string;
    solution?: string;
  };

  if (!res.ok || !data.redirectUrl) {
    const detail =
      data.reason || data.message || data.solution || "Could not start checkout.";
    throw new YocoError(res.status, detail);
  }

  return {
    id: data.id as string,
    redirectUrl: data.redirectUrl,
    mode: data.processingMode ?? "test",
    status: data.status ?? "created",
  };
}

function decodeSecret(secret: string): Buffer {
  return Buffer.from(secret.replace(/^whsec_/, ""), "base64");
}

export function verifyYocoWebhook(
  rawBody: string,
  headers: {
    "webhook-id"?: string;
    "webhook-timestamp"?: string;
    "webhook-signature"?: string;
  },
): boolean {
  const webhookId = headers["webhook-id"];
  const timestamp = headers["webhook-timestamp"];
  const signatureHeader = headers["webhook-signature"];
  if (!webhookId || !timestamp || !signatureHeader || !WEBHOOK_SECRET) {
    return false;
  }

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  // Replay protection: reject signatures older than 5 minutes.
  if (Math.abs(Date.now() / 1000 - ts) > 5 * 60) return false;

  const signedContent = `${webhookId}.${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", decodeSecret(WEBHOOK_SECRET))
    .update(signedContent, "utf8")
    .digest("base64");

  return signatureHeader.split(" ").some((entry) => {
    const [version, value] = entry.split(",");
    if (version !== "v1" || !value) return false;
    const a = Buffer.from(expected);
    const b = Buffer.from(value);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

export async function registerYocoWebhook(url: string, name = "synhairbyg") {
  const res = await fetch(`${YOCO_API_URL}/webhooks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, url }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    id?: string;
    mode?: string;
    secret?: string;
    url?: string;
  };
  if (!res.ok || !data.secret) {
    throw new YocoError(
      res.status,
      (data as { message?: string }).message ?? "Could not register webhook.",
    );
  }
  return data;
}