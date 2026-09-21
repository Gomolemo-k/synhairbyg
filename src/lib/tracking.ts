import type { OrderStatus } from "./orders";

export const ORDER_STEPS: OrderStatus[] = [
  "pending",
  "paid",
  "packed",
  "sent",
  "delivered",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Payment pending",
  paid: "Payment confirmed",
  packed: "Packed & ready",
  sent: "On its way with PAXI",
  delivered: "At your PAXI store",
  complete: "Delivered",
  cancelled: "Cancelled",
  failed: "Payment failed",
  demo: "Test order (demo)",
};

export const STEP_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: "We've received your order and are waiting for payment to confirm.",
  paid: "Payment confirmed. We're preparing your order for dispatch.",
  packed: "Your wig is packed and ready to be handed to PAXI.",
  sent: "Your parcel is on its way to your chosen PAXI store.",
  delivered: "Your parcel is ready to collect at your PAXI store. Bring your ID.",
  complete: "Delivery complete. Enjoy your new wig!",
  cancelled: "This order was cancelled. Any refund is processed to your original payment method.",
  failed: "Payment didn't complete. Please try again or contact us for help.",
  demo: "This order was placed in demo mode — no real payment was taken.",
};

export function stepIndex(status: OrderStatus) {
  const idx = ORDER_STEPS.indexOf(status);
  return idx >= 0 ? idx : -1;
}

export function statusProgress(status: OrderStatus): number {
  const idx = ORDER_STEPS.indexOf(status);
  if (idx >= 0) return idx + 1;
  if (status === "complete") return ORDER_STEPS.length;
  return 0;
}

export const ADMIN_STATUS_CHOICES: {
  value: OrderStatus;
  label: string;
}[] = [
  { value: "paid", label: "Paid" },
  { value: "packed", label: "Packed" },
  { value: "sent", label: "Sent / on its way" },
  { value: "delivered", label: "At store / collected" },
  { value: "cancelled", label: "Cancelled" },
];

export function canTransition(from: OrderStatus, to: OrderStatus) {
  const forward = ["pending", "paid", "packed", "sent", "delivered"];
  const fi = forward.indexOf(from);
  const ti = forward.indexOf(to);
  if (fi === -1) return true; // terminal/unusual states are freely editable
  if (ti === -1) return true;
  return ti >= fi;
}