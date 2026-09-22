import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { SITE_URL } from "@/lib/mail/config";
import { getUnsubscribeToken } from "@/lib/newsletter";
import { sendNewsletterWelcomeEmail } from "@/lib/mail/templates";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  const result = await subscribeToNewsletter(email, "footer");
  if (!result.ok) {
    return NextResponse.json(
      { error: "Could not subscribe right now. Please try again." },
      { status: 500 },
    );
  }

  // Confirmation email with an unsubscribe link (fires in the background).
  void (async () => {
    try {
      const unsubToken = await getUnsubscribeToken(email);
      if (unsubToken) {
        await sendNewsletterWelcomeEmail({
          to: email,
          unsubscribeUrl: `${SITE_URL}/newsletter/unsubscribe?token=${encodeURIComponent(unsubToken)}`,
        });
      }
    } catch (err) {
      console.error("Newsletter confirmation email failed:", err);
    }
  })();

  return NextResponse.json({ ok: true });
}