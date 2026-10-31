"use client";

import { useState } from "react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteLogo } from "@/components/SiteLogo";

const MVS_URL = process.env.NEXT_PUBLIC_MVS_URL || "https://www.mvsystem.in";

const footerPrimaryBtnClass =
  "inline-flex items-center justify-center rounded-md border border-white bg-white px-4 py-2 text-sm font-semibold !text-black transition-colors hover:bg-white/90";

const footerSecondaryBtnClass =
  "inline-flex items-center justify-center rounded-md border border-white/45 bg-transparent px-4 py-2 text-sm font-semibold !text-white transition-colors hover:border-white hover:bg-white/10";

export function Footer() {
  const { content, t } = useLanguage();
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <footer className="bg-[var(--footer)] text-white">
      <div className="container py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 flex-1">
            <SiteLogo tone="light" className="!h-8 md:!h-9" />
            <p className="mt-3 max-w-xl text-sm leading-relaxed break-keep text-pretty text-white/65">
              {t.footerTagline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <a href="/contact" className={footerPrimaryBtnClass}>
                {t.contactCta}
              </a>
              <button type="button" onClick={() => setApplyOpen(true)} className={footerPrimaryBtnClass}>
                {t.openApplyCta}
              </button>
              <a href="/admin" className={footerSecondaryBtnClass}>
                {t.footerAdmin}
              </a>
              <a
                href={MVS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={footerSecondaryBtnClass}
              >
                {t.footerMvs}
              </a>
            </div>
          </div>
          <div className="text-sm text-white/65 md:text-right">
            <p>Bengaluru, Karnataka, India</p>
            <p className="mt-1">Chennai, Tamil Nadu, India</p>
            <p className="mt-1">
              <a href={`mailto:${content.company.email}`} className="hover:text-white">
                {content.company.email}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Hankook Service Center Pvt. Ltd. {t.footerRights}
          </p>
          <p>
            {t.developedBy}{" "}
            <a
              href="https://www.msventures.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
            >
              Minsub Ventures
            </a>
          </p>
        </div>
      </div>

      <ApplicationModal open={applyOpen} onClose={() => setApplyOpen(false)} />
    </footer>
  );
}
