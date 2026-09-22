import Link from "next/link";
import { translator } from "@/lib/i18n";

export default function NotFound() {
  const t = translator("notFound");
  const tc = translator("common");

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-8xl italic text-blush">{t("code")}</p>
      <h1 className="mt-4 font-display text-4xl text-plum">{t("title")}</h1>
      <p className="mt-3 text-charcoal/60">{t("body")}</p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-plum px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
      >
        {tc("shopWigs")}
      </Link>
    </div>
  );
}