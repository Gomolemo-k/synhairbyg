import Link from "next/link";

const shopLinks = [
  { href: "/shop?type=Human+Blend", label: "Human Blend Wigs" },
  { href: "/shop?type=Synthetic", label: "Synthetic Wigs" },
  { href: "/collections/signature-blend", label: "Signature Blend" },
  { href: "/collections/synthetic", label: "Synthetic Edit" },
  { href: "/collections/bridal-occasion", label: "Bridal & Occasion" },
];

const companyLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact Us" },
  { href: "/policies", label: "Shipping & Delivery" },
  { href: "/policies", label: "Returns & Refunds" },
  { href: "/policies", label: "Privacy & Terms" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-blush bg-plum text-warmwhite">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-semibold">
              Syn<span className="text-gold">Hair</span>byG
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-warmwhite/75">
              Hand-picked synthetic and human blend wigs, made for the modern
              crown. Every piece is quality-checked, packed with love, and
              delivered across South Africa.
            </p>
            <p className="mt-5 text-sm text-warmwhite/60">
              hello@synhairbyg.com &middot; WhatsApp +27 82 000 0000 &middot;
              Johannesburg, South Africa
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Shop
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
              Company
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
                <span className="text-warmwhite/75">Instagram @synhairbyg</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-warmwhite/15 pt-6 text-xs text-warmwhite/55 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SynHairbyG. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>Secure PayFast payments</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>Made with love in SA</span>
          </p>
        </div>
      </div>
    </footer>
  );
}