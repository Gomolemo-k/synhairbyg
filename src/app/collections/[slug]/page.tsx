import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import {
  collections,
  getCollection,
  getProductsByCollection,
} from "@/lib/products";
import { translator } from "@/lib/i18n";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/collections/[slug]">,
): Promise<Metadata> {
  const tm = translator("metadata");
  const { slug } = await props.params;
  const collection = getCollection(slug);
  return { title: collection ? collection.name : tm("collectionFallback") };
}

export default async function CollectionPage(
  props: PageProps<"/collections/[slug]">,
) {
  const t = translator("collections");
  const tc = translator("common");
  const { slug } = await props.params;
  const collection = getCollection(slug);

  if (!collection) notFound();

  const items = getProductsByCollection(collection.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
        <Link href="/collections" className="transition hover:text-plum">
          {t("title")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-plum">{collection.name}</span>
      </nav>

      <div className="overflow-hidden rounded-3xl">
        <div className="relative">
          <div className="aspect-[16/6] w-full">
            <ProductArt
              from={collection.gradient[0]}
              to={collection.gradient[1]}
              name={collection.name}
              className="h-full w-full"
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-charcoal/60 to-transparent p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              {collection.tagline}
            </p>
            <h1 className="font-display text-4xl text-warmwhite sm:text-5xl">
              {collection.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-warmwhite/80">
              {collection.description}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-warmwhite/60">
              {tc("stylesCount", { count: items.length })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}