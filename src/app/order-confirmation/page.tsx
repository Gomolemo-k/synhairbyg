"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/lib/orders";
import { formatZAR } from "@/lib/format";
import { STATUS_LABELS, stepIndex } from "@/lib/tracking";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    let stop = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        if (stop) return;
        setOrder(data.order);
      } catch {
        if (!stop) setNotFound(true);
      }
    };

    void load();

    // Payment is confirmed by the Yoco webhook, which may land a moment after
    // the redirect. Poll a few times so the page reflects the real status.
    const timer = window.setInterval(() => {
      void load();
    }, 3000);
    const timeout = window.setTimeout(() => window.clearInterval(timer), 15000);

    return () => {
      stop = true;
      window.clearInterval(timer);
      window.clearTimeout(timeout);
    };
  }, [orderId]);

  if (!orderId || notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl text-plum">Order not found</h1>
        <p className="mt-3 text-charcoal/60">
          We couldn&apos;t find that order reference.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-plum px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
        >
          Back to Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {!order ? (
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blush" />
          <p className="mt-4 text-charcoal/60">Looking up your order…</p>
        </div>
      ) : (
        <>
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-3xl text-gold">
              ✓
            </span>
            <h1 className="mt-5 font-display text-4xl text-plum">
              Thank you{order.customer.firstName ? `, ${order.customer.firstName}` : ""}!
            </h1>
            <p className="mt-3 text-charcoal/65">
              Order <span className="font-bold">{order.id}</span> ·{" "}
              <span
                className={
                  stepIndex(order.status) >= 1 || order.status === "complete"
                    ? "font-semibold text-plum"
                    : "font-semibold text-gold"
                }
              >
                {STATUS_LABELS[order.status]}
              </span>
            </p>
          </div>

          {order.status === "demo" && (
            <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm text-charcoal">
              <span className="font-semibold">
                Live payments aren&apos;t connected yet.
              </span>{" "}
              This was a test order for the demo checkout, so no payment was
              taken. If you were charged, email{" "}
              <span className="font-semibold text-plum">
                hello@synhairbyg.com
              </span>
              .
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-blush bg-warmwhite p-6 sm:p-8">
            <h2 className="font-display text-2xl text-plum">Order Summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {order.lines.map((line) => (
                <li
                  key={line.productId}
                  className="flex justify-between gap-2"
                >
                  <span>
                    {line.name}{" "}
                    <span className="text-charcoal/45">× {line.qty}</span>
                  </span>
                  <span className="font-semibold">
                    {formatZAR(line.price * line.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-blush pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd>{formatZAR(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Delivery</dt>
                <dd>{order.shippingFee === 0 ? "Free" : formatZAR(order.shippingFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-blush pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="text-plum">{formatZAR(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-blush bg-warmwhite p-5 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gold">
                Contact
              </p>
              <p className="mt-2 text-charcoal/70">{order.customer.email}</p>
              <p className="text-charcoal/70">{order.customer.phone}</p>
            </div>
            <div className="rounded-2xl border border-blush bg-warmwhite p-5 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gold">
                Delivery
              </p>
              <p className="mt-2 text-charcoal/70">
                {order.paxi ? (
                  <>
                    <span className="font-semibold text-plum">
                      {order.paxi.pointName}
                    </span>
                    <br />
                    <span className="text-charcoal/60">
                      {order.paxi.pointAddress}
                    </span>
                    <br />
                    <span className="text-xs text-charcoal/50">
                      PAXI {order.paxi.service} · {order.paxi.bag} bag
                    </span>
                  </>
                ) : (
                  `${order.shipping.address1}\u00A0${order.shipping.address2 ?? ""} · ${order.shipping.city}`
                )}
              </p>
            </div>
          </div>

          {stepIndex(order.status) >= 1 && (
            <div className="mt-6 rounded-2xl bg-blush/30 p-6 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-plum">
                  Track your package
                </h2>
                <Link
                  href={`/track?order=${encodeURIComponent(order.id)}`}
                  className="rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-warmwhite transition hover:bg-rose"
                >
                  Track →
                </Link>
              </div>
              <OrderStatusTimeline status={order.status} />
            </div>
          )}

          <div className="mt-8 rounded-2xl bg-plum p-6 text-center text-warmwhite">
            <p className="font-display text-xl">What happens next?</p>
            <p className="mt-2 text-sm text-warmwhite/75">
              {stepIndex(order.status) >= 2 ? (
                order.paxi ? (
                  <>
                    Your wig is on its way to{" "}
                    <span className="font-semibold">
                      {order.paxi.pointName}
                    </span>
                    . We&apos;ll send you an SMS once it&apos;s ready to
                    collect. Bring your ID when you pick it up.
                  </>
                ) : (
                  "Your order is on its way. You'll be notified once it's ready to collect."
                )
              ) : order.status === "paid" ? (
                order.paxi ? (
                  <>
                    We&apos;re packing your crown — your order ships to{" "}
                    <span className="font-semibold">
                      {order.paxi.pointName}
                    </span>{" "}
                    via PAXI{" "}
                    {order.paxi.service === "express"
                      ? "Express (3–5 business days)"
                      : "Standard (7–9 business days)"}
                    .
                  </>
                ) : (
                  "We're packing your crown — dispatch happens within 1–2 working days."
                )
              ) : (
                "Once payment confirms, we'll pack your order and ship it to your chosen PAXI store. Track it above or from your account."
              )}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-plum px-8 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
            >
              Continue Shopping
            </Link>
            <Link
              href="/policies"
              className="rounded-full border border-plum/30 px-8 py-4 text-sm font-semibold text-plum transition hover:bg-blush"
            >
              View Policies
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blush" />
          <p className="mt-4 text-charcoal/60">Loading…</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}