"use client";

import { useState, type FormEvent } from "react";
import { translator } from "@/lib/i18n";

export default function ContactForm() {
  const t = translator("contactForm");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      t("subject", {
        prefix: form.topic ? `${form.topic} — ` : "",
        name: form.name,
      }),
    );
    const body = encodeURIComponent(
      t("body", {
        message: form.message,
        name: form.name,
        email: form.email,
      }),
    );
    window.location.assign(
      `mailto:synhairbyg@gmail.com?subject=${subject}&body=${body}`,
    );
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-blush bg-blush/40 p-10 text-center">
        <p className="font-display text-2xl text-plum">{t("draftTitle")}</p>
        <p className="mt-2 text-sm text-charcoal/60">
          {t("draftBodyPre")}
          <span className="font-semibold text-plum">{t("draftPhone")}</span>
          {t("draftBodyPost")}
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum";
  const labelClasses =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/60";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-blush bg-warmwhite p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClasses}>{t("yourName")}</span>
          <input
            required
            className={inputClasses}
            placeholder={t("namePlaceholder")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className={labelClasses}>{t("email")}</span>
          <input
            required
            type="email"
            className={inputClasses}
            placeholder={t("emailPlaceholder")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className={labelClasses}>{t("topic")}</span>
        <select
          className={inputClasses}
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
        >
          <option value="">{t("topicPlaceholder")}</option>
          <option>{t("topicOrder")}</option>
          <option>{t("topicStock")}</option>
          <option>{t("topicWholesale")}</option>
          <option>{t("topicReturns")}</option>
          <option>{t("topicOther")}</option>
        </select>
      </label>

      <label className="mt-4 block">
        <span className={labelClasses}>{t("message")}</span>
        <textarea
          required
          rows={5}
          className={inputClasses}
          placeholder={t("messagePlaceholder")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </label>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-plum py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
      >
        {t("send")}
      </button>
      <p className="mt-3 text-center text-xs text-charcoal/45">{t("mailtoHint")}</p>
    </form>
  );
}