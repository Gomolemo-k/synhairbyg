import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "SynHairbyG shipping, delivery, returns and refunds, privacy, and terms & conditions.",
};

const sections = [
  {
    id: "shipping",
    title: "Shipping & Delivery",
    blocks: [
      {
        heading: "PAXI delivery",
        body: "Every order is shipped via PAXI and delivered to the PEP / PAXI store you choose at checkout. We aim to dispatch within 1–2 working days, and you'll be notified once your parcel arrives at your store. Standard delivery takes 7–9 working days and express 3–5 working days, from dispatch.",
      },
      {
        heading: "Delivery fees",
        body: "PAXI delivery is a flat R59.95 (standard bag, up to 5kg) or R109.95 (large bag, up to 10kg) for standard speed. Express delivery is R109.95 (standard bag) or R139.95 (large bag). Orders of R1,500 or more qualify for free delivery.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    blocks: [
      {
        heading: "Cancel before dispatch — full refund",
        body: "Changed your mind before your order ships? No problem. Request a cancellation within 24 hours of placing your order (or before dispatch, whichever comes first) and we'll process a full refund to your original payment method within 5–7 working days.",
      },
      {
        heading: "After dispatch — returns and exchanges",
        body: "Orders dispatched and accepted by you are eligible for exchange within 7 days of delivery, provided the wig is unused, unworn, unwashed, and in its original packaging with all tags intact. Exchanges are subject to stock availability; you may also return for a store credit.",
      },
      {
        heading: "Final sale — worn or used wigs",
        body: "For hygiene reasons, wigs that have been worn, tried on against your scalp, washed, styled, cut, or removed from their original packaging beyond inspection are FINAL SALE. We cannot accept returns, exchanges, or refunds on worn wigs. Please inspect your wig carefully on arrival before wearing it.",
      },
      {
        heading: "Damaged or incorrect items",
        body: "If your order arrives damaged, or you received the wrong item, tell us within 48 hours of delivery with a photo and your order number and we'll make it right — a replacement or a full refund including delivery costs.",
      },
      {
        heading: "How refunds are processed",
        body: "Approved refunds are returned to your original payment method within 5–7 working days. Store credits are issued as a gift card balance and never expire.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payment & Security",
    blocks: [
      {
        heading: "Yoco checkout",
        body: "We process payments securely through Yoco. You can pay with a credit or debit card — payment is processed instantly and your order is confirmed right away.",
      },
      {
        heading: "Your data",
        body: "We never see or store your full payment details. Card information is handled directly by Yoco over encrypted connections. We only keep the details needed to fulfil your order.",
      },
      {
        heading: "Order confirmation",
        body: "You'll receive an email confirmation as soon as your order is placed, with a link to track its payment and delivery status.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    blocks: [
      {
        heading: "What we collect",
        body: "We collect your name, contact details, delivery address, and order history — only what's needed to process and deliver your orders and support you after the sale.",
      },
      {
        heading: "What we never do",
        body: "We never sell, rent, or share your personal information with third parties for marketing. Your data is used strictly to run the shop and communicate about your orders.",
      },
      {
        heading: "Marketing",
        body: "If you opt in to updates, you can unsubscribe at any time. Every email includes an unsubscribe link.",
      },
    ],
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    blocks: [
      {
        heading: "Product information",
        body: "We do our best to describe lengths, textures, and colours accurately. Slight variations in shade and length can occur between batches — that's the nature of hair. Photos may differ slightly from the physical item.",
      },
      {
        heading: "Pricing",
        body: "All prices are in South African Rand (ZAR) and include VAT where applicable. We reserve the right to update prices; the price shown at checkout is the price you pay.",
      },
      {
        heading: "Stock availability",
        body: "All orders are subject to availability. If an item in your order becomes unavailable, we'll contact you to replace it, refund it, or hold your order — your choice.",
      },
      {
        heading: "Hygiene & safety",
        body: "Hair products are intimate items. By purchasing, you accept our hygiene policy that used wigs cannot be returned. Please read the Returns & Refunds section carefully.",
      },
      {
        heading: "Contact",
        body: "Questions about these policies? Email hello@synhairbyg.com or WhatsApp +27 82 000 0000 and we'll help within 24 hours.",
      },
    ],
  },
] as const;

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          The fine print, in plain English
        </p>
        <h1 className="mt-2 font-display text-5xl text-plum">Policies</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <nav className="hidden content-start gap-2 lg:sticky lg:top-28 lg:flex lg:flex-col">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full px-4 py-2 text-sm font-semibold text-charcoal/60 transition hover:bg-blush hover:text-plum"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-8 w-1 rounded-full bg-gold" />
                <h2 className="font-display text-3xl text-plum">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-5">
                {section.blocks.map((block) => (
                  <div
                    key={block.heading}
                    className="rounded-2xl border border-blush bg-warmwhite p-6"
                  >
                    <h3 className="font-semibold text-charcoal">{block.heading}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">
                      {block.body}
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