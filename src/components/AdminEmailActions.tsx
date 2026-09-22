"use client";

import { useState } from "react";
import { translator } from "@/lib/i18n";

type Result = {
  label: string;
  message: string;
  ok: boolean;
};

export default function AdminEmailActions() {
  const t = translator("adminEmail");
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const run = async (kind: "newsletter" | "reminders", url: string, label: string) => {
    setBusy(kind);
    setResult(null);
    try {
      const res = await fetch(url, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ label, message: data.error ?? t("failed"), ok: false });
        return;
      }
      setResult({
        label,
        message:
          kind === "newsletter"
            ? t("sentNewsletter", { sent: data.sent, failed: data.failed ?? 0 })
            : t("sentReminders", {
                sent: data.sent,
                failed: data.failed ?? 0,
                checked: data.checked,
              }),
        ok: true,
      });
    } catch {
      setResult({ label, message: t("genericError"), ok: false });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-blush bg-warmwhite p-6">
      <h2 className="font-display text-2xl text-plum">{t("title")}</h2>
      <p className="mt-1 text-sm text-charcoal/60">{t("sub")}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy === "newsletter"}
          onClick={() =>
            run("newsletter", "/api/newsletter/send-update", t("newStockLabel"))
          }
          className="rounded-full bg-plum px-6 py-3 text-sm font-semibold text-warmwhite transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "newsletter" ? t("sending") : t("newStockButton")}
        </button>
        <button
          type="button"
          disabled={busy === "reminders"}
          onClick={() =>
            run("reminders", "/api/cart/reminders", t("remindersLabel"))
          }
          className="rounded-full border border-plum/30 px-6 py-3 text-sm font-semibold text-plum transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "reminders" ? t("checking") : t("remindersButton")}
        </button>
      </div>
      {result && (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            result.ok ? "bg-gold/10 text-charcoal" : "bg-plum/10 text-plum"
          }`}
        >
          <span className="font-semibold">{result.label}:</span> {result.message}
        </p>
      )}
    </div>
  );
}