"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { translator } from "@/lib/i18n";

export function CartToggle() {
  const { count, openCart } = useCart();
  const t = translator("header");

  return (
    <button
      onClick={openCart}
      aria-label={t("openCart", { count })}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-plum/25 text-plum transition hover:bg-blush"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-plum text-[10px] font-bold text-warmwhite">
          {count}
        </span>
      )}
    </button>
  );
}

export function MobileMenuToggle({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const t = translator("header");
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-label={t("toggleMenu")}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/25 text-plum transition hover:bg-blush md:hidden"
    >
      {open ? (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 8h18M3 16h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

export default function HeaderInner({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const t = translator("header");

  const nav = [
    { href: "/shop", label: t("navShop") },
    { href: "/collections", label: t("navCollections") },
    { href: "/track", label: t("navTrack") },
    { href: "/about", label: t("navAbout") },
    { href: "/contact", label: t("navContact") },
  ];

  return (
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="whitespace-nowrap font-display text-2xl font-semibold text-plum transition hover:text-rose md:text-3xl"
      >
        Syn<span className="text-gold">Hair</span>byG
      </Link>

      <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wide text-charcoal/80 md:flex">
        {nav.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition hover:text-plum"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href="/account"
          aria-label={t("myAccount")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/25 text-plum transition hover:bg-blush"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
        <CartToggle />
        <MobileMenuToggle open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}