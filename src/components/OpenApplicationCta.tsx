"use client";

import { useState } from "react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { useLanguage } from "@/components/LanguageProvider";

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

export function OpenApplicationCta() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <section className="section bg-white pt-0">
      <div className="container">
        <div className="bg-[var(--navy-deep)] px-6 py-8 text-white md:px-8 md:py-10">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#7eb8c2]">
            <MailIcon className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
            {t.openApplyTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed break-keep text-pretty text-white/70 md:text-[0.95rem]">
            {t.openApplyLead}
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#3b82f6] px-4 py-3.5 text-sm font-semibold tracking-[0.06em] !text-white transition-colors hover:bg-[#2563eb]"
          >
            <SendIcon className="h-4 w-4" />
            {t.openApplyCta}
          </button>
        </div>
      </div>

      <ApplicationModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
