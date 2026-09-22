"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_STATUS_CHOICES } from "@/lib/tracking";
import type { OrderStatus } from "@/lib/orders";
import { translator } from "@/lib/i18n";

export default function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const t = translator("statusControl");
  const tt = translator("tracking");
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(
    ADMIN_STATUS_CHOICES.some((c) => c.value === currentStatus)
      ? currentStatus
      : "paid",
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const update = async () => {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: value }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error ?? t("error"));
      } else {
        setMessage(t("saved"));
        router.refresh();
      }
    } catch {
      setMessage(t("error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as OrderStatus)}
        className="rounded-lg border border-plum/25 bg-white px-2.5 py-1.5 text-xs font-semibold text-charcoal outline-none focus:border-plum"
      >
        {ADMIN_STATUS_CHOICES.map((c) => (
          <option key={c.value} value={c.value}>
            {tt(c.labelKey)}
          </option>
        ))}
      </select>
      <button
        onClick={update}
        disabled={busy}
        className="rounded-lg bg-plum px-3 py-1.5 text-xs font-semibold text-warmwhite transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "…" : t("save")}
      </button>
      {message && <span className="text-xs font-semibold text-plum">{message}</span>}
    </div>
  );
}