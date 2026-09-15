import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-8xl italic text-blush">404</p>
      <h1 className="mt-4 font-display text-4xl text-maroon">
        This curl can&apos;t be found
      </h1>
      <p className="mt-3 text-charcoal/60">
        That page may have moved — but the best-sellers are still right here.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-maroon px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-burgundy"
      >
        Shop Wigs
      </Link>
    </div>
  );
}