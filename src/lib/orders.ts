import "server-only";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import pg from "pg";

export type OrderStatus =
  | "pending"
  | "paid"
  | "complete"
  | "delivered"
  | "cancelled"
  | "failed"
  | "demo";

export type ShippingMethod = "courier" | "collection";

export type Order = {
  id: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping: {
    method: ShippingMethod;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    notes?: string;
  };
  lines: {
    productId: string;
    name: string;
    qty: number;
    price: number;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  pfPaymentId?: string;
  pfToken?: string;
};

const DATABASE_URL = process.env.DATABASE_URL;

const pool = DATABASE_URL
  ? new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    })
  : null;

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function newId() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function saveOrder(order: Order) {
  if (pool) {
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query(
        `insert into orders (
           id, status, customer_first_name, customer_last_name, customer_email,
           customer_phone, shipping_method, shipping_address1, shipping_address2,
           shipping_city, shipping_province, shipping_postal_code, shipping_notes,
           subtotal, shipping_fee, total, pf_payment_id, pf_token
         ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         on conflict (id) do update set
           status = excluded.status,
           subtotal = excluded.subtotal,
           shipping_fee = excluded.shipping_fee,
           total = excluded.total,
           pf_payment_id = excluded.pf_payment_id,
           pf_token = excluded.pf_token,
           updated_at = now()`,
        [
          order.id,
          order.status,
          order.customer.firstName,
          order.customer.lastName,
          order.customer.email,
          order.customer.phone,
          order.shipping.method,
          order.shipping.address1,
          order.shipping.address2 ?? null,
          order.shipping.city,
          order.shipping.province,
          order.shipping.postalCode,
          order.shipping.notes ?? null,
          order.subtotal,
          order.shippingFee,
          order.total,
          order.pfPaymentId ?? null,
          order.pfToken ?? null,
        ],
      );
      await client.query("delete from order_items where order_id = $1", [
        order.id,
      ]);
      for (const line of order.lines) {
        const wig = await client.query("select 1 from wigs where id = $1", [
          line.productId,
        ]);
        await client.query(
          `insert into order_items (order_id, wig_id, name, qty, price)
           values ($1,$2,$3,$4,$5)`,
          [
            order.id,
            wig.rowCount ? line.productId : null,
            line.name,
            line.qty,
            line.price,
          ],
        );
      }
      await client.query("commit");
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  let orders: Order[] = [];
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    orders = JSON.parse(raw) as Order[];
  } catch {
    orders = [];
  }
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) orders[idx] = order;
  else orders.unshift(order);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function rowToOrder(
  row: Record<string, unknown>,
  items: { wig_id: string | null; name: string; qty: number; price: string }[],
): Order {
  return {
    id: String(row.id),
    createdAt: new Date(row.created_at as string).toISOString(),
    customer: {
      firstName: String(row.customer_first_name),
      lastName: String(row.customer_last_name),
      email: String(row.customer_email),
      phone: String(row.customer_phone ?? ""),
    },
    shipping: {
      method: row.shipping_method as ShippingMethod,
      address1: String(row.shipping_address1 ?? ""),
      address2: String(row.shipping_address2 ?? ""),
      city: String(row.shipping_city ?? ""),
      province: String(row.shipping_province ?? ""),
      postalCode: String(row.shipping_postal_code ?? ""),
      notes: String(row.shipping_notes ?? ""),
    },
    lines: items.map((i) => ({
      productId: i.wig_id ?? "",
      name: i.name,
      qty: i.qty,
      price: Number(i.price),
    })),
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee),
    total: Number(row.total),
    status: row.status as OrderStatus,
    pfPaymentId: row.pf_payment_id ? String(row.pf_payment_id) : undefined,
    pfToken: row.pf_token ? String(row.pf_token) : undefined,
  };
}

export async function loadOrder(id: string): Promise<Order | undefined> {
  if (pool) {
    const order = await pool.query("select * from orders where id = $1", [id]);
    if (order.rowCount === 0) return undefined;
    const items = await pool.query(
      "select * from order_items where order_id = $1",
      [id],
    );
    return rowToOrder(order.rows[0], items.rows);
  }

  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    const orders = JSON.parse(raw) as Order[];
    return orders.find((o) => o.id === id);
  } catch {
    return undefined;
  }
}

export function createOrderId() {
  return `SYN-${new Date().getFullYear()}-${newId()}`;
}