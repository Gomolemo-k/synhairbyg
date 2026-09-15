import type { Metadata } from "next";
import Link from "next/link";
import ProductArt from "@/components/ProductArt";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story behind SynHairbyG — a proudly South African wig shop built on quality, honesty, and crowns worth celebrating.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          Our story
        </p>
        <h1 className="mt-3 font-display text-5xl text-maroon">
          Behind the <span className="italic text-gold">G</span>
        </h1>
        <p className="mt-5 leading-relaxed text-charcoal/70">
          SynHairbyG started with a very simple frustration: buying a wig online
          should not feel like a gamble. Blurry photos, inflated prices, and lace
          that never blends pushed us to build the shop we always wanted to buy
          from.
        </p>
      </div>

      <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h2 className="font-display text-3xl text-maroon">
            Quality you can trust, prices that make sense
          </h2>
          <div className="mt-6 space-y-5 text-charcoal/70">
            <p>
              We travel for the best mills, picking synthetic fibres that hold
              their pattern and human blends with lace that actually melts. Every
              unit is steamed, brushed, and checked twice before it earns our tag.
            </p>
            <p>
              We&apos;re proudly South African, based in Johannesburg, delivering
              nationwide. When you buy from SynHairbyG, you support a small local
              business that answers your DMs, checks on your install, and cares
              about your crown like it&apos;s our own.
            </p>
            <p>
              From our first bob to our 500th delivery — thank you for trusting us
              with your hair.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-maroon px-8 py-4 text-sm font-semibold text-warmwhite transition hover:bg-burgundy"
          >
            Shop the Story
          </Link>
        </div>
        <div className="order-1 lg:order-2">
          <ProductArt
            from="#6b1f2b"
            to="#8b3040"
            name="SynHair by G"
            className="aspect-[4/5] rounded-3xl shadow-xl shadow-maroon/10"
          />
        </div>
      </div>

      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {[
          [
            "Two-point check",
            "Every wig is inspected for shedding, loose knots, and even density before dispatch.",
          ],
          [
            "Honest listings",
            "Real lengths, real textures, real colours — no filtered surprises at your door.",
          ],
          [
            "Aftercare built in",
            "Every order ships with wash, store, and style guides plus lifetime DM support.",
          ],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-2xl border border-blush bg-warmwhite p-8"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-blush text-gold">
              ✦
            </span>
            <h3 className="mt-4 font-display text-xl text-maroon">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}