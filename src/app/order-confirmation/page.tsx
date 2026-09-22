"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/lib/orders";
import { formatZAR } from "@/lib/format";
import { STATUS_LABELS, stepIndex } from "@/lib/tracking";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { translator } from "@/lib/i18n";

function OrderConfirmationContent() {
  const t = translator("orderConfirmation");
  const tc = translator("common");
  const tt = translator("tracking");
  const tp = translator("paxi");
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
        <h1 className="font-display text-4xl text-plum">{t("notFoundTitle")}</h1>
        <p className="mt-3 text-charcoal/60">{t("notFoundBody")}</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-plum px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
        >
          {tc("backToShopping")}
        </Link>
      </div>
    );
  }

  const serviceLabel = order?.paxi ? tp(`service.${order.paxi.service}`) : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {!order ? (
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blush" />
          <p className="mt-4 text-charcoal/60">{t("lookingUp")}</p>
        </div>
      ) : (
        <>
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-3xl text-gold">
              ✓
            </span>
            <h1 className="mt-5 font-display text-4xl text-plum">
              {t("thankYou", {
                name: order.customer.firstName ? `, ${order.customer.firstName}` : "",
              })}
            </h1>
            <p className="mt-3 text-charcoal/65">
              {t("orderLabel", { id: order.id })}{" "}
              <span
                className={
                  stepIndex(order.status) >= 1 || order.status === "complete"
                    ? "font-semibold text-plum"
                    : "font-semibold text-gold"
                }
              >
                {tt(STATUS_LABELS[order.status])}
              </span>
            </p>
          </div>

          {order.status === "demo" && (
            <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm text-charcoal">
              <span className="font-semibold">{t("demoPre")}</span>{" "}
              {t("demoBody")}
              <span className="font-semibold text-plum">
                synhairbyg@gmail.com
              </span>
              .
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-blush bg-warmwhite p-6 sm:p-8">
            <h2 className="font-display text-2xl text-plum">{t("orderSummary")}</h2>
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
                <dt className="text-charcoal/60">{tc("subtotal")}</dt>
                <dd>{formatZAR(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">{tc("delivery")}</dt>
                <dd>{order.shippingFee === 0 ? tc("free") : formatZAR(order.shippingFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-blush pt-2 font-semibold">
                <dt>{tc("total")}</dt>
                <dd className="text-plum">{formatZAR(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-blush bg-warmwhite p-5 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gold">
                {t("contact")}
              </p>
              <p className="mt-2 text-charcoal/70">{order.customer.email}</p>
              <p className="text-charcoal/70">{order.customer.phone}</p>
            </div>
            <div className="rounded-2xl border border-blush bg-warmwhite p-5 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gold">
                {t("delivery")}
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
                      {t("paxiLine", {
                        service: serviceLabel,
                        bag: tp(`bag.word.${order.paxi.bag}`),
                      })}
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
                  {t("trackTitle")}
                </h2>
                <Link
                  href={`/track?order=${encodeURIComponent(order.id)}`}
                  className="rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-warmwhite transition hover:bg-rose"
                >
                  {t("trackArrow")}
                </Link>
              </div>
              <OrderStatusTimeline status={order.status} />
            </div>
          )}

          <div className="mt-8 rounded-2xl bg-plum p-6 text-center text-warmwhite">
            <p className="font-display text-xl">{t("whatNext")}</p>
            <p className="mt-2 text-sm text-warmwhite/75">
              {stepIndex(order.status) >= 2 ? (
                order.paxi ? (
                  <>
                    {t("nextSentPaxiPre")}
                    <span className="font-semibold">
                      {order.paxi.pointName}
                    </span>
                    {t("nextSentPaxiPost")}
                  </>
                ) : (
                  t("nextSentElse")
                )
              ) : order.status === "paid" ? (
                order.paxi ? (
                  <>
                    {t("nextPaidPaxiPre")}
                    <span className="font-semibold">
                      {order.paxi.pointName}
                    </span>
                    {t("nextPaidPaxiVia")}
                    {order.paxi.service === "express"
                      ? t("nextPaidPaxiExpress")
                      : t("nextPaidPaxiStandard")}
                    {t("nextPaidPaxiPost")}
                  </>
                ) : (
                  t("nextPaidElse")
                )
              ) : (
                t("nextDefault")
              )}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-plum px-8 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
            >
              {t("continueShopping")}
            </Link>
            <Link
              href="/policies"
              className="rounded-full border border-plum/30 px-8 py-4 text-sm font-semibold text-plum transition hover:bg-blush"
            >
              {t("viewPolicies")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function OrderConfirmationPage() {
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
      <OrderConfirmationContent />
    </Suspense>
  );
}