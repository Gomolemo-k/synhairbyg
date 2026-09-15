export function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatZARCents(amount: number) {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}