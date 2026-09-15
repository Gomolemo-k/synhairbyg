import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SynHairbyG — orders, restocks, wholesale, or just a quick question about your crown.",
};

export default function ContactPage() {
  const details = [
    {
      label: "Email",
      value: "hello@synhairbyg.com",
      note: "Replies within 24 hours",
    },
    {
      label: "WhatsApp",
      value: "+27 82 000 0000",
      note: "Fastest way to reach us",
    },
    {
      label: "Instagram",
      value: "@synhairbyg",
      note: "Drops, restocks & hair inspo",
    },
    {
      label: "Location",
      value: "Johannesburg, SA",
      note: "Collection by appointment",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          Talk to us
        </p>
        <h1 className="mt-2 font-display text-5xl text-maroon">Contact</h1>
        <p className="mt-3 leading-relaxed text-charcoal/65">
          Questions about a wig, restock dates, wholesale, or a return? Drop us a
          line — a real human answers.
        </p>
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
              <p className="mt-2 font-semibold text-charcoal">{detail.value}</p>
              <p className="mt-1 text-xs text-charcoal/50">{detail.note}</p>
            </div>
          ))}

          <div className="rounded-2xl bg-maroon p-6 text-warmwhite sm:col-span-2">
            <p className="font-display text-xl italic">
              “Fast replies, honest answers, and it always feels like a friend is
              helping.”
            </p>
            <p className="mt-3 text-xs text-warmwhite/60">
              — what customers say about our DMs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}