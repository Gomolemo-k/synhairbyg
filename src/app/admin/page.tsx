import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { loadAllOrders } from "@/lib/orders";
import { STATUS_LABELS } from "@/lib/tracking";
import { formatZAR } from "@/lib/format";
import OrderStatusControl from "@/components/OrderStatusControl";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  if (!isAdmin(user)) redirect("/account");

  const orders = await loadAllOrders();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-plum">Admin dashboard</h1>
          <p className="mt-2 text-sm text-charcoal/60">
            {orders.length} order{orders.length === 1 ? "" : "s"} · update
            delivery status as packages move through PAXI.
          </p>
        </div>
        <Link
          href="/account"
          className="rounded-full border border-plum/30 px-6 py-2.5 text-sm font-semibold text-plum transition hover:bg-blush"
        >
          ← Back to account
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-blush bg-warmwhite p-12 text-center">
          <p className="text-charcoal/60">No orders yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-blush bg-warmwhite">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-blush text-xs font-bold uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Delivery</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blush/70">
              {orders.map((order) => (
                <tr key={order.id} className="align-top">
                  <td className="px-5 py-3">
                    <Link
                      href={`/order-confirmation?order=${encodeURIComponent(order.id)}`}
                      className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-2"
                    >
                      {order.id}
                    </Link>
                    <p className="mt-0.5 text-xs text-charcoal/45">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-charcoal">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-xs text-charcoal/50">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-xs text-charcoal/70">
                    {order.lines.map((l) => (
                      <p key={l.productId + l.name}>
                        {l.name} × {l.qty}
                      </p>
                    ))}
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {order.paxi ? (
                      <>
                        <p className="font-medium text-charcoal">
                          {order.paxi.pointName}
                        </p>
                        <p className="text-charcoal/50">
                          {order.paxi.pointAddress}
                        </p>
                        <p className="text-charcoal/40">
                          {order.paxi.service} · Point {order.paxi.pointCode}
                        </p>
                      </>
                    ) : (
                      <span className="text-charcoal/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-semibold text-plum">
                    {formatZAR(order.total)}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-blush px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-plum">
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <OrderStatusControl
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}