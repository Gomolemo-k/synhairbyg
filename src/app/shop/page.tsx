import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products, type WigType } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Wigs",
  description:
    "Browse every synthetic and human blend wig at SynHairbyG. Filter by type and sort by price.",
};

const types: (WigType | "All")[] = ["All", "Human Blend", "Synthetic"];

function buildHref(type: string, sort: string) {
  const params = new URLSearchParams();
  if (type !== "All") params.set("type", type);
  if (sort && sort !== "featured") params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default async function ShopPage(
  props: PageProps<"/shop">,
) {
  const searchParams = await props.searchParams;
  const type = (searchParams.type as string | undefined) ?? "All";
  const sort = (searchParams.sort as string | undefined) ?? "featured";

  let list = [...products];

  if (type !== "All") {
    list = list.filter((p) => p.type === type);
  }

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "featured":
      list.sort(
        (a, b) =>
          Number(b.featured ?? false) - Number(a.featured ?? false),
      );
      break;
  }

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          The full edit
        </p>
        <h1 className="mt-2 font-display text-5xl text-plum">Shop Wigs</h1>
        <p className="mt-3 max-w-xl text-charcoal/65">
          {products.length} hand-picked styles across synthetic and human blend.
          New drops land every month.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <Link
              key={t}
              href={buildHref(t, sort)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                type === t
                  ? "bg-plum text-warmwhite"
                  : "border border-plum/25 text-plum hover:bg-blush"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-charcoal/50">Sort by</span>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={buildHref(type, option.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  sort === option.value
                    ? "bg-gold/20 text-charcoal"
                    : "text-charcoal/50 hover:text-plum"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-blush bg-blush/40 py-20 text-center">
          <p className="font-display text-2xl text-plum">Nothing here yet</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Try a different filter — new styles drop every month.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}