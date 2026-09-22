"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { translator } from "@/lib/i18n";

const inputClasses =
  "mt-1 w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20";

export default function SignUpPage() {
  const t = translator("auth");
  const router = useRouter();
  const [name, setName] = useState("");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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
      <h1 className="font-display text-4xl text-plum">{t("signUpTitle")}</h1>
      <p className="mt-2 text-sm text-charcoal/60">{t("signUpSub")}</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-charcoal">{t("yourName")}</span>
          <input
            required
            autoComplete="name"
            className={inputClasses}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
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
          <span className="text-sm font-semibold text-charcoal">{t("password")}</span>
          <input
            required
            type="password"
            autoComplete="new-password"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="mt-1 block text-xs text-charcoal/50">
            {t("minChars")}
          </span>
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
          {busy ? t("creating") : t("create")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/60">
        {t("alreadyHave")}
        <Link
          href="/sign-in"
          className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
        >
          {t("signInLink")}
        </Link>
      </p>
    </div>
  );
}