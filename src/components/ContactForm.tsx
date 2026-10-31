"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const shellClass =
  "space-y-4 rounded-[1.1rem] border border-[var(--line)] bg-white p-5 shadow-[0_8px_30px_rgba(11,58,110,0.06)] md:p-6";

const fieldClass =
  "mt-1.5 w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--navy)]";

export function ContactForm() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Password-manager extensions (e.g. Shark) inject nodes into inputs before
  // React hydrates, which causes a mismatch. Render the real form after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className={shellClass} aria-hidden>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 w-16 rounded bg-[var(--line)]/60" />
              <div className="h-11 rounded border border-[var(--line)] bg-[var(--bg)]" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-20 rounded bg-[var(--line)]/60" />
          <div className="h-32 rounded border border-[var(--line)] bg-[var(--bg)]" />
        </div>
        <div className="h-10 w-28 rounded-md bg-[var(--line)]/60" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={shellClass}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-[var(--ink)]">
          {t.contactForm.name} *
          <input
            required
            name="name"
            autoComplete="name"
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
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder={t.contactForm.emailPlaceholder}
          />
        </label>
        <label className="block text-sm text-[var(--ink)]">
          {t.contactForm.phone}
          <input
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            placeholder={t.contactForm.phonePlaceholder}
          />
        </label>
        <label className="block text-sm text-[var(--ink)]">
          {t.contactForm.company}
          <input
            name="company"
            autoComplete="organization"
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
          name="message"
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
