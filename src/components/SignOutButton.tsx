"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { translator } from "@/lib/i18n";

export default function SignOutButton({ className }: { className?: string }) {
  const t = translator("signOut");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button
      onClick={signOut}
      disabled={busy}
      className={
        className ??
        "rounded-full border border-plum/30 px-6 py-2.5 text-sm font-semibold text-plum transition hover:bg-blush"
      }
    >
      {busy ? t("signingOut") : t("signOut")}
    </button>
  );
}