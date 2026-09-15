import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import { products, collections, getProductsByCollection } from "@/lib/products";

export default function HomePage() {
  const bestSellers = products.filter((p) => p.featured).slice(0, 4);
  const featuredProduct = products[0];

  return (
    <>
      <section className="relative overflow-hidden bg-blush">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-maroon/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-maroon/20 bg-warmwhite/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-maroon">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Synthetic &amp; Human Blend
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-maroon sm:text-6xl lg:text-7xl">
              Crowns worth
              <span className="italic text-gold"> celebrating</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/70">
              Hand-picked wigs with silky hair, melt-away lace, and prices that
              make sense. Find your next crown — delivered across South Africa.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-maroon px-8 py-4 text-sm font-semibold text-warmwhite shadow-lg shadow-maroon/20 transition hover:bg-burgundy"
              >
                Shop Wigs
              </Link>
              <Link
                href="/collections"
                className="rounded-full border border-maroon/30 bg-warmwhite/60 px-8 py-4 text-sm font-semibold text-maroon transition hover:bg-warmwhite"
              >
                Explore Collections
              </Link>
            </div>
            <div className="mt-10 flex gap-8">
              <div>
                <p className="font-display text-3xl text-maroon">500+</p>
                <p className="text-xs uppercase tracking-wide text-charcoal/50">
                  Crowns delivered
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-maroon">4.9&#9733;</p>
                <p className="text-xs uppercase tracking-wide text-charcoal/50">
                  Customer rating
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-maroon">R1,500</p>
                <p className="text-xs uppercase tracking-wide text-charcoal/50">
                  Free delivery over
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <ProductArt
              from={featuredProduct.gradient[0]}
              to={featuredProduct.gradient[1]}
              name={featuredProduct.name}
              className="aspect-[4/5] rounded-3xl shadow-2xl shadow-maroon/20"
            />
            <div className="absolute -left-4 bottom-8 rounded-2xl bg-warmwhite px-5 py-4 shadow-xl sm:-left-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                Featured
              </p>
              <p className="font-display text-xl text-maroon">
                {featuredProduct.name}
              </p>
              <p className="text-sm text-charcoal/60">
                {featuredProduct.length} &middot; {featuredProduct.texture}
              </p>
            </div>
            <div className="absolute -right-3 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-maroon text-center text-[10px] font-bold uppercase tracking-wide text-warmwhite shadow-xl sm:-right-6">
              New
              <br />
              Drop
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-blush bg-warmwhite">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-center text-xs font-semibold uppercase tracking-wide text-maroon sm:px-6 md:grid-cols-4 lg:px-8">
          <p>Free delivery over R1,500</p>
          <p>Secure PayFast checkout</p>
          <p>Hand-checked quality</p>
          <p>Nationwide courier</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Shop by mood
            </p>
            <h2 className="mt-2 font-display text-4xl text-maroon">Collections</h2>
          </div>
          <Link
            href="/collections"
            className="text-sm font-semibold text-maroon underline decoration-gold decoration-2 underline-offset-4 transition hover:text-burgundy"
          >
            View all collections
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
                  {getProductsByCollection(collection.slug).length} styles
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
                Customer favourites
              </p>
              <h2 className="mt-2 font-display text-4xl text-maroon">Best Sellers</h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-maroon underline decoration-gold decoration-2 underline-offset-4 transition hover:text-burgundy"
            >
              Shop everything
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
              Why SynHairbyG
            </p>
            <h2 className="mt-2 font-display text-4xl text-maroon">
              Every crown, quality-checked twice
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-charcoal/70">
              We hand-pick every style, steam out the box kinks, check the lace
              and the cap, and only then does it earn the SynHairbyG tag. What
              arrives at your door is the same quality we&apos;d wear ourselves.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                ["Melt-away lace", "Pre-plucked hairlines and ready baby hairs on blend styles."],
                ["Two-point check", "Every unit inspected for shedding, knots, and even density."],
                ["Honest pricing", "No inflated markups — just fair Rands for real quality."],
                ["Aftercare support", "Wash, store, and style guides included in every order."],
              ].map(([title, text]) => (
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

          <div className="rounded-3xl bg-maroon p-8 text-warmwhite sm:p-10">
            <p className="font-display text-3xl italic leading-snug">
              “The lace was so flat I didn&apos;t even need to press it. People
              genuinely thought this was my hair.”
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold font-display text-lg text-charcoal">
                T
              </span>
              <div>
                <p className="font-semibold">Thandi M.</p>
                <p className="text-xs text-warmwhite/60">Cape Signature, 20&quot;</p>
              </div>
              <span className="ml-auto text-sm text-gold">★★★★★</span>
            </div>

            <div className="mt-10 border-t border-warmwhite/20 pt-8">
              <p className="font-display text-2xl italic leading-snug">
                “First synthetic I&apos;ve bought that didn&apos;t tangle by
                week two. Gisele Glossy Bob is elite.”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold font-display text-lg text-charcoal">
                  N
                </span>
                <div>
                  <p className="font-semibold">Naledi K.</p>
                  <p className="text-xs text-warmwhite/60">Gisele Glossy Bob</p>
                </div>
                <span className="ml-auto text-sm text-gold">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-burgundy to-maroon px-6 py-16 text-center text-warmwhite sm:px-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-warmwhite/10 blur-3xl" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Free delivery over R1,500
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl sm:text-5xl">
            Your next crown is one click away
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-warmwhite/75">
            Browse the Signature Human Blend, the playful Synthetic Edit, or the
            Bridal &amp; Occasion favourites.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-warmwhite px-10 py-4 text-sm font-semibold text-maroon transition hover:bg-gold"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </>
  );
}