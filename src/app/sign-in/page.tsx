"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inputClasses =
  "mt-1 w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20";

export default function SignInPage() {
  const router = useRouter();
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
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl text-plum">Welcome back</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Sign in to see your orders and track your packages.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-charcoal">Email</span>
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
          <span className="text-sm font-semibold text-charcoal">Password</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/60">
        New here?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}