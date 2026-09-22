import { NextResponse } from "next/server";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { listActiveSubscribers } from "@/lib/newsletter";
import { FEATURED, products } from "@/lib/products";
import { SITE_URL } from "@/lib/mail/config";
import { sendNewsletterEmail } from "@/lib/mail/templates";

export async function POST() {
  const user = await getSessionUser();
  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const subscribers = await listActiveSubscribers();
  if (subscribers.length === 0) {
    return NextResponse.json({ sent: 0, checked: 0 });
  }

  // Emails for a "new stock" drop: badge "New" products, else featured ones.
  const newItems = products.filter((p) => p.badge === "New");
  const picks = (newItems.length > 0 ? newItems : FEATURED).slice(0, 6);
  const items = picks.map((p) => ({
    name: p.name,
    price: p.price,
    url: `${SITE_URL}/products/${p.slug}`,
  }));

  let sent = 0;
  let failed = 0;
  for (const subscriber of subscribers) {
    const result = await sendNewsletterEmail({
      to: subscriber.email,
      items,
      unsubscribeUrl: `${SITE_URL}/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubToken)}`,
    });
    if (result.success) sent += 1;
    else {
      failed += 1;
      console.error("Newsletter email failed:", subscriber.email, result.error);
    }
  }

  return NextResponse.json({ sent, failed, checked: subscribers.length });
}