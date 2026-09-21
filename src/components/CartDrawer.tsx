"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { getProductById } from "@/lib/products";
import ProductArt from "./ProductArt";
import { formatZAR } from "@/lib/format";

export function QtyStepper({
  value,
  onChange,
  small,
}: {
  value: number;
  onChange: (v: number) => void;
  small?: boolean;
}) {
  const size = small ? "h-7 w-7 text-sm" : "h-9 w-9 text-base";
  return (
    <div className="inline-flex items-center rounded-full border border-plum/25 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        className={`${size} rounded-l-full text-plum transition hover:bg-blush`}
      >
        −
      </button>
      <span className={`${small ? "min-w-6" : "min-w-9"} text-center text-sm font-semibold`}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className={`${size} rounded-r-full text-plum transition hover:bg-blush`}
      >
        +
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, total, updateQty, removeItem } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col bg-warmwhite shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-blush px-6 py-5">
          <h2 className="font-display text-2xl text-plum">
            Your Cart{" "}
            <span className="text-gold">({items.reduce((a, b) => a + b.qty, 0)})</span>
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full border border-plum/20 text-plum transition hover:bg-blush"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-xl text-plum">Your cart is empty</p>
              <p className="mt-2 text-sm text-charcoal/60">
                Time to find your next crown.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-6 rounded-full bg-plum px-6 py-3 text-sm font-semibold text-warmwhite transition hover:bg-rose"
              >
                Shop Wigs
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <li key={item.productId} className="flex gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeCart}
                      className="block h-20 w-16 shrink-0 overflow-hidden rounded-lg"
                    >
                      <ProductArt
                        from={product.gradient[0]}
                        to={product.gradient[1]}
                        name={product.name}
                        className="h-full w-full"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-charcoal">
                            {product.name}
                          </p>
                          <p className="text-xs text-charcoal/55">{product.type}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${product.name}`}
                          className="text-xs text-charcoal/40 transition hover:text-plum"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <QtyStepper
                          small
                          value={item.qty}
                          onChange={(v) => updateQty(item.productId, v)}
                        />
                        <span className="text-sm font-semibold text-plum">
                          {formatZAR(product.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-blush px-6 py-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd className="font-semibold">{formatZAR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Delivery</dt>
                <dd className="font-semibold text-charcoal/50">
                  Calculated at checkout
                </dd>
              </div>
              <div className="flex justify-between border-t border-blush pt-2 text-base">
                <dt className="font-semibold text-charcoal">Total</dt>
                <dd className="font-semibold text-plum">{formatZAR(total)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 block rounded-full bg-plum py-3.5 text-center text-sm font-semibold text-warmwhite transition hover:bg-rose"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="mt-2 block rounded-full border border-plum/30 py-3 text-center text-sm font-semibold text-plum transition hover:bg-blush"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}