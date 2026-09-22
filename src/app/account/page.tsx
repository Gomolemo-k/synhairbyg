import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { loadOrdersByUser } from "@/lib/orders";
import { STATUS_LABELS } from "@/lib/tracking";
import { formatZAR } from "@/lib/format";
import SignOutButton from "@/components/SignOutButton";
import { translator } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const t = translator("account");
  const tt = translator("tracking");
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  const orders = await loadOrdersByUser(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-plum">{t("title")}</h1>
          <p className="mt-2 text-sm text-charcoal/60">
            {t("welcome", { name: user.name })}
          </p>
        </div>
        <SignOutButton />
      </div>

      {user.role === "admin" && (
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-full bg-gold/15 px-6 py-2.5 text-sm font-bold text-gold transition hover:bg-gold/25"
        >
          {t("adminLink")}
        </Link>
      )}

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-plum">{t("orderHistory")}</h2>
          <Link
            href="/track"
            className="text-sm font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
          >
            {t("trackPackage")}
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-blush bg-warmwhite p-10 text-center">
            <p className="text-3xl">🛍️</p>
            <h3 className="mt-3 font-display text-xl text-plum">
              {t("noOrdersTitle")}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal/60">
              {t("noOrdersBody")}
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-plum px-8 py-3 text-sm font-semibold text-warmwhite transition hover:bg-rose"
            >
              {t("shopWigs")}
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-blush bg-warmwhite p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link
                      href={`/order-confirmation?order=${encodeURIComponent(order.id)}`}
                      className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4"
                    >
                      {order.id}
                    </Link>
                    <p className="mt-0.5 text-xs text-charcoal/50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      order.status === "paid" ||
                      order.status === "packed" ||
                      order.status === "sent"
                        ? "bg-gold/15 text-gold"
                        : order.status === "delivered" ||
                            order.status === "complete"
                          ? "bg-plum/10 text-plum"
                          : order.status === "cancelled" ||
                              order.status === "failed"
                            ? "bg-rose/10 text-rose"
                            : "bg-blush text-plum"
                    }`}
                  >
                    {tt(STATUS_LABELS[order.status])}
                  </span>
                </div>

                <p className="mt-3 truncate text-sm text-charcoal/70">
                  {order.lines
                    .map((l) => `${l.name} × ${l.qty}`)
                    .join(", ")}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-blush pt-3 text-sm">
                  <Link
                    href={`/track${order.status === "demo" ? "" : `?order=${encodeURIComponent(order.id)}`}`}
                    className="font-semibold text-plum hover:text-rose"
                  >
                    {t("trackArrow")}
                  </Link>
                  <span className="font-semibold text-plum">
                    {formatZAR(order.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}