import type { Metadata } from "next";
import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import { collections, getProductsByCollection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore SynHairbyG collections — Signature Human Blend, the Synthetic Edit, and Bridal & Occasion.",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          Curated for you
        </p>
        <h1 className="mt-2 font-display text-5xl text-plum">Collections</h1>
        <p className="mt-3 max-w-xl text-charcoal/65">
          Every wig belongs to a family. Pick your mood and shop the edit.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {collections.map((collection) => {
          const items = getProductsByCollection(collection.slug);
          return (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-blush bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-plum/10"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <ProductArt
                  from={collection.gradient[0]}
                  to={collection.gradient[1]}
                  name={collection.name}
                  className="h-full w-full transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  {collection.tagline}
                </p>
                <h2 className="mt-2 font-display text-2xl text-plum">
                  {collection.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">
                  {collection.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-charcoal">
                    {items.length} styles
                  </span>
                  <span className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4 transition group-hover:text-rose">
                    Shop collection
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}