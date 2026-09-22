import type { Metadata } from "next";
import { translator } from "@/lib/i18n";

const tm = translator("metadata");

export const metadata: Metadata = {
  title: tm("policiesTitle"),
  description: tm("policiesDescription"),
};

type SectionDef = {
  id: string;
  titleKey: string;
  blockKeys: [string, string][];
};

const sections: SectionDef[] = [
  {
    id: "shipping",
    titleKey: "shippingTitle",
    blockKeys: [
      ["shippingBlock1Heading", "shippingBlock1Body"],
      ["shippingBlock2Heading", "shippingBlock2Body"],
    ],
  },
  {
    id: "returns",
    titleKey: "returnsTitle",
    blockKeys: [
      ["returnsBlock1Heading", "returnsBlock1Body"],
      ["returnsBlock2Heading", "returnsBlock2Body"],
      ["returnsBlock3Heading", "returnsBlock3Body"],
      ["returnsBlock4Heading", "returnsBlock4Body"],
      ["returnsBlock5Heading", "returnsBlock5Body"],
    ],
  },
  {
    id: "payments",
    titleKey: "paymentsTitle",
    blockKeys: [
      ["paymentsBlock1Heading", "paymentsBlock1Body"],
      ["paymentsBlock2Heading", "paymentsBlock2Body"],
      ["paymentsBlock3Heading", "paymentsBlock3Body"],
    ],
  },
  {
    id: "privacy",
    titleKey: "privacyTitle",
    blockKeys: [
      ["privacyBlock1Heading", "privacyBlock1Body"],
      ["privacyBlock2Heading", "privacyBlock2Body"],
      ["privacyBlock3Heading", "privacyBlock3Body"],
    ],
  },
  {
    id: "terms",
    titleKey: "termsTitle",
    blockKeys: [
      ["termsBlock1Heading", "termsBlock1Body"],
      ["termsBlock2Heading", "termsBlock2Body"],
      ["termsBlock3Heading", "termsBlock3Body"],
      ["termsBlock4Heading", "termsBlock4Body"],
      ["termsBlock5Heading", "termsBlock5Body"],
    ],
  },
];

export default function PoliciesPage() {
  const t = translator("policies");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-display text-5xl text-plum">{t("title")}</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <nav className="hidden content-start gap-2 lg:sticky lg:top-28 lg:flex lg:flex-col">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full px-4 py-2 text-sm font-semibold text-charcoal/60 transition hover:bg-blush hover:text-plum"
            >
              {t(section.titleKey)}
            </a>
          ))}
        </nav>

        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-8 w-1 rounded-full bg-gold" />
                <h2 className="font-display text-3xl text-plum">
                  {t(section.titleKey)}
                </h2>
              </div>
              <div className="space-y-5">
                {section.blockKeys.map(([headingKey, bodyKey]) => (
                  <div
                    key={headingKey}
                    className="rounded-2xl border border-blush bg-warmwhite p-6"
                  >
                    <h3 className="font-semibold text-charcoal">
                      {t(headingKey)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">
                      {t(bodyKey)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}