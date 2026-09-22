import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { translator } from "@/lib/i18n";

export default function Footer() {
  const t = translator("footer");
  const tc = translator("common");
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
            <p className="whitespace-nowrap font-display text-2xl font-semibold">
              Syn<span className="text-gold">Hair</span>byG
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-warmwhite/75">
              {t("tagline")}
            </p>
            <p className="mt-5 text-sm text-warmwhite/60">
              <a
                href={`mailto:${t("contactEmail")}`}
                className="underline decoration-gold decoration-2 underline-offset-4 transition hover:text-gold"
              >
                {t("contactEmail")}
              </a>
              {t("contactRest")}
            </p>
            <p className="mt-2 text-xs text-warmwhite/50">{t("hours")}</p>
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
                <span className="flex items-center gap-3 pt-1">
                  <a
                    href={tc("instagramUrl")}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("socialInstagram")}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-warmwhite/25 text-warmwhite/75 transition hover:border-gold hover:text-gold"
                  >
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
                      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.2-.1 1.6-.1 4.8-.1zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.2-3.1a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                  <a
                    href={tc("tiktokUrl")}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("socialTikTok")}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-warmwhite/25 text-warmwhite/75 transition hover:border-gold hover:text-gold"
                  >
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
                      <path d="M16.6 3c.3 1.7 1.4 3 3.1 3.4v2.6c-1.2 0-2.3-.3-3.2-.9v6.6c0 3.5-2.9 6.3-6.4 6.3A6.35 6.35 0 013.7 14.5c0-3.5 2.9-6.4 6.4-6.4.3 0 .7 0 1 .1v2.7a3.7 3.7 0 00-1-.1 3.7 3.7 0 103.7 3.7V3h2.8z" />
                    </svg>
                  </a>
                </span>
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