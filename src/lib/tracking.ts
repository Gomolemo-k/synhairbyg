import type { OrderStatus } from "./orders";

export const ORDER_STEPS: OrderStatus[] = [
  "pending",
  "paid",
  "packed",
  "sent",
  "delivered",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "status.pending",
  paid: "status.paid",
  packed: "status.packed",
  sent: "status.sent",
  delivered: "status.delivered",
  complete: "status.complete",
  cancelled: "status.cancelled",
  failed: "status.failed",
  demo: "status.demo",
};

export const STEP_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: "step.pending",
  paid: "step.paid",
  packed: "step.packed",
  sent: "step.sent",
  delivered: "step.delivered",
  complete: "step.complete",
  cancelled: "step.cancelled",
  failed: "step.failed",
  demo: "step.demo",
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
  labelKey: string;
}[] = [
  { value: "paid", labelKey: "admin.paid" },
  { value: "packed", labelKey: "admin.packed" },
  { value: "sent", labelKey: "admin.sent" },
  { value: "delivered", labelKey: "admin.delivered" },
  { value: "cancelled", labelKey: "admin.cancelled" },
];

export function canTransition(from: OrderStatus, to: OrderStatus) {
  const forward = ["pending", "paid", "packed", "sent", "delivered"];
  const fi = forward.indexOf(from);
  const ti = forward.indexOf(to);
  if (fi === -1) return true; // terminal/unusual states are freely editable
  if (ti === -1) return true;
  return ti >= fi;
}