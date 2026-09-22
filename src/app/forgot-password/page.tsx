"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { translator } from "@/lib/i18n";

const inputClasses =
  "mt-1 w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20";

export default function ForgotPasswordPage() {
  const t = translator("forgotPassword");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error ?? t("errorFallback"));
        return;
      }
      setSuccess(true);
    } catch {
      setError(t("errorFallback"));
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <h1 className="font-display text-4xl text-plum">{t("successTitle")}</h1>
        <p className="mt-3 text-sm text-charcoal/60">
          {t("successPre")}
          <span className="font-semibold text-plum">{email}</span>
          {t("successPost")}
        </p>
        <p className="mt-6 text-center text-sm text-charcoal/60">
          {t("headBackPre")}
          <Link
            href="/sign-in"
            className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
          >
            {t("headBackLink")}
          </Link>
          {t("headBackPost")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl text-plum">{t("title")}</h1>
      <p className="mt-2 text-sm text-charcoal/60">{t("intro")}</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-charcoal">{t("email")}</span>
          <input
            required
            type="email"
            autoComplete="email"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {error && (
          <p className="rounded-xl bg-plum/10 px-4 py-3 text-sm font-medium text-plum">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-plum py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? t("sending") : t("send")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/60">
        {t("rememberedPre")}
        <Link
          href="/sign-in"
          className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}