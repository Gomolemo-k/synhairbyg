import "server-only";
import { pool } from "./db";
import { getProductById } from "./products";

export type CartSyncItem = { productId: string; qty: number };

export async function syncCartForUser(
  userId: string,
  items: CartSyncItem[],
): Promise<void> {
  if (!pool) return;
  const existing = await pool.query("select id from carts where user_id = $1", [
    userId,
  ]);
  let cartId: string;
  if (existing.rowCount) {
    cartId = String(existing.rows[0].id);
    await pool.query("update carts set updated_at = now() where id = $1", [
      cartId,
    ]);
  } else {
    const created = await pool.query(
      "insert into carts (user_id) values ($1) returning id",
      [userId],
    );
    cartId = String(created.rows[0].id);
  }

  await pool.query("delete from cart_items where cart_id = $1", [cartId]);
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue;
    const qty = Math.max(1, Math.min(Math.round(item.qty) || 1, product.stock));
    await pool.query(
      `insert into cart_items (cart_id, wig_id, qty)
       values ($1, $2, $3)
       on conflict (cart_id, wig_id) do update set qty = excluded.qty`,
      [cartId, item.productId, qty],
    );
  }
}

export type AbandonedCart = {
  userId: string;
  name: string;
  email: string;
  cartId: string;
};

/** Carts idle for `sinceHours`+ whose owners have no newer order and no
 *  reminder in the last 48 hours. */
export async function findAbandonedCarts(
  sinceHours = 24,
): Promise<AbandonedCart[]> {
  if (!pool) return [];
  const res = await pool.query(
    `select u.id::text as user_id, u.name, u.email, c.id::text as cart_id
       from carts c
       join users u on u.id = c.user_id
      where c.updated_at < now() - make_interval(hours => $1::int)
        and exists (select 1 from cart_items ci where ci.cart_id = c.id)
        and not exists (
          select 1 from orders o
           where o.user_id = u.id and o.created_at >= c.updated_at
        )
        and not exists (
          select 1 from cart_reminders cr
           where cr.user_id = u.id
             and cr.sent_at > now() - make_interval(hours => 48)
        )
      order by c.updated_at`,
    [sinceHours],
  );
  return res.rows.map((row) => ({
    userId: String(row.user_id),
    name: String(row.name),
    email: String(row.email),
    cartId: String(row.cart_id),
  }));
}

export async function cartItems(
  cartId: string,
): Promise<{ productId: string; qty: number }[]> {
  if (!pool) return [];
  const res = await pool.query(
    "select wig_id, qty from cart_items where cart_id = $1",
    [cartId],
  );
  return res.rows.map((row) => ({
    productId: String(row.wig_id),
    qty: Number(row.qty),
  }));
}

export async function recordCartReminder(userId: string): Promise<void> {
  if (!pool) return;
  await pool.query("insert into cart_reminders (user_id) values ($1)", [
    userId,
  ]);
}