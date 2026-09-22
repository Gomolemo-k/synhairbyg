import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/auth";
import { createEmailToken } from "@/lib/emailTokens";
import { sendResetPasswordEmail } from "@/lib/mail/templates";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Please enter your email." }, { status: 400 });
  }

  // Always respond OK so we don't reveal which addresses have accounts.
  const user = await getUserByEmail(email);
  if (user?.id && user.email) {
    void (async () => {
      try {
        const token = await createEmailToken(String(user.id), "reset");
        await sendResetPasswordEmail(String(user.email), String(user.name ?? ""), token);
      } catch (err) {
        console.error("Password reset email failed:", err);
      }
    })();
  }

  return NextResponse.json({ ok: true });
}