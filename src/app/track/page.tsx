"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { STATUS_LABELS } from "@/lib/tracking";
import { formatZAR } from "@/lib/format";
import type { OrderStatus } from "@/lib/orders";

const inputClasses =
  "mt-1 w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20";

type TrackResult = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  paxi?: {
    pointName: string;
    pointAddress: string;
    service: string;
  } | null;
  lines: { name: string; qty: number }[];
  total: number;
};

function TrackContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const lookup = async (e?: FormEvent) => {
    e?.preventDefault();
    setError("");
    setNotFound(false);
    setBusy(true);

    const params = new URLSearchParams({
      order: order.trim(),
      email: email.trim(),
    });

    const res = await fetch(`/api/orders/track?${params.toString()}`).catch(
      () => null,
    );
    setBusy(false);
    if (!res) {
      setError("Could not reach the tracking service. Please try again.");
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.order) {
      setNotFound(true);
      setResult(null);
      return;
    }
    setResult(data.order as TrackResult);
    setOrder("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-plum">Track your order</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Enter your order number and the email you used at checkout.
      </p>

      <form
        onSubmit={lookup}
        className="mt-8 grid gap-4 rounded-2xl border border-blush bg-warmwhite p-6 sm:grid-cols-[1fr_1fr_auto]"
      >
        <label className="block">
          <span className="text-sm font-semibold text-charcoal">
            Order number
          </span>
          <input
            required
            className={inputClasses}
            placeholder="e.g. SYN-2026-4F3A2B1C"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-charcoal">Email</span>
          <input
            required
            type="email"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="self-end rounded-full bg-plum px-8 py-3 text-sm font-semibold text-warmwhite transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Tracking…" : "Track"}
        </button>
      </form>

      {error && (
        <p className="mt-5 rounded-xl bg-plum/10 px-4 py-3 text-sm font-medium text-plum">
          {error}
        </p>
      )}

      {notFound && (
        <div className="mt-8 rounded-2xl border border-blush bg-warmwhite p-8 text-center">
          <p className="text-3xl">📦</p>
          <h2 className="mt-3 font-display text-2xl text-plum">
            No order found
          </h2>
          <p className="mt-2 text-sm text-charcoal/60">
            We couldn&apos;t find an order matching those details. Double-check
            your order number and email, or{" "}
            <Link
              href="/contact"
              className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
            >
              contact us
            </Link>{" "}
            for help.
          </p>
          {searchParams.get("order") && (
            <p className="mt-4 text-xs text-charcoal/45">
              Tip: demo/test orders can&apos;t be tracked — only real purchased
              orders appear here.
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-2xl border border-blush bg-warmwhite p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gold">
                Order {result.id}
              </p>
              <p className="mt-1 text-sm text-charcoal/60">
                Placed {new Date(result.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="rounded-full bg-blush px-3 py-1 text-xs font-bold uppercase tracking-wide text-plum">
              {STATUS_LABELS[result.status]}
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-blush/30 p-5">
            <OrderStatusTimeline status={result.status} />
          </div>

          {result.paxi && (
            <div className="mt-6 rounded-2xl border border-plum/15 bg-white p-5 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gold">
                Collect at
              </p>
              <p className="mt-1 font-semibold text-plum">
                {result.paxi.pointName}
              </p>
              <p className="text-charcoal/60">{result.paxi.pointAddress}</p>
              <p className="mt-1 text-xs text-charcoal/45">
                PAXI {result.paxi.service} delivery
              </p>
            </div>
          )}

          <ul className="mt-6 space-y-2 text-sm">
            {result.lines.map((line) => (
              <li key={line.name} className="flex justify-between gap-2">
                <span className="text-charcoal/70">
                  {line.name}{" "}
                  <span className="text-charcoal/40">× {line.qty}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-blush pt-3 text-right text-sm font-semibold">
            Total paid: <span className="text-plum">{formatZAR(result.total)}</span>
          </p>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-charcoal/50">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
        >
          Sign in to see all your orders
        </Link>
      </p>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-charcoal/60">Loading…</div>}>
      <TrackContent />
    </Suspense>
  );
}