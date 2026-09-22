"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { translator } from "@/lib/i18n";

const inputClasses =
  "mt-1 w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20";

function ResetContent() {
  const t = translator("resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("errShort"));
      return;
    }
    if (password !== password2) {
      setError(t("errMismatch"));
      return;
    }
    if (!token) {
      setError(t("errNoToken"));
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error ?? t("errorFallback"));
        return;
      }
      router.push("/sign-in?reset=1");
      router.refresh();
    } catch {
      setError(t("errorFallback"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl text-plum">{t("title")}</h1>
      <p className="mt-2 text-sm text-charcoal/60">{t("intro")}</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-charcoal">
            {t("newPassword")}
          </span>
          <input
            required
            type="password"
            autoComplete="new-password"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-charcoal">
            {t("confirmPassword")}
          </span>
          <input
            required
            type="password"
            autoComplete="new-password"
            className={inputClasses}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
          {busy ? t("saving") : t("save")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/60">
        {t("notResettingPre")}
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

export default function ResetPasswordPage() {
  const tc = translator("common");
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blush" />
          <p className="mt-4 text-charcoal/60">{tc("loading")}</p>
        </div>
      }
    >
      <ResetContent />
    </Suspense>
  );
}