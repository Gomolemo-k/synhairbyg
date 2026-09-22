import "server-only";
import { Resend } from "resend";
import { MAIL_FROM } from "./config";

export type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendMailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

let client: Resend | null = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

// Resend allows ~2 requests/second; keep a sliding window so bulk sends
// (newsletter, reminders) don't trip the rate limiter.
class RateLimiter {
  private readonly windowMs = 1000;
  private readonly max = 2;
  private timestamps: number[] = [];

  async wait(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    if (this.timestamps.length < this.max) {
      this.timestamps.push(now);
      return;
    }
    const waitMs = this.windowMs - (now - this.timestamps[0]) + 10;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return this.wait();
  }
}

const limiter = new RateLimiter();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIES = 3;

export async function sendRawMail(
  input: SendMailInput,
  retries = 0,
): Promise<SendMailResult> {
  await limiter.wait();
  try {
    const res = await getClient().emails.send({
      from: MAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    if (res.error) {
      // Exponential backoff on 429 (rate_limit_exceeded): 1s → 2s → 4s.
      if (res.error.statusCode === 429 && retries < MAX_RETRIES) {
        await sleep(1000 * 2 ** retries);
        return sendRawMail(input, retries + 1);
      }
      return { success: false, error: res.error.message };
    }

    return { success: true, messageId: res.data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (retries < MAX_RETRIES) {
      await sleep(1000 * 2 ** retries);
      return sendRawMail(input, retries + 1);
    }
    return { success: false, error: message };
  }
}