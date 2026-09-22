"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { QtyStepper } from "@/components/CartDrawer";
import ProductArt from "@/components/ProductArt";
import { getProductById } from "@/lib/products";
import { formatZAR } from "@/lib/format";
import { translator } from "@/lib/i18n";

export default function CartPage() {
  const t = translator("cart");
  const tc = translator("common");
  const { items, subtotal, shipping, total, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-4xl text-plum">{t("emptyTitle")}</p>
        <p className="mt-3 text-charcoal/60">{t("emptyBody")}</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-plum px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
        >
          {tc("shopWigs")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl text-plum">{t("title")}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-blush border-y border-blush">
          {items.map((item) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <li key={item.productId} className="flex gap-5 py-6">
                <Link
                  href={`/products/${product.slug}`}
                  className="block h-32 w-24 shrink-0 overflow-hidden rounded-xl"
                >
                  <ProductArt
                    from={product.gradient[0]}
                    to={product.gradient[1]}
                    name={product.name}
                    className="h-full w-full"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-display text-xl text-plum transition hover:text-rose"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-charcoal/55">
                        {t("meta", {
                          type: product.type,
                          length: product.length,
                          texture: product.texture,
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-charcoal/40 transition hover:text-plum"
                    >
                      {tc("remove")}
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <QtyStepper
                      value={item.qty}
                      onChange={(v) => updateQty(item.productId, v)}
                    />
                    <span className="font-bold text-plum">
                      {formatZAR(product.price * item.qty)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-blush bg-warmwhite p-6">
          <h2 className="font-display text-2xl text-plum">{t("orderSummary")}</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/60">{tc("subtotal")}</dt>
              <dd className="font-semibold">{formatZAR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/60">{tc("delivery")}</dt>
              <dd className="font-semibold">{formatZAR(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-blush pt-3 text-base">
              <dt className="font-semibold">{tc("total")}</dt>
              <dd className="font-bold text-plum">{formatZAR(total)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-plum py-4 text-center text-sm font-semibold text-warmwhite transition hover:bg-rose"
          >
            {t("proceed")}
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4 transition hover:text-rose"
          >
            {tc("continueShopping")}
          </Link>
          <p className="mt-5 text-center text-xs text-charcoal/45">
            {tc("yocoNote")}
          </p>
        </aside>
      </div>
    </div>
  );
}