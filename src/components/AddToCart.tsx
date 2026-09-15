"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <div className="inline-flex h-12 w-32 items-center justify-between rounded-full border border-plum/25 bg-white">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-full w-10 items-center justify-center rounded-l-full text-plum transition hover:bg-blush"
        >
          −
        </button>
        <span className="text-base font-semibold">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          className="flex h-full w-10 items-center justify-center rounded-r-full text-plum transition hover:bg-blush"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className={`h-12 flex-1 rounded-full px-8 text-sm font-semibold text-warmwhite transition ${
          added ? "bg-gold" : "bg-plum hover:bg-rose"
        }`}
      >
        {added ? "Added to cart ✓" : "Add to Cart"}
      </button>
    </div>
  );
}