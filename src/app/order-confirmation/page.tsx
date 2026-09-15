"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/lib/orders";
import { formatZAR } from "@/lib/format";

const statusLabels: Record<Order["status"], string> = {
  pending: "Payment pending",
  paid: "Payment received",
  complete: "Complete",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Payment failed",
  demo: "Order placed (demo)",
};

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setOrder(data.order);
      })
      .catch(() => setNotFound(true));
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
                  order.status === "paid" || order.status === "complete"
                    ? "font-semibold text-plum"
                    : "font-semibold text-gold"
                }
              >
                {statusLabels[order.status]}
              </span>
            </p>
          </div>

          {order.status === "demo" && (
            <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm text-charcoal">
              <span className="font-semibold">Live payments aren&apos;t connected yet.</span>{" "}
              This was a test order for the demo checkout, so no payment was
              taken. If you were charged, email{" "}
              <span className="font-semibold text-plum">hello@synhairbyg.com</span>.
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
                {order.shipping.method === "collection"
                  ? "Johannesburg collection"
                  : `${order.shipping.address1}\u00A0${order.shipping.address2 ?? ""} · ${order.shipping.city}`}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-plum p-6 text-center text-warmwhite">
            <p className="font-display text-xl">What happens next?</p>
            <p className="mt-2 text-sm text-warmwhite/75">
              {order.status === "paid" || order.status === "complete"
                ? "We're packing your crown — dispatch happens within 1–2 working days and your tracking number lands on WhatsApp."
                : "Once payment confirms, we'll WhatsApp your tracking number. Need help? Message +27 82 000 0000."}
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