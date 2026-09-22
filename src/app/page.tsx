import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import { products, collections, getProductsByCollection } from "@/lib/products";
import { translator } from "@/lib/i18n";

export default function HomePage() {
  const t = translator("home");
  const tc = translator("common");
  const bestSellers = products.filter((p) => p.featured).slice(0, 4);
  const featuredProduct = products[0];

  const whyPoints: [string, string][] = [
    [t("why1Title"), t("why1Text")],
    [t("why2Title"), t("why2Text")],
    [t("why3Title"), t("why3Text")],
    [t("why4Title"), t("why4Text")],
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-blush">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-plum/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-plum/20 bg-warmwhite/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-plum">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {t("badge")}
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-plum sm:text-6xl lg:text-7xl">
              {t("heroTitle")}
              <span className="italic text-gold">{t("heroTitleAccent")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/70">
              {t("heroSub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-plum px-8 py-4 text-sm font-semibold text-warmwhite shadow-lg shadow-plum/20 transition hover:bg-rose"
              >
                {t("ctaShop")}
              </Link>
              <Link
                href="/collections"
                className="rounded-full border border-plum/30 bg-warmwhite/60 px-8 py-4 text-sm font-semibold text-plum transition hover:bg-warmwhite"
              >
                {t("ctaCollections")}
              </Link>
            </div>
            <div className="mt-10 flex gap-8">
              <div>
                <p className="font-display text-3xl text-plum">{t("statCrowns")}</p>
                <p className="text-xs uppercase tracking-wide text-charcoal/50">
                  {t("statCrownsLabel")}
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-plum">{t("statRating")}</p>
                <p className="text-xs uppercase tracking-wide text-charcoal/50">
                  {t("statRatingLabel")}
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-plum">{t("statFreeDelivery")}</p>
                <p className="text-xs uppercase tracking-wide text-charcoal/50">
                  {t("statFreeDeliveryLabel")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <ProductArt
              from={featuredProduct.gradient[0]}
              to={featuredProduct.gradient[1]}
              name={featuredProduct.name}
              className="aspect-[4/5] rounded-3xl shadow-2xl shadow-plum/20"
            />
            <div className="absolute -left-4 bottom-8 rounded-2xl bg-warmwhite px-5 py-4 shadow-xl sm:-left-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                {t("featured")}
              </p>
              <p className="font-display text-xl text-plum">
                {featuredProduct.name}
              </p>
              <p className="text-sm text-charcoal/60">
                {featuredProduct.length} &middot; {featuredProduct.texture}
              </p>
            </div>
            <div className="absolute -right-3 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-plum text-center text-[10px] font-bold uppercase tracking-wide text-warmwhite shadow-xl sm:-right-6">
              {t("newDrop1")}
              <br />
              {t("newDrop2")}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-blush bg-warmwhite">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-center text-xs font-semibold uppercase tracking-wide text-plum sm:px-6 md:grid-cols-4 lg:px-8">
          <p>{tc("freeDelivery")}</p>
          <p>{tc("secureYoco")}</p>
          <p>{t("marqueeQuality")}</p>
          <p>{t("marqueeNationwide")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              {t("shopByMood")}
            </p>
            <h2 className="mt-2 font-display text-4xl text-plum">{t("collections")}</h2>
          </div>
          <Link
            href="/collections"
            className="text-sm font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4 transition hover:text-rose"
          >
            {t("viewAllCollections")}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <ProductArt
                from={collection.gradient[0]}
                to={collection.gradient[1]}
                name={collection.name}
                className="h-full w-full transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent p-6 pt-16">
                <h3 className="font-display text-2xl text-warmwhite">
                  {collection.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-warmwhite/70">
                  {tc("stylesCount", { count: getProductsByCollection(collection.slug).length })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-blush/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
                {t("customerFavourites")}
              </p>
              <h2 className="mt-2 font-display text-4xl text-plum">{t("bestSellers")}</h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4 transition hover:text-rose"
            >
              {t("shopEverything")}
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              {t("whyEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-4xl text-plum">
              {t("whyTitle")}
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-charcoal/70">
              {t("whyBody")}
            </p>
            <ul className="mt-8 space-y-5">
              {whyPoints.map(([title, text]) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush text-gold">
                    ✦
                  </span>
                  <div>
                    <p className="font-semibold text-charcoal">{title}</p>
                    <p className="text-sm text-charcoal/60">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-plum p-8 text-warmwhite sm:p-10">
            <p className="font-display text-3xl italic leading-snug">
              {t("quote1")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold font-display text-lg text-charcoal">
                T
              </span>
              <div>
                <p className="font-semibold">{t("quote1Name")}</p>
                <p className="text-xs text-warmwhite/60">{t("quote1Detail")}</p>
              </div>
              <span className="ml-auto text-sm text-gold">★★★★★</span>
            </div>

            <div className="mt-10 border-t border-warmwhite/20 pt-8">
              <p className="font-display text-2xl italic leading-snug">
                {t("quote2")}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold font-display text-lg text-charcoal">
                  N
                </span>
                <div>
                  <p className="font-semibold">{t("quote2Name")}</p>
                  <p className="text-xs text-warmwhite/60">{t("quote2Detail")}</p>
                </div>
                <span className="ml-auto text-sm text-gold">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose to-plum px-6 py-16 text-center text-warmwhite sm:px-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-warmwhite/10 blur-3xl" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            {t("ctaEyebrow")}
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl sm:text-5xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-warmwhite/75">
            {t("ctaSub")}
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-warmwhite px-10 py-4 text-sm font-semibold text-plum transition hover:bg-gold"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </>
  );
}