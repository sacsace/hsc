"use client";

import Image from "next/image";
import type { SiteContent } from "@/lib/types";
import { sortPerformances } from "@/lib/types";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";

function splitParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--navy)] underline-offset-4 hover:underline"
    >
      {label} →
    </a>
  );
}

function HomeSections() {
  const { content, t } = useLanguage();
  const { hero, greeting, company, history, performances, clients, team, gallery } = content;
  const sortedPerformances = sortPerformances(performances || [], true)
    .filter((row) => row.date?.trim() || row.detail?.trim() || row.client?.trim())
    .slice(0, 4);
  const greetingParts = splitParagraphs(greeting?.body || "");
  const greetingLead = greetingParts[0] || "";
  const greetingPreview = greetingParts[1] || greetingParts[0] || "";
  const galleryPreview = (gallery?.items || []).slice(0, 3);
  const clientItems = clients?.items || [];
  const historyPreview = (history || []).slice(-3).reverse();

  return (
    <div id="top" className="site-shell">
      <Header />

      <main className="flex-1">
        <HeroSlider
          slides={hero.slides || []}
          learnMoreLabel={t.learnMore}
          prevLabel={t.slidePrev}
          nextLabel={t.slideNext}
          fallbackBrand={hero.brand}
        />

        {/* About preview */}
        <section className="section bg-white">
          <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="section-label">{t.aboutPageLabel}</p>
              <h2 className="section-title">{greeting?.title || t.aboutPageTitle}</h2>
              {greetingLead ? (
                <p className="mt-3 max-w-xl text-justify text-[0.98rem] font-normal leading-relaxed text-[var(--ink)]">
                  {greetingLead}
                </p>
              ) : null}
              <p className="mt-4 max-w-2xl text-justify text-[0.95rem] font-normal leading-relaxed text-[var(--muted)] line-clamp-4">
                {greetingPreview}
              </p>
              <SectionLink href="/about" label={t.viewMore} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-[var(--line)] bg-[#f5f7f9] p-4">
                <p className="text-xs font-semibold tracking-wide text-[var(--steel)]">
                  {t.fields.founded}
                </p>
                <p className="mt-1 text-sm text-[var(--ink)]">{company.founded}</p>
              </div>
              <div className="border border-[var(--line)] bg-[#f5f7f9] p-4">
                <p className="text-xs font-semibold tracking-wide text-[var(--steel)]">
                  {t.fields.businessItem}
                </p>
                <p className="mt-1 text-sm text-[var(--ink)] line-clamp-2">{company.businessItem}</p>
              </div>
              {historyPreview.slice(0, 2).map((item) => (
                <div key={`${item.date}-${item.detail}`} className="border border-[var(--line)] p-4">
                  <p className="text-xs font-semibold tracking-wide text-[var(--steel)]">{item.date}</p>
                  <p className="mt-1 text-sm text-[var(--ink)] line-clamp-2">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance preview */}
        <section id="performance" className="section bg-[#f5f7f9]">
          <div className="container">
            <p className="section-label">{t.performanceLabel}</p>
            <h2 className="section-title">{t.performanceTitle}</h2>
            <p className="section-lead">{t.performanceLead}</p>

            <div className="mt-8 overflow-hidden border border-[var(--line)] bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--navy)] text-white">
                  <tr>
                    <th className="px-4 py-3 font-medium md:px-5">{t.table.date}</th>
                    <th className="px-4 py-3 font-medium md:px-5">{t.table.details}</th>
                    <th className="px-4 py-3 font-medium md:px-5">{t.table.client}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPerformances.map((row, i) => (
                    <tr
                      key={row.id || `${row.date}-${row.client}-${i}`}
                      className="border-t border-[var(--line)] align-top"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)] md:px-5">
                        {row.date}
                      </td>
                      <td className="px-4 py-3 text-[var(--ink)] md:px-5">{row.detail}</td>
                      <td className="px-4 py-3 font-medium text-[var(--ink)] md:px-5">{row.client}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex justify-center">
              <a
                href="/performance"
                className="inline-flex items-center justify-center rounded-md border border-[var(--navy)] px-5 py-2.5 text-sm font-medium text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:!text-white"
              >
                {t.viewMorePerformance}
              </a>
            </div>
          </div>
        </section>

        {/* Clients */}
        <section id="clients" className="section bg-white">
          <div className="container">
            <p className="section-label">{t.clientsLabel}</p>
            <h2 className="section-title">{clients?.title || t.clientsTitle}</h2>
            <p className="section-lead">{clients?.lead || t.clientsLead}</p>

            {clientItems.length ? (
              <>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {clientItems.slice(0, 8).map((client) => (
                    <div
                      key={client.id}
                      className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[#f5f7f9] px-4 py-4 text-center"
                    >
                      <div className="relative flex h-10 w-full items-center justify-center">
                        {client.logo ? (
                          <Image
                            src={client.logo}
                            alt={client.name}
                            fill
                            className="object-contain"
                            sizes="200px"
                          />
                        ) : (
                          <div className="h-full w-full rounded-md bg-white" aria-hidden />
                        )}
                      </div>
                      <p className="text-sm font-medium tracking-wide text-[var(--ink)]">
                        {client.name || "—"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <a
                    href="/clients"
                    className="inline-flex items-center justify-center rounded-md border border-[var(--navy)] px-5 py-2.5 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:!text-white"
                  >
                    {t.viewMoreClients}
                  </a>
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm text-[var(--muted)]">{t.clientsLead}</p>
            )}
          </div>
        </section>

        {/* Team preview */}
        <section className="section bg-[#f5f7f9]">
          <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="section-label">{t.teamLabel}</p>
              <h2 className="section-title">{team?.title || t.teamTitle}</h2>
              <p className="section-lead">{team?.lead || t.teamLead}</p>
              <SectionLink href="/team" label={t.viewMore} />
            </div>
            <div className="border border-[var(--line)] bg-white p-6 md:p-8">
              <p className="text-xs font-semibold tracking-[0.12em] text-[var(--steel)]">
                {t.teamCeoLabel}
              </p>
              <p className="mt-2 font-display text-2xl font-bold tracking-tight">
                {team?.ceo?.name || "—"}
              </p>
              {team?.ceo?.role ? (
                <p className="mt-1 text-sm font-medium text-[var(--navy)]">{team.ceo.role}</p>
              ) : null}
              {team?.ceo?.bio ? (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                  {team.ceo.bio}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Gallery preview */}
        <section className="section bg-white">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-label">{t.galleryLabel}</p>
                <h2 className="section-title !mb-2">{gallery?.title || t.galleryTitle}</h2>
                <p className="section-lead !mb-0">{gallery?.lead || t.galleryLead}</p>
              </div>
              <a
                href="/gallery"
                className="text-sm font-semibold text-[var(--navy)] underline-offset-4 hover:underline"
              >
                {t.viewMore} →
              </a>
            </div>

            {galleryPreview.length ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {galleryPreview.map((item) => (
                  <a
                    key={item.id}
                    href="/gallery"
                    className="group relative aspect-[4/3] overflow-hidden bg-[#f5f7f9]"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 pt-10">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="section bg-[var(--navy-deep)] text-white">
          <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="section-label !text-white/55">{t.contactLabel}</p>
              <h2 className="section-title !mb-2 !text-white">{t.contactTitle}</h2>
              <p className="max-w-xl text-white/70">{t.contactLead}</p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold !text-[var(--navy)] transition-colors hover:bg-white/90"
            >
              {t.contactCta}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function HomePage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: "ko" | "en";
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <HomeSections />
    </LanguageProvider>
  );
}
