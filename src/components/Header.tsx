"use client";

import { useState } from "react";
import Link from "next/link";
import HeaderInner from "./HeaderInner";
import CartDrawer from "./CartDrawer";
import { translator } from "@/lib/i18n";

export default function Header() {
  const [open, setOpen] = useState(false);
  const t = translator("header");

  const nav = [
    { href: "/shop", label: t("navShop") },
    { href: "/collections", label: t("navCollections") },
    { href: "/track", label: t("navTrack") },
    { href: "/account", label: t("navAccount") },
    { href: "/about", label: t("navAbout") },
    { href: "/contact", label: t("navContact") },
    { href: "/policies", label: t("navPolicies") },
  ];

  return (
    <>
      <CartDrawer />
      <div className="bg-plum py-2 text-center text-xs font-medium tracking-wide text-warmwhite">
        {t("topBar")}
      </div>
      <header className="sticky top-0 z-30 border-b border-blush bg-warmwhite/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <HeaderInner open={open} setOpen={setOpen} />

          {open && (
            <nav className="mt-4 flex flex-col divide-y divide-blush border-t border-blush md:hidden">
              {nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 font-semibold text-charcoal/80 transition hover:text-plum"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}