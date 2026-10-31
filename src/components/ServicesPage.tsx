"use client";

import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { defaultServicesContent } from "@/lib/services-default";
import type { Locale, SiteContent } from "@/lib/types";

function ServicesSections() {
  const { locale, content } = useLanguage();
  const copy = content.services || defaultServicesContent(locale);

  return (
    <div className="site-shell bg-white">
      <Header variant="solid" />

      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[var(--navy-deep)] pt-28 pb-14 text-white md:pt-32 md:pb-16">
          <div className="container">
            <p className="section-label !text-white/55">{copy.label}</p>
            <h1 className="section-title !mb-3 !text-white">{copy.title}</h1>
            <p className="max-w-3xl text-pretty leading-relaxed text-white/70">{copy.lead}</p>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <p className="section-label">{copy.offeringsLabel}</p>
            <h2 className="section-title">{copy.offeringsTitle}</h2>
            <p className="section-lead">{copy.offeringsLead}</p>

            <div className="mt-8 grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
              {copy.offerings.map((item) => (
                <div key={item.id} className="bg-white p-5 md:p-6">
                  <h3 className="text-[0.95rem] font-semibold tracking-wide text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-[#f5f7f9]">
          <div className="container">
            <p className="section-label">{copy.equipmentLabel}</p>
            <h2 className="section-title">{copy.equipmentTitle}</h2>
            <p className="section-lead">{copy.equipmentLead}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {copy.brands.map((brand) => {
                const cover = brand.products[0]?.image;
                return (
                  <a
                    key={brand.id || brand.slug}
                    href={`/services/${brand.slug}`}
                    className="group flex flex-col overflow-hidden border border-[var(--line)] bg-white transition-colors hover:border-[var(--steel)]"
                  >
                    <div className="relative aspect-[4/3] bg-[#eef1f4]">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={brand.brand}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-4 md:p-5">
                      <h3 className="text-[0.98rem] font-semibold tracking-wide text-[var(--ink)]">
                        {brand.brand}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                        {brand.lead}
                      </p>
                      <span className="mt-4 text-xs font-semibold tracking-[0.08em] text-[var(--steel)]">
                        {copy.viewDocs} →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="mt-10 space-y-4">
              {copy.categories.map((category) => (
                <article
                  key={category.id}
                  id={category.id}
                  className="border border-[var(--line)] bg-white p-5 md:p-6"
                >
                  <h3 className="text-[1.02rem] font-semibold tracking-wide text-[var(--ink)]">
                    {category.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                    {category.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <li key={`${category.id}-${item.slug}-${item.label}`}>
                        <a
                          href={`/services/${item.slug}`}
                          className="inline-flex items-center border border-[var(--line)] bg-[#f8fafb] px-3 py-1.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--steel)] hover:bg-white"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--line)] bg-[var(--navy-deep)] py-14 text-white md:py-16">
          <div className="container flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold tracking-wide md:text-2xl">{copy.ctaTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-[0.95rem]">
                {copy.ctaLead}
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex w-fit items-center justify-center border border-white/30 bg-white px-5 py-2.5 text-sm font-semibold tracking-wide !text-[var(--navy)] transition-colors hover:bg-white/90"
            >
              {copy.ctaButton}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function ServicesPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale: Locale;
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <ServicesSections />
    </LanguageProvider>
  );
}
