import "server-only";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { pool } from "./db";
import type { PaxiBag, PaxiService } from "./paxiPricing";

export type OrderStatus =
  | "pending"
  | "paid"
  | "packed"
  | "sent"
  | "complete"
  | "delivered"
  | "cancelled"
  | "failed"
  | "demo";

export type ShippingMethod = "paxi" | "courier" | "collection";
export type PaymentProvider = "yoco" | "demo";

export type Order = {
  id: string;
  createdAt: string;
  userId?: string;
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
  paxi?: {
    pointCode: string;
    pointName: string;
    pointAddress: string;
    bag: PaxiBag;
    service: PaxiService;
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
  paymentProvider?: PaymentProvider;
  yocoCheckoutId?: string;
  yocoPaymentId?: string;
};

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
           id, user_id, status, customer_first_name, customer_last_name, customer_email,
           customer_phone, shipping_method, shipping_address1, shipping_address2,
           shipping_city, shipping_province, shipping_postal_code, shipping_notes,
           delivery_provider, paxi_point_code, paxi_point_name, paxi_point_address,
           paxi_bag, paxi_service, subtotal, shipping_fee, total, payment_provider,
           yoco_checkout_id, yoco_payment_id
         ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
         on conflict (id) do update set
           status = excluded.status,
           user_id = coalesce(excluded.user_id, orders.user_id),
           shipping_method = excluded.shipping_method,
           shipping_address1 = excluded.shipping_address1,
           shipping_address2 = excluded.shipping_address2,
           shipping_city = excluded.shipping_city,
           shipping_province = excluded.shipping_province,
           shipping_postal_code = excluded.shipping_postal_code,
           shipping_notes = excluded.shipping_notes,
           delivery_provider = excluded.delivery_provider,
           paxi_point_code = excluded.paxi_point_code,
           paxi_point_name = excluded.paxi_point_name,
           paxi_point_address = excluded.paxi_point_address,
           paxi_bag = excluded.paxi_bag,
           paxi_service = excluded.paxi_service,
           subtotal = excluded.subtotal,
           shipping_fee = excluded.shipping_fee,
           total = excluded.total,
           payment_provider = coalesce(excluded.payment_provider, orders.payment_provider),
yoco_checkout_id = coalesce(excluded.yoco_checkout_id, orders.yoco_checkout_id),
            yoco_payment_id = coalesce(excluded.yoco_payment_id, orders.yoco_payment_id),
            updated_at = now()`,
        [
          order.id,
          order.userId ?? null,
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
          order.shipping.method === "paxi" ? "paxi" : order.shipping.method,
          order.paxi?.pointCode ?? null,
          order.paxi?.pointName ?? null,
          order.paxi?.pointAddress ?? null,
          order.paxi?.bag ?? null,
          order.paxi?.service ?? null,
          order.subtotal,
          order.shippingFee,
          order.total,
          order.paymentProvider ?? "demo",
          order.yocoCheckoutId ?? null,
          order.yocoPaymentId ?? null,
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
  const method = row.shipping_method as ShippingMethod;
  return {
    id: String(row.id),
    createdAt: new Date(row.created_at as string).toISOString(),
    userId: row.user_id ? String(row.user_id) : undefined,
    customer: {
      firstName: String(row.customer_first_name),
      lastName: String(row.customer_last_name),
      email: String(row.customer_email),
      phone: String(row.customer_phone ?? ""),
    },
    shipping: {
      method,
      address1: String(row.shipping_address1 ?? ""),
      address2: String(row.shipping_address2 ?? ""),
      city: String(row.shipping_city ?? ""),
      province: String(row.shipping_province ?? ""),
      postalCode: String(row.shipping_postal_code ?? ""),
      notes: String(row.shipping_notes ?? ""),
    },
    paxi:
      method === "paxi" && row.paxi_point_code
        ? {
            pointCode: String(row.paxi_point_code),
            pointName: String(row.paxi_point_name ?? ""),
            pointAddress: String(row.paxi_point_address ?? ""),
            bag: (row.paxi_bag as PaxiBag) ?? "standard",
            service: (row.paxi_service as PaxiService) ?? "standard",
          }
        : undefined,
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
    paymentProvider: row.payment_provider
      ? (row.payment_provider as PaymentProvider)
      : undefined,
    yocoCheckoutId: row.yoco_checkout_id
      ? String(row.yoco_checkout_id)
      : undefined,
    yocoPaymentId: row.yoco_payment_id
      ? String(row.yoco_payment_id)
      : undefined,
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

async function loadOrdersWith(
  whereSql: string,
  params: unknown[],
): Promise<Order[]> {
  if (!pool) return [];
  const res = await pool.query(
    `select * from orders ${whereSql} order by created_at desc`,
    params,
  );
  const rows = res.rows;
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const items = await pool.query(
    "select * from order_items where order_id = any($1::text[])",
    [ids],
  );
  const byOrder = new Map<string, typeof items.rows>();
  for (const row of items.rows) {
    const key = String(row.order_id);
    const list = byOrder.get(key) ?? [];
    list.push(row);
    byOrder.set(key, list);
  }
  return rows.map((row) => rowToOrder(row, byOrder.get(row.id) ?? []));
}

export async function loadOrdersByUser(userId: string): Promise<Order[]> {
  if (!pool) return [];
  return loadOrdersWith("where user_id = $1", [userId]);
}

export async function loadAllOrders(): Promise<Order[]> {
  return loadOrdersWith("", []);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<boolean> {
  if (!pool) return false;
  const res = await pool.query(
    "update orders set status = $2, updated_at = now() where id = $1",
    [id, status],
  );
  return (res.rowCount ?? 0) > 0;
}

export function createOrderId() {
  return `SYN-${new Date().getFullYear()}-${newId()}`;
}