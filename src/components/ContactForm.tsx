"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `${form.topic ? form.topic + " — " : ""}Enquiry from ${form.name}`,
    );
    const body = encodeURIComponent(
      `Hi SynHairbyG,\n\n${form.message}\n\nFrom ${form.name} (${form.email})`,
    );
    window.location.href = `mailto:hello@synhairbyg.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-blush bg-blush/40 p-10 text-center">
        <p className="font-display text-2xl text-plum">Your email draft is ready</p>
        <p className="mt-2 text-sm text-charcoal/60">
          We replied to this address once, but now it&apos;s your turn — just hit
          send in your mail app. Prefer WhatsApp? Message{" "}
          <span className="font-semibold text-plum">+27 82 000 0000</span> and
          we&apos;ll answer fast.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-xl border border-plum/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-blush bg-warmwhite p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Your name
          </span>
          <input
            required
            className={inputClasses}
            placeholder="Nomvula"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Email
          </span>
          <input
            required
            type="email"
            className={inputClasses}
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          What&apos;s it about
        </span>
        <select
          className={inputClasses}
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
        >
          <option value="">Choose a topic</option>
          <option>Order enquiry</option>
          <option>Stock & restocks</option>
          <option>Wholesale / partnership</option>
          <option>Returns & support</option>
          <option>Something else</option>
        </select>
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Message
        </span>
        <textarea
          required
          rows={5}
          className={inputClasses}
          placeholder="Tell us what you need — we usually reply within 24 hours."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </label>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-plum py-4 text-sm font-semibold text-warmwhite transition hover:bg-rose"
      >
        Send Enquiry
      </button>
      <p className="mt-3 text-center text-xs text-charcoal/45">
        This opens a ready-to-send email from your mail app.
      </p>
    </form>
  );
}