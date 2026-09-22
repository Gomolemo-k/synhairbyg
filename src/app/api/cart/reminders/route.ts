import { NextResponse } from "next/server";
import { getSessionUser, isAdmin } from "@/lib/auth";
import {
  cartItems,
  findAbandonedCarts,
  recordCartReminder,
} from "@/lib/cart";
import { getProductById } from "@/lib/products";
import { sendAbandonedCartEmail } from "@/lib/mail/templates";

export async function POST() {
  const user = await getSessionUser();
  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const carts = await findAbandonedCarts(24);
  let sent = 0;
  let failed = 0;

  for (const cart of carts) {
    const rows = await cartItems(cart.cartId);
    const items = rows
      .map((row) => {
        const product = getProductById(row.productId);
        return product
          ? { name: product.name, qty: row.qty, price: product.price }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (items.length === 0) continue;

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const result = await sendAbandonedCartEmail({
      to: cart.email,
      name: cart.name,
      items,
      total,
    });

    if (result.success) {
      await recordCartReminder(cart.userId);
      sent += 1;
    } else {
      failed += 1;
      console.error("Abandoned cart email failed:", cart.email, result.error);
    }
  }

  return NextResponse.json({ sent, failed, checked: carts.length });
}