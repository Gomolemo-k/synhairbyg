export type PaxiBag = "standard" | "large";
export type PaxiService = "standard" | "express";

// PAXI uses flat-rate pricing (no zone/distance charges), set by bag size and
// delivery speed. Verified against paxi.co.za (2026):
//   Standard bag (450x370mm, max 5kg):  R59.95  (7-9 business days)
//                                        R109.95 (3-5 business days)
//   Large bag (640x510mm, max 10kg):    R109.95 (7-9 business days)
//                                        R139.95 (3-5 business days)
// If PAXI publishes a rate API in future, replace this module with a live quote.
export const PAXI_FEES: Record<PaxiService, Record<PaxiBag, number>> = {
  standard: { standard: 59.95, large: 109.95 },
  express: { standard: 109.95, large: 139.95 },
};

export const PAXI_SERVICE_LABELS: Record<PaxiService, string> = {
  standard: "Standard — 7 to 9 business days",
  express: "Express — 3 to 5 business days",
};

export const PAXI_BAG_LABELS: Record<PaxiBag, string> = {
  standard: "Standard bag · up to 5kg",
  large: "Large bag · up to 10kg",
};

export function getPaxiFee(bag: PaxiBag, service: PaxiService): number {
  return PAXI_FEES[service]?.[bag] ?? PAXI_FEES.standard.standard;
}