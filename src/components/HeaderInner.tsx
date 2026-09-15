"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartToggle() {
  const { count, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart (${count} items)`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-maroon/25 text-maroon transition hover:bg-blush"
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
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-warmwhite">
          {count}
        </span>
      )}
    </button>
  );
}

export function MobileMenuToggle({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-label="Toggle menu"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-maroon/25 text-maroon transition hover:bg-blush md:hidden"
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
  const nav = [
    { href: "/shop", label: "Shop Wigs" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="font-display text-2xl font-semibold tracking-wide text-maroon transition hover:text-burgundy md:text-3xl"
      >
        Syn<span className="text-gold">Hair</span>byG
      </Link>

      <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wide text-charcoal/80 md:flex">
        {nav.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition hover:text-maroon"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <CartToggle />
        <MobileMenuToggle open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}