import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { translator } from "@/lib/i18n";

const tm = translator("metadata");

export const metadata: Metadata = {
  title: tm("contactTitle"),
  description: tm("contactDescription"),
};

export default function ContactPage() {
  const t = translator("contact");
  const tc = translator("common");

  const details = [
    {
      label: t("emailLabel"),
      value: t("emailValue"),
      note: t("emailNote"),
      href: `mailto:${t("emailValue")}`,
    },
    {
      label: t("whatsappLabel"),
      value: t("whatsappValue"),
      note: t("whatsappNote"),
    },
    {
      label: t("instagramLabel"),
      value: t("instagramValue"),
      note: t("instagramNote"),
      href: tc("instagramUrl"),
    },
    {
      label: t("tiktokLabel"),
      value: t("tiktokValue"),
      note: t("tiktokNote"),
      href: tc("tiktokUrl"),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-display text-5xl text-plum">{t("title")}</h1>
        <p className="mt-3 leading-relaxed text-charcoal/65">{t("sub")}</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <ContactForm />

        <div className="grid content-start gap-4 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border border-blush bg-warmwhite p-6"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                {detail.label}
              </p>
              {detail.href ? (
                <a
                  href={detail.href}
                  className="mt-2 inline-block font-semibold text-charcoal underline decoration-gold decoration-2 underline-offset-4 transition hover:text-rose"
                >
                  {detail.value}
                </a>
              ) : (
                <p className="mt-2 font-semibold text-charcoal">{detail.value}</p>
              )}
              <p className="mt-1 text-xs text-charcoal/50">{detail.note}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-blush bg-warmwhite p-6 sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              {t("hoursLabel")}
            </p>
            <p className="mt-2 font-semibold text-charcoal">{t("hoursWeekdays")}</p>
            <p className="font-semibold text-charcoal">{t("hoursWeekends")}</p>
            <p className="mt-1 text-xs text-charcoal/50">{t("hoursCallsNote")}</p>
          </div>

          <div className="rounded-2xl bg-plum p-6 text-warmwhite sm:col-span-2">
            <p className="font-display text-xl italic">{t("quote")}</p>
            <p className="mt-3 text-xs text-warmwhite/60">{t("quoteNote")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}