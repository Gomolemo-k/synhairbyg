import "server-only";
import { createHash } from "crypto";
import type { Order } from "./orders";

const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID ?? "";
const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY ?? "";
const PASS_PHRASE = process.env.PAYFAST_PASSPHRASE ?? "";
const TEST_MODE = process.env.PAYFAST_TEST_MODE === "true";

const LIVE_PROCESS = "https://www.payfast.co.za/eng/process";
const SANDBOX_PROCESS = "https://sandbox.payfast.co.za/eng/process";
const LIVE_VALIDATE = "https://www.payfast.co.za/eng/query/validate";
const SANDBOX_VALIDATE = "https://sandbox.payfast.co.za/eng/query/validate";

export const payfastConfigured = Boolean(MERCHANT_ID && MERCHANT_KEY);
export const payfastProcessUrl = TEST_MODE ? SANDBOX_PROCESS : LIVE_PROCESS;
const validateUrl = TEST_MODE ? SANDBOX_VALIDATE : LIVE_VALIDATE;

function phpUrlEncode(value: string) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

export function signatureFromFields(fields: Record<string, string>) {
  const keys = Object.keys(fields)
    .filter((k) => k !== "signature")
    .sort();
  const parts: string[] = [];
  for (const key of keys) {
    const value = fields[key];
    if (value === "" || value == null) continue;
    parts.push(`${key}=${phpUrlEncode(String(value))}`);
  }
  let paramString = parts.join("&");
  if (PASS_PHRASE) {
    paramString += `&passphrase=${phpUrlEncode(PASS_PHRASE)}`;
  }
  return createHash("md5").update(paramString, "utf8").digest("hex").toLowerCase();
}

export function buildPaymentForm(order: Order, baseUrl: string) {
  const fields: Record<string, string> = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    m_payment_id: order.id,
    amount: order.total.toFixed(2),
    item_name: `SynHairbyG Order ${order.id}`,
    item_description: order.lines
      .map((l) => `${l.qty} x ${l.name}`)
      .join(", ")
      .slice(0, 255),
    name_first: order.customer.firstName.slice(0, 30),
    name_last: order.customer.lastName.slice(0, 30),
    email_address: order.customer.email.slice(0, 100),
    cell_number: order.customer.phone.slice(0, 20),
    return_url: `${baseUrl}/order-confirmation?order=${encodeURIComponent(order.id)}`,
    cancel_url: `${baseUrl}/checkout?cancelled=1`,
    notify_url: `${baseUrl}/api/payfast/notify`,
  };
  fields.signature = signatureFromFields(fields);
  return { action: payfastProcessUrl, fields };
}

export function verifyItn(body: Record<string, string>, order: Order) {
  if (body.merchant_id !== MERCHANT_ID) return false;
  if (body.m_payment_id !== order.id) return false;
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || Math.abs(amount - order.total) > 0.005) {
    return false;
  }
  if (PASS_PHRASE) {
    const expected = signatureFromFields(body);
    if (!body.signature || body.signature.toLowerCase() !== expected) {
      return false;
    }
  }
  return true;
}

export async function validateItnAgainstPayFast(body: Record<string, string>) {
  try {
    const res = await fetch(validateUrl, {
      method: "POST",
      body: new URLSearchParams(body),
    });
    const text = await res.text();
    return text.trim().startsWith("VALID");
  } catch {
    return undefined;
  }
}

export type PayFastStatus =
  | "COMPLETE"
  | "PENDING"
  | "CANCELLED"
  | "FAILED";