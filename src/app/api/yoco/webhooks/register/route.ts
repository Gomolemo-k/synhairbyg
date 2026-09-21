import { NextResponse } from "next/server";
import { registerYocoWebhook, yocoConfigured } from "@/lib/yoco";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!yocoConfigured) {
    return NextResponse.json(
      { error: "YOCO_SECRET_KEY is not configured." },
      { status: 400 },
    );
  }

  const baseUrl =
    (req.headers.get("origin") as string) ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const url = `${baseUrl}/api/yoco/webhook`;

  try {
    const created = await registerYocoWebhook(url, "synhairbyg-webhook");
    return NextResponse.json({
      ok: true,
      registered: true,
      url: created.url,
      id: created.id,
      mode: created.mode,
      // The secret is shown only once — save it as YOCO_WEBHOOK_SECRET.
      secret: created.secret,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not register webhook.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}