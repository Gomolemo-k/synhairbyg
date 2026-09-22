"use client";

import {
  ORDER_STEPS,
  STATUS_LABELS,
  STEP_DESCRIPTIONS,
  stepIndex,
} from "@/lib/tracking";
import type { OrderStatus } from "@/lib/orders";
import { translator } from "@/lib/i18n";

export default function OrderStatusTimeline({
  status,
}: {
  status: OrderStatus;
}) {
  const t = translator("tracking");
  const current = stepIndex(status);
  const complete = status === "complete";

  return (
    <ol className="space-y-0">
      {ORDER_STEPS.map((step, i) => {
        const done = complete || (current >= 0 && i < current);
        const now = current === i;
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {i < ORDER_STEPS.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-[15px] top-8 h-full w-0.5 ${
                  done ? "bg-plum" : "bg-blush"
                }`}
              />
            )}
            <span
              className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                done
                  ? "bg-plum text-warmwhite"
                  : now
                    ? "bg-rose text-warmwhite ring-4 ring-rose/20"
                    : "border-2 border-blush bg-warmwhite text-charcoal/40"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <div className="pt-1">
              <p
                className={`text-sm font-semibold ${
                  done || now ? "text-plum" : "text-charcoal/45"
                }`}
              >
                {t(STATUS_LABELS[step])}
                {now && (
                  <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                    {t("current")}
                  </span>
                )}
              </p>
              <p className="mt-0.5 max-w-md text-xs text-charcoal/55">
                {t(STEP_DESCRIPTIONS[step])}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}