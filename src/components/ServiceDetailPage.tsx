"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { productPageUi } from "@/lib/products";
import type { Locale, ServiceBrandItem, SiteContent } from "@/lib/types";

function ServiceDetailSections({ brand }: { brand: ServiceBrandItem }) {
  const { locale } = useLanguage();
  const ui = productPageUi[locale];
  const [active, setActive] = useState<number | null>(null);
  const products = brand.products.filter((item) => Boolean(item.image));
  const current = active !== null ? brand.products[active] : null;

  useEffect(() => {
    setActive(null);
  }, [brand.id, brand.slug]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") {
        setActive((i) => {
          if (i === null) return i;
          const next = brand.products.findIndex(
            (item, idx) => idx > i && item.image,
          );
          if (next >= 0) return next;
          return brand.products.findIndex((item) => item.image);
        });
      }
      if (e.key === "ArrowLeft") {
        setActive((i) => {
          if (i === null) return i;
          for (let idx = i - 1; idx >= 0; idx -= 1) {
            if (brand.products[idx]?.image) return idx;
          }
          for (let idx = brand.products.length - 1; idx >= 0; idx -= 1) {
            if (brand.products[idx]?.image) return idx;
          }
          return i;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, brand.products]);

  function openAt(index: number) {
    if (!brand.products[index]?.image) return;
    setActive(index);
  }

  function move(direction: -1 | 1) {
    setActive((i) => {
      if (i === null) return i;
      const withImages = brand.products
        .map((item, idx) => ({ item, idx }))
        .filter((row) => row.item.image);
      if (!withImages.length) return i;
      const currentPos = withImages.findIndex((row) => row.idx === i);
      const nextPos =
        (currentPos + direction + withImages.length) % withImages.length;
      return withImages[nextPos].idx;
    });
  }

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
                {brand.products.map((product, index) => (
                  <article
                    key={product.id}
                    id={product.id}
                    className="grid gap-5 border border-[var(--line)] bg-white p-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-8 md:p-6"
                  >
                    {product.image ? (
                      <button
                        type="button"
                        onClick={() => openAt(index)}
                        className="relative aspect-[4/3] overflow-hidden bg-[#eef1f4] text-left transition hover:ring-2 hover:ring-[var(--navy)]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] md:aspect-[5/4]"
                        aria-label={`${ui.enlarge}: ${product.title}`}
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain object-top p-2"
                          sizes="(max-width: 768px) 100vw, 45vw"
                        />
                      </button>
                    ) : (
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#eef1f4] md:aspect-[5/4]" />
                    )}
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

      {current?.image && active !== null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={() => setActive(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
              <div className="relative mx-auto aspect-[3/4] max-h-[78vh] w-full sm:aspect-[4/3]">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3 text-white">
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold sm:text-lg">
                  {current.title}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {products.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="border border-white/30 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
                      onClick={() => move(-1)}
                    >
                      {ui.prev}
                    </button>
                    <button
                      type="button"
                      className="border border-white/30 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
                      onClick={() => move(1)}
                    >
                      {ui.next}
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  className="border border-white/30 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
                  onClick={() => setActive(null)}
                >
                  {ui.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
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
