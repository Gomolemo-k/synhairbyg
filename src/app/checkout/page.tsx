"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { getProductById } from "@/lib/products";
import { formatZAR } from "@/lib/format";

const provinces = [
  "Gauteng",
  "KwaZulu-Natal",
  "Western Cape",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

function CheckoutContent() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    method: "courier" as "courier" | "collection",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        shipping: {
          method: form.method,
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          notes: form.notes,
        },
        lines: items.map((i) => ({ productId: i.productId, qty: i.qty })),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.error) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    if (data.mode === "payfast") {
      const formEl = document.createElement("form");
      formEl.method = "POST";
      formEl.action = data.action;
      formEl.style.display = "none";
      for (const [key, value] of Object.entries(data.fields as Record<string, string>)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        formEl.appendChild(input);
      }
      document.body.appendChild(formEl);
      formEl.submit();
      return;
    }

    clearCart();
    router.push(`/order-confirmation?order=${data.orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-4xl text-maroon">Nothing to check out</p>
        <p className="mt-3 text-charcoal/60">
          {cancelled
            ? "Your payment was cancelled — no charge was made. Find what you love and try again."
            : "Your cart is empty."}
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-maroon px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-burgundy"
        >
          {cancelled ? "Back to Shopping" : "Shop Wigs"}
        </Link>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-xl border border-maroon/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-maroon";
  const labelClasses =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/60";
  const isCollection = form.method === "collection";

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      {cancelled && (
        <div className="mb-8 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm text-charcoal">
          Your payment was <span className="font-semibold">cancelled</span>. No
          charge was made — your cart is still safe.
        </div>
      )}

      <h1 className="font-display text-4xl text-maroon">Checkout</h1>
      <p className="mt-2 text-sm text-charcoal/55">
        Secure checkout powered by PayFast. Your card details never touch our
        servers.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-blush bg-warmwhite p-6 sm:p-8">
            <h2 className="font-display text-2xl text-maroon">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClasses}>First name</span>
                <input
                  required
                  className={inputClasses}
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </label>
              <label className="block">
                <span className={labelClasses}>Last name</span>
                <input
                  required
                  className={inputClasses}
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </label>
              <label className="block">
                <span className={labelClasses}>Email</span>
                <input
                  required
                  type="email"
                  className={inputClasses}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </label>
              <label className="block">
                <span className={labelClasses}>Phone / WhatsApp</span>
                <input
                  required
                  type="tel"
                  className={inputClasses}
                  placeholder="+27 82 000 0000"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-blush bg-warmwhite p-6 sm:p-8">
            <h2 className="font-display text-2xl text-maroon">Delivery</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["courier", "Courier — R129 (free over R1,500)"],
                  ["collection", "Collection — JHB, free"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    form.method === value
                      ? "border-maroon bg-blush/50 font-semibold text-maroon"
                      : "border-maroon/20 bg-white text-charcoal/70 hover:border-maroon/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={value}
                    checked={form.method === value}
                    onChange={() => set("method", value)}
                    className="accent-maroon"
                  />
                  {label}
                </label>
              ))}
            </div>

            {!isCollection && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={labelClasses}>Street address</span>
                  <input
                    required
                    className={inputClasses}
                    placeholder="Unit / street / complex"
                    value={form.address1}
                    onChange={(e) => set("address1", e.target.value)}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClasses}>Address line 2 (optional)</span>
                  <input
                    className={inputClasses}
                    value={form.address2}
                    onChange={(e) => set("address2", e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className={labelClasses}>City</span>
                  <input
                    required
                    className={inputClasses}
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className={labelClasses}>Province</span>
                  <select
                    required
                    className={inputClasses}
                    value={form.province}
                    onChange={(e) => set("province", e.target.value)}
                  >
                    <option value="">Select province</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClasses}>Postal code</span>
                  <input
                    required
                    className={inputClasses}
                    value={form.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                  />
                </label>
              </div>
            )}

            <label className="mt-5 block">
              <span className={labelClasses}>Order notes (optional)</span>
              <textarea
                rows={2}
                className={inputClasses}
                placeholder="Any delivery instructions, or a special message?"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </label>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-blush bg-warmwhite p-6">
          <h2 className="font-display text-2xl text-maroon">Your Order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <li key={item.productId} className="flex justify-between gap-2">
                  <span>
                    {product.name}{" "}
                    <span className="text-charcoal/45">× {item.qty}</span>
                  </span>
                  <span className="font-semibold">
                    {formatZAR(product.price * item.qty)}
                  </span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-5 space-y-3 border-t border-blush pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/60">Subtotal</dt>
              <dd className="font-semibold">{formatZAR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/60">Delivery</dt>
              <dd className="font-semibold">
                {form.method === "collection" || shipping === 0 ? (
                  <span className="text-gold">Free</span>
                ) : (
                  formatZAR(shipping)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-blush pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-maroon">{formatZAR(total)}</dd>
            </div>
          </dl>

          {error && (
            <p className="mt-4 rounded-xl bg-maroon/10 px-4 py-3 text-sm font-medium text-maroon">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-maroon py-4 text-sm font-semibold text-warmwhite transition hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Processing…"
              : isCollection
                ? "Place Order"
                : `Pay ${formatZAR(total)} with PayFast`}
          </button>
          <p className="mt-4 text-center text-xs text-charcoal/45">
            Cards · EFT · Instant EFT · Mobile money. By placing your order you
            agree to our{" "}
            <Link
              href="/policies"
              className="font-semibold text-maroon underline"
            >
              policies
            </Link>
            .
          </p>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blush" />
          <p className="mt-4 text-charcoal/60">Loading checkout…</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}