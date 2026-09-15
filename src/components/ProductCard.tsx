import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductArt from "./ProductArt";
import { formatZAR } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
        )
      : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-blush bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductArt
          from={product.gradient[0]}
          to={product.gradient[1]}
          name={product.name}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-maroon px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-warmwhite">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-charcoal">
              Save {discount}%
            </span>
          )}
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-warmwhite/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-charcoal/70 backdrop-blur">
          {product.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-lg leading-snug text-maroon">
          {product.name}
        </h3>
        <p className="text-xs text-charcoal/55">{product.short}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-bold text-charcoal">
            {formatZAR(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-charcoal/40 line-through">
              {formatZAR(product.compareAtPrice)}
            </span>
          )}
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-gold">
            {product.length} &middot; {product.texture}
          </span>
        </div>
      </div>
    </Link>
  );
}