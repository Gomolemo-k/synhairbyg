import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";
import {
  getProductBySlug,
  getProductsByCollection,
  products,
} from "@/lib/products";
import { formatZAR } from "@/lib/format";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: `${product.short}. ${product.length}, ${product.texture}, ${product.color}.`,
  };
}

export default async function ProductPage(
  props: PageProps<"/products/[slug]">,
) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
        )
      : 0;

  const specs = [
    ["Length", product.length],
    ["Texture", product.texture],
    ["Cap", product.capType],
    ["Density", product.density],
    ["Colour", product.color],
  ];

  const related = getProductsByCollection(product.collection)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
        <Link href="/shop" className="transition hover:text-plum">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/collections/${product.collection}`}
          className="transition hover:text-plum"
        >
          {product.collection === "signature-blend"
            ? "Signature Human Blend"
            : product.collection === "synthetic"
              ? "Synthetic Edit"
              : "Bridal & Occasion"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-plum">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <ProductArt
            from={product.gradient[0]}
            to={product.gradient[1]}
            name={product.name}
            className="aspect-[4/5] w-full rounded-3xl shadow-xl shadow-plum/10"
          />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.badge && (
              <span className="rounded-full bg-plum px-3 py-1 text-xs font-bold uppercase tracking-wide text-warmwhite">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-charcoal">
                Save {discount}%
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            {product.type}
          </p>
          <h1 className="mt-2 font-display text-4xl text-plum sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-charcoal/60">{product.short}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-charcoal">
              {formatZAR(product.price)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-charcoal/40 line-through">
                  {formatZAR(product.compareAtPrice)}
                </span>
                <span className="text-sm font-semibold text-gold">
                  Save {formatZAR(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-gold">★★★★★</span>
            <span className="text-charcoal/55">4.9 · Loved by our babes</span>
            <span className="ml-auto rounded-full bg-blush px-3 py-1 text-xs font-semibold text-plum">
              In stock · {product.stock} available
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-charcoal/75">
            {product.description}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-3">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-blush bg-warmwhite px-4 py-3"
              >
                <dt className="text-[10px] font-bold uppercase tracking-wide text-charcoal/45">
                  {label}
                </dt>
                <dd className="text-sm font-semibold text-charcoal">{value}</dd>
              </div>
            ))}
          </dl>

          <AddToCart product={product} />

          <div className="mt-8 divide-y divide-blush border-y border-blush text-sm">
            {[
              [
                "Delivery",
                "R129 nationwide courier (3–7 working days). Free over R1,500. Collection available in Johannesburg.",
              ],
              [
                "Payments",
                "Secure checkout via PayFast — cards, EFT, Instant EFT, and mobile money.",
              ],
              [
                "Returns",
                "Cancel before dispatch for a full refund. Wigs are final sale once worn for hygiene reasons. See policies.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="py-4">
                <p className="font-semibold text-plum">{title}</p>
                <p className="mt-1 text-charcoal/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Complete the look
            </p>
            <h2 className="mt-2 font-display text-3xl text-plum">
              You may also love
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}