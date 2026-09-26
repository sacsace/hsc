"use client";

import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import type { SiteContent } from "@/lib/types";

function splitParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 md:p-5">
      <p className="text-[0.7rem] font-semibold tracking-[0.1em] text-[var(--steel)]">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink)]">{value}</p>
    </div>
  );
}

function AboutSections() {
  const { content, t } = useLanguage();
  const { greeting, company, history, certificates } = content;
  const paragraphs = splitParagraphs(greeting.body);
  const lead = paragraphs[0] || "";
  const body = paragraphs.slice(1);

  return (
    <div className="site-shell bg-white">
      <Header variant="solid" />

      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[var(--navy-deep)] pt-28 pb-14 text-white md:pt-32 md:pb-16">
          <div className="container">
            <p className="section-label !text-white/55">{t.aboutPageLabel}</p>
            <h1 className="section-title !mb-3 !text-white">{t.aboutPageTitle}</h1>
            <p className="max-w-2xl text-white/70">{t.aboutPageLead}</p>
          </div>
        </section>

        <section id="greeting" className="section bg-white">
          <div className="container grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="section-label">{t.aboutLabel}</p>
              <h2 className="section-title">{greeting.title}</h2>
              {lead ? (
                <p className="mt-4 max-w-xl text-justify text-[0.98rem] font-normal leading-relaxed text-[var(--ink)] md:text-[1.02rem]">
                  {lead}
                </p>
              ) : null}
              <div className="mt-5 max-w-xl space-y-3.5 text-justify text-[0.95rem] font-normal leading-relaxed text-[var(--muted)] md:text-[0.98rem]">
                {body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="whitespace-pre-line text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg)]">
              <Image
                src="/images/hero-graphic.png"
                alt={t.heroImageAlt}
                fill
                className="object-cover object-left"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
            </div>
          </div>
        </section>

        <section id="company" className="section bg-[#f5f7f9]">
          <div className="container">
            <p className="section-label">{t.companyLabel}</p>
            <h2 className="section-title">{t.companyTitle}</h2>
            <p className="section-lead">{t.companyLead}</p>

            <div className="mt-8 space-y-4">
              <div className="border border-[var(--line)] bg-white p-4 md:p-5">
                <p className="text-[0.7rem] font-semibold tracking-[0.1em] text-[var(--steel)]">
                  {t.fields.legalName}
                </p>
                <p className="mt-1.5 text-sm font-medium leading-snug text-[var(--ink)] md:text-[0.95rem]">
                  {company.legalName}
                </p>
              </div>

              <div className="grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
                <InfoBlock label={t.fields.founded} value={company.founded} />
                <InfoBlock label={t.fields.employees} value={company.employees} />
                <InfoBlock label={t.fields.businessType} value={company.businessType} />
                <InfoBlock label={t.fields.cin} value={company.cin} />
              </div>

              <div className="border border-[var(--line)] bg-white p-4 md:p-5">
                <p className="text-[0.7rem] font-semibold tracking-[0.1em] text-[var(--steel)]">
                  {t.fields.businessItem}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink)]">{company.businessItem}</p>
              </div>

              <div className="grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
                <InfoBlock label={t.fields.branchIndia} value={company.branchIndia} />
                <InfoBlock label={t.fields.chennaiOffice} value={company.chennaiOffice} />
              </div>

              <div className="border border-[var(--line)] bg-white p-4 md:p-5">
                <p className="text-[0.7rem] font-semibold tracking-[0.1em] text-[var(--steel)]">
                  {t.fields.email}
                </p>
                <a
                  href={`mailto:${company.email}`}
                  className="mt-1.5 inline-block text-sm text-[var(--ink)] underline-offset-4 hover:underline"
                >
                  {company.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="history" className="section bg-white">
          <div className="container">
            <p className="section-label">{t.historyLabel}</p>
            <h2 className="section-title">{t.historyTitle}</h2>
            <p className="section-lead">{t.historyLead}</p>

            <ol className="mt-12 border-l border-[var(--line)] pl-6 md:pl-8">
              {history.map((item) => (
                <li key={`${item.date}-${item.detail}`} className="relative pb-8 last:pb-0">
                  <span className="absolute -left-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--navy)] bg-white md:-left-[2.15rem]" />
                  <p className="font-display text-sm font-semibold tracking-wide text-[var(--steel)]">
                    {item.date}
                  </p>
                  <p className="mt-1 text-[1.02rem] text-[var(--ink)]">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {certificates?.length ? (
          <section id="certificates" className="section bg-[#f5f7f9]">
            <div className="container">
              <p className="section-label">{t.certLabel}</p>
              <h2 className="section-title">{t.certTitle}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
                {certificates.map((cert) => (
                  <figure key={cert.title} className="border border-[var(--line)] bg-white p-3">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-white sm:aspect-[4/3]">
                      <Image
                        src={cert.image}
                        alt={cert.title}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 100vw, 40vw"
                      />
                    </div>
                    <figcaption className="mt-3 text-sm font-medium text-[var(--muted)]">
                      {cert.title}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export function AboutPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: "ko" | "en";
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <AboutSections />
    </LanguageProvider>
  );
}
