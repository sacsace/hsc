"use client";

import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { OfficeMaps } from "@/components/OfficeMaps";
import type { SiteContent } from "@/lib/types";

function ContactSections() {
  const { content, t } = useLanguage();
  const { company } = content;

  return (
    <div className="site-shell bg-white">
      <Header variant="solid" />

      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[var(--navy-deep)] pt-28 pb-14 text-white md:pt-32 md:pb-16">
          <div className="container">
            <p className="section-label !text-white/55">{t.contactLabel}</p>
            <h1 className="section-title !mb-3 !text-white">{t.contactTitle}</h1>
            <p className="max-w-xl text-white/70">{t.contactLead}</p>
          </div>
        </section>

        <section className="section bg-white text-[var(--ink)]">
          <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-4 text-sm text-[var(--muted)]">
              <div>
                <p className="text-xs font-semibold tracking-wide text-[var(--steel)]">
                  {t.fields.branchIndia}
                </p>
                <p className="mt-1 leading-relaxed text-[var(--ink)]">{company.branchIndia}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-[var(--steel)]">
                  {t.fields.chennaiOffice}
                </p>
                <p className="mt-1 leading-relaxed text-[var(--ink)]">{company.chennaiOffice}</p>
              </div>
              <p>
                <a
                  className="font-semibold text-[var(--navy)] underline underline-offset-4"
                  href={`mailto:${company.email}`}
                >
                  {company.email}
                </a>
              </p>
              <p className="text-xs text-[var(--muted)]">
                CIN: {company.cin}
                {company.pan ? ` · PAN: ${company.pan}` : ""}
              </p>
            </div>

            <ContactForm />
          </div>

          <div className="container">
            <OfficeMaps
              bangaloreLabel={t.fields.branchIndia}
              bangaloreAddress={company.branchIndia}
              bangaloreMapEmbed={company.branchIndiaMapEmbed}
              chennaiLabel={t.fields.chennaiOffice}
              chennaiAddress={company.chennaiOffice}
              chennaiMapEmbed={company.chennaiMapEmbed}
              openInMapsLabel={t.openInMaps}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function ContactPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: "ko" | "en";
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <ContactSections />
    </LanguageProvider>
  );
}
