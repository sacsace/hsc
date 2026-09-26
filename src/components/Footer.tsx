"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { SiteLogo } from "@/components/SiteLogo";

export function Footer() {
  const { content, t } = useLanguage();

  return (
    <footer className="bg-[var(--footer)] text-white">
      <div className="container py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SiteLogo tone="light" className="!h-8 md:!h-9" />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">{t.footerTagline}</p>
          </div>
          <div className="text-sm text-white/65 md:text-right">
            <p>Bangalore, Karnataka, India</p>
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
    </footer>
  );
}
