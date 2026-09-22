"use client";

import { useState, type FormEvent } from "react";
import { translator } from "@/lib/i18n";

type Notice = { type: "ok" | "error"; text: string };

export default function NewsletterForm() {
  const t = translator("newsletter");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<Notice | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setMessage({ type: "error", text: data.error ?? t("errorFallback") });
        return;
      }
      setMessage({ type: "ok", text: t("success") });
      setEmail("");
    } catch {
      setMessage({ type: "error", text: t("errorFallback") });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
        {t("formEyebrow")}
      </h3>
      <p className="mt-3 text-sm text-warmwhite/75">{t("formIntro")}</p>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          placeholder={t("placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full border border-warmwhite/20 bg-plum px-4 py-2.5 text-sm text-warmwhite placeholder:text-warmwhite/40 outline-none transition focus:border-gold"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-plum transition hover:bg-warmwhite disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? t("subscribing") : t("subscribe")}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-xs ${
            message.type === "ok" ? "text-gold" : "text-rose-200"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}