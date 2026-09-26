"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export function ContactForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    setDone(false);

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, company, message }),
    });

    setSending(false);

    if (!res.ok) {
      setError(t.contactForm.error);
      return;
    }

    setDone(true);
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setMessage("");
  }

  const fieldClass =
    "mt-1.5 w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--navy)]";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-[1.1rem] border border-[var(--line)] bg-white p-5 shadow-[0_8px_30px_rgba(11,58,110,0.06)] md:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-[var(--ink)]">
          {t.contactForm.name} *
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder={t.contactForm.namePlaceholder}
          />
        </label>
        <label className="block text-sm text-[var(--ink)]">
          {t.contactForm.email} *
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder={t.contactForm.emailPlaceholder}
          />
        </label>
        <label className="block text-sm text-[var(--ink)]">
          {t.contactForm.phone}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            placeholder={t.contactForm.phonePlaceholder}
          />
        </label>
        <label className="block text-sm text-[var(--ink)]">
          {t.contactForm.company}
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={fieldClass}
            placeholder={t.contactForm.companyPlaceholder}
          />
        </label>
      </div>

      <label className="block text-sm text-[var(--ink)]">
        {t.contactForm.message} *
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldClass} resize-y`}
          placeholder={t.contactForm.messagePlaceholder}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {done && <p className="text-sm text-emerald-700">{t.contactForm.success}</p>}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center justify-center rounded-md bg-[var(--navy)] px-5 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-[var(--navy-deep)] disabled:opacity-60"
      >
        {sending ? t.contactForm.sending : t.contactForm.submit}
      </button>
    </form>
  );
}
