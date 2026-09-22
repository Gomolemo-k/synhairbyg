"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { translator } from "@/lib/i18n";

type UnsubState = "unsubscribing" | "done" | "error";

function UnsubscribeContent() {
  const t = translator("newsletter");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, setState] = useState<UnsubState>(
    token ? "unsubscribing" : "error",
  );
  const [error, setError] = useState(
    token ? "" : t("noLink"),
  );

  useEffect(() => {
    if (!token) return;
    let stop = false;
    fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (stop) return;
        setState(res.ok && data.ok ? "done" : "error");
        if (!res.ok || !data.ok) {
          setError(data.error ?? t("errorFallback"));
        }
      })
      .catch(() => {
        if (!stop) {
          setState("error");
          setError(t("errorFallback"));
        }
      });
    return () => {
      stop = true;
    };
  }, [token, t]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      {state === "unsubscribing" && (
        <>
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blush" />
          <p className="mt-4 text-sm text-charcoal/60">{t("unsubscribing")}</p>
        </>
      )}

      {state === "done" && (
        <>
          <p className="font-display text-4xl text-plum">{t("unsubTitle")}</p>
          <p className="mt-3 text-sm text-charcoal/60">{t("unsubBody")}</p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-plum px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
          >
            {t("backToShopping")}
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <p className="font-display text-4xl text-plum">{t("linkInvalid")}</p>
          <p className="mt-3 text-sm text-charcoal/60">{error}</p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-plum px-10 py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
          >
            {t("backToShopping")}
          </Link>
        </>
      )}
    </div>
  );
}

export default function NewsletterUnsubscribePage() {
  const tc = translator("common");
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blush" />
          <p className="mt-4 text-charcoal/60">{tc("loading")}</p>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}