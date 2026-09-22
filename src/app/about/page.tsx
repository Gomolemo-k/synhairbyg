import type { Metadata } from "next";
import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import { translator } from "@/lib/i18n";

const tm = translator("metadata");

export const metadata: Metadata = {
  title: tm("aboutTitle"),
  description: tm("aboutDescription"),
};

export default function AboutPage() {
  const t = translator("about");

  const cards: [string, string][] = [
    [t("card1Title"), t("card1Text")],
    [t("card2Title"), t("card2Text")],
    [t("card3Title"), t("card3Text")],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-5xl text-plum">
          {t("titlePre")}<span className="italic text-gold">{t("titleAccent")}</span>
        </h1>
        <p className="mt-5 leading-relaxed text-charcoal/70">{t("intro")}</p>
      </div>

      <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h2 className="font-display text-3xl text-plum">{t("h2")}</h2>
          <div className="mt-6 space-y-5 text-charcoal/70">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
          </div>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-plum px-8 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
          >
            {t("cta")}
          </Link>
        </div>
        <div className="order-1 lg:order-2">
          <ProductArt
            from="#5e2433"
            to="#9d6f7c"
            name="SynHair by G"
            className="aspect-[4/5] rounded-3xl shadow-xl shadow-plum/10"
          />
        </div>
      </div>

      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {cards.map(([title, text]) => (
          <div
            key={title}
            className="rounded-2xl border border-blush bg-warmwhite p-8"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-blush text-gold">
              ✦
            </span>
            <h3 className="mt-4 font-display text-xl text-plum">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}