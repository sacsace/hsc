"use client";

import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { productPageUi } from "@/lib/products";
import type { Locale, ServiceBrandItem, SiteContent } from "@/lib/types";

function ServiceDetailSections({ brand }: { brand: ServiceBrandItem }) {
  const { locale } = useLanguage();
  const ui = productPageUi[locale];

  return (
    <div className="site-shell bg-white">
      <Header variant="solid" />

      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[var(--navy-deep)] pt-28 pb-14 text-white md:pt-32 md:pb-16">
          <div className="container">
            <a
              href="/services"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              ← {ui.back}
            </a>
            {brand.folder ? (
              <p className="section-label mt-5 !text-white/55">{brand.folder}</p>
            ) : null}
            <h1 className="section-title !mb-3 !text-white">{brand.brand}</h1>
            <p className="max-w-3xl text-pretty leading-relaxed text-white/70">{brand.lead}</p>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <p className="section-label">{ui.docsLabel}</p>
            <h2 className="section-title">{ui.docsLabel}</h2>
            <p className="section-lead">{ui.docsLead}</p>

            {brand.products.length === 0 ? (
              <p className="mt-8 text-sm text-[var(--muted)]">{ui.empty}</p>
            ) : (
              <div className="mt-8 space-y-8">
                {brand.products.map((product) => (
                  <article
                    key={product.id}
                    id={product.id}
                    className="grid gap-5 border border-[var(--line)] bg-white p-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-8 md:p-6"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#eef1f4] md:aspect-[5/4]">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain object-top p-2"
                          sizes="(max-width: 768px) 100vw, 45vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-[1.05rem] font-semibold tracking-wide text-[var(--ink)]">
                        {product.title}
                      </h3>
                      {product.description ? (
                        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">
                          {product.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-12 border border-[var(--line)] bg-[#f5f7f9] p-5 md:flex md:items-center md:justify-between md:p-6">
              <p className="text-sm text-[var(--ink)]">{ui.contact}</p>
              <a
                href="/contact"
                className="mt-3 inline-flex border border-[var(--navy)] bg-[var(--navy)] px-4 py-2 text-sm font-semibold tracking-wide !text-white md:mt-0"
              >
                {ui.contact}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function ServiceDetailPage({
  content,
  initialLocale,
  brand,
}: {
  content: SiteContent;
  initialLocale: Locale;
  brand: ServiceBrandItem;
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <ServiceDetailSections brand={brand} />
    </LanguageProvider>
  );
}
