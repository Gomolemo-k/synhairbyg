"use client";

import { useState } from "react";
import Link from "next/link";
import HeaderInner from "./HeaderInner";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/shop", label: "Shop Wigs" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/policies", label: "Policies" },
  ];

  return (
    <>
      <CartDrawer />
      <div className="bg-maroon py-2 text-center text-xs font-medium tracking-wide text-warmwhite">
        Free nationwide delivery on orders over R1,500 &middot; Secure PayFast
        checkout
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
                  className="py-3 font-semibold text-charcoal/80 transition hover:text-maroon"
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