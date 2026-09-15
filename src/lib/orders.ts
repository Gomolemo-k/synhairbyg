import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";

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

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function newId() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function saveOrder(order: Order) {
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

export async function loadOrder(id: string): Promise<Order | undefined> {
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