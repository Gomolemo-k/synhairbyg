"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { translator } from "@/lib/i18n";

const inputClasses =
  "mt-1 w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20";

export default function SignInPage() {
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
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const t = translator("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const reset = searchParams.get("reset") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let stop = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!stop && d?.user) router.replace("/account");
      })
      .catch(() => {});
    return () => {
      stop = true;
    };
  }, [router]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error ?? t("errorFallback"));
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError(t("errorFallback"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl text-plum">{t("signInTitle")}</h1>
      <p className="mt-2 text-sm text-charcoal/60">{t("signInSub")}</p>

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
        <label className="block">
          <span className="flex items-center justify-between text-sm font-semibold text-charcoal">
            {t("password")}
            <Link
              href="/forgot-password"
              className="font-normal text-plum underline decoration-gold decoration-2 underline-offset-4"
            >
              {t("forgotPassword")}
            </Link>
          </span>
          <input
            required
            type="password"
            autoComplete="current-password"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {reset && (
          <p className="rounded-xl bg-gold/10 px-4 py-3 text-sm font-medium text-charcoal">
            {t("resetNotice")}
          </p>
        )}

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
          {busy ? t("signingIn") : t("signIn")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/60">
        {t("newHere")}
        <Link
          href="/sign-up"
          className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
        >
          {t("createAccount")}
        </Link>
      </p>
    </div>
  );
}