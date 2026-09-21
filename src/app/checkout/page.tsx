"use client";

import { Suspense, useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { getProductById } from "@/lib/products";
import { formatZAR } from "@/lib/format";
import {
  getPaxiFee,
  PAXI_SERVICE_LABELS,
  type PaxiService,
} from "@/lib/paxiPricing";

type PaxiPointOption = {
  code: string;
  name: string;
  brand: string;
  address: string;
  suburb: string;
  city: string;
  province: string;
};

function CheckoutContent() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";
  const failed = searchParams.get("failed") === "1";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [service, setService] = useState<PaxiService>("standard");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [points, setPoints] = useState<PaxiPointOption[]>([]);
  const [pointCode, setPointCode] = useState("");
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [pointError, setPointError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const loadPoints = useCallback(async () => {
    setLoadingPoints(true);
    setPointError("");
    try {
      const params = new URLSearchParams();
      if (province) params.set("province", province);
      if (city) params.set("city", city);
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`/api/paxi/points?${params.toString()}`);
      const data = (await res.json()) as {
        points: PaxiPointOption[];
        provinces: string[];
        cities: string[];
      };
      if (data.provinces.length) setProvinces(data.provinces);
      if (data.cities.length) setCities(data.cities);
      setPoints(data.points);
    } catch {
      setPointError("Could not load PAXI points. Please try again.");
    } finally {
      setLoadingPoints(false);
    }
  }, [province, city, search]);

  useEffect(() => {
    // Fetching stores on mount / when the selection changes is external-side
    // data fetching; state is only updated from the async response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPoints();
  }, [loadPoints]);

  const selectedPoint = points.find((p) => p.code === pointCode);
  const deliveryFee = getPaxiFee("standard", service);
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pointCode || !selectedPoint) {
      setError("Please choose your nearest PEP / PAXI collection point.");
      return;
    }
    if (!province) {
      setError("Please select your province to find nearby PAXI points.");
      return;
    }

    setSubmitting(true);
    setError("");

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
          method: "paxi",
          notes: form.notes,
          paxi: {
            pointCode,
            pointName: selectedPoint?.name ?? "",
            pointAddress: [
              selectedPoint?.address,
              selectedPoint?.suburb,
              selectedPoint?.city,
            ]
              .filter(Boolean)
              .join(", "),
            service,
          },
        },
        lines: items.map((i) => ({ productId: i.productId, qty: i.qty })),
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      mode?: "yoco" | "demo";
      redirectUrl?: string;
      orderId?: string;
    };

    if (!res.ok || data.error) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    if (data.mode === "yoco" && data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }

    clearCart();
    router.push(`/order-confirmation?order=${data.orderId ?? ""}`);
  };

  const resetPointSelection = () => {
    setPointCode("");
    if (province) setCities([]);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-4xl text-plum">Nothing to check out</p>
        <p className="mt-3 text-charcoal/60">
          {cancelled
            ? "Your payment was cancelled — no charge was made. Find what you love and try again."
            : failed
              ? "Your payment didn't go through and no charge was made. Your cart is still safe."
              : "Your cart is empty."}
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-plum px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
        >
          {cancelled || failed ? "Back to Shopping" : "Shop Wigs"}
        </Link>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum";
  const labelClasses =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/60";

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      {(cancelled || failed) && (
        <div className="mb-8 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm text-charcoal">
          Your payment was <span className="font-semibold">
            {failed ? "unsuccessful" : "cancelled"}
          </span>
          . No charge was made — your cart is still safe.
        </div>
      )}

      <h1 className="font-display text-4xl text-plum">Checkout</h1>
      <p className="mt-2 text-sm text-charcoal/55">
        Secure checkout powered by Yoco. Pay by card or instant EFT — your
        details never touch our servers.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-blush bg-warmwhite p-6 sm:p-8">
            <h2 className="font-display text-2xl text-plum">Contact</h2>
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
            <h2 className="font-display text-2xl text-plum">Delivery</h2>
            <p className="mt-2 text-sm text-charcoal/60">
              Your order is shipped via PAXI and collected at the PEP store
              closest to you.
            </p>

            <div className="mt-6 space-y-6">
                <div>
                  <p className={labelClasses}>Delivery speed</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["standard", PAXI_SERVICE_LABELS.standard],
                        ["express", PAXI_SERVICE_LABELS.express],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          service === value
                            ? "border-plum bg-blush/50 font-semibold text-plum"
                            : "border-plum/20 bg-white text-charcoal/70 hover:border-plum/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={value}
                          checked={service === value}
                          onChange={() => setService(value)}
                          className="accent-plum"
                        />
                        <span>
                          {label}
                          <span className="block text-xs font-normal text-charcoal/50">
                            {formatZAR(getPaxiFee("standard", value))}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={labelClasses}>Where should we send it?</p>
                  <p className="mb-3 text-xs text-charcoal/55">
                    Choose the PEP / PAXI store closest to you — you&apos;ll
                    collect your order there.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClasses}>Province</span>
                      <select
                        required
                        className={inputClasses}
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          setCity("");
                          resetPointSelection();
                        }}
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
                      <span className={labelClasses}>City / town</span>
                      <select
                        className={inputClasses}
                        value={city}
                        disabled={!province}
                        onChange={(e) => {
                          setCity(e.target.value);
                          resetPointSelection();
                        }}
                      >
                        <option value="">
                          {province ? "All towns" : "Select province first"}
                        </option>
                        {cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className={labelClasses}>Search stores</span>
                    <input
                      className={inputClasses}
                      placeholder="Store name, suburb or town…"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        resetPointSelection();
                      }}
                    />
                  </label>

                  {pointError && (
                    <p className="mt-3 rounded-xl bg-plum/10 px-4 py-3 text-sm font-medium text-plum">
                      {pointError}
                    </p>
                  )}

                  {province && (
                    <div className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-plum/15 bg-white">
                      {loadingPoints ? (
                        <p className="px-4 py-6 text-center text-sm text-charcoal/50">
                          Loading stores…
                        </p>
                      ) : points.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-charcoal/50">
                          No PAXI points found{search ? " for your search" : ""}.
                          Try another town.
                        </p>
                      ) : (
                        <ul className="divide-y divide-plum/10">
                          {points.map((p) => (
                            <li key={p.code}>
                              <label
                                className={`flex cursor-pointer items-start gap-3 px-4 py-3 text-sm transition ${
                                  pointCode === p.code
                                    ? "bg-blush/60"
                                    : "hover:bg-blush/30"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="point"
                                  value={p.code}
                                  checked={pointCode === p.code}
                                  onChange={() => setPointCode(p.code)}
                                  className="mt-1 accent-plum"
                                />
                                <span>
                                  <span className="font-semibold text-charcoal">
                                    {p.name}
                                  </span>
                                  <span className="block text-xs text-charcoal/55">
                                    {p.address}, {p.suburb && `${p.suburb}, `}
                                    {p.city}
                                  </span>
                                  <span className="block text-xs text-charcoal/40">
                                    Point {p.code}
                                  </span>
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {selectedPoint && (
                    <p className="mt-3 rounded-xl bg-gold/10 px-4 py-3 text-sm text-charcoal">
                      Collect at{" "}
                      <span className="font-semibold">{selectedPoint.name}</span>{" "}
                      — {selectedPoint.address}, {selectedPoint.city}.
                    </p>
                  )}
                </div>
              </div>

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
          <h2 className="font-display text-2xl text-plum">Your Order</h2>
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
                {selectedPoint ? (
                  formatZAR(deliveryFee)
                ) : (
                  <span className="text-charcoal/45">Choose a store</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-blush pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-plum">{formatZAR(total)}</dd>
            </div>
          </dl>

          {error && (
            <p className="mt-4 rounded-xl bg-plum/10 px-4 py-3 text-sm font-medium text-plum">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-plum py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Processing…" : `Pay ${formatZAR(total)} with Yoco`}
          </button>
          <p className="mt-4 text-center text-xs text-charcoal/45">
            Card · Instant EFT. Pay securely with Yoco. By placing your order
            you agree to our{" "}
            <Link href="/policies" className="font-semibold text-plum underline">
              policies
            </Link>
            .
          </p>
          <p className="mt-3 text-center text-xs text-charcoal/45">
              PAXI delivery: {PAXI_SERVICE_LABELS[service]}
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