import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { translator } from "@/lib/i18n";

export default function Footer() {
  const t = translator("footer");
  const year = new Date().getFullYear();

  const shopLinks = [
    { href: "/shop?type=Human+Blend", label: t("linkHumanBlend") },
    { href: "/shop?type=Synthetic", label: t("linkSynthetic") },
    { href: "/collections/signature-blend", label: t("linkSignature") },
    { href: "/collections/synthetic", label: t("linkSyntheticEdit") },
    { href: "/collections/bridal-occasion", label: t("linkBridal") },
  ];

  const companyLinks = [
    { href: "/about", label: t("linkStory") },
    { href: "/contact", label: t("linkContact") },
    { href: "/policies", label: t("linkShipping") },
    { href: "/policies", label: t("linkReturns") },
    { href: "/policies", label: t("linkPrivacy") },
  ];

  return (
    <footer className="mt-20 border-t border-blush bg-plum text-warmwhite">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-semibold">
              Syn<span className="text-gold">Hair</span>byG
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-warmwhite/75">
              {t("tagline")}
            </p>
            <p className="mt-5 text-sm text-warmwhite/60">{t("contact")}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              {t("headingShop")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {shopLinks.map((link) => (
                <li key={link.label + link.href}>
                  <Link
                    href={link.href}
                    className="text-warmwhite/75 transition hover:text-warmwhite"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              {t("headingCompany")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-warmwhite/75 transition hover:text-warmwhite"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <span className="text-warmwhite/75">{t("instagram")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-warmwhite/15 pt-8">
          <div className="max-w-md">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-warmwhite/15 pt-6 text-xs text-warmwhite/55 sm:flex-row">
          <p>{t("copyright", { year })}</p>
          <p className="flex items-center gap-3">
            <span>{t("securePayments")}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>{t("madeInSA")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}