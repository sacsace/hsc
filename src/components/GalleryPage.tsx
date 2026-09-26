"use client";

import { useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { GallerySection, type GalleryViewMode } from "@/components/GallerySection";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import type { SiteContent } from "@/lib/types";

function GallerySections() {
  const { content, t } = useLanguage();
  const { gallery } = content;
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<GalleryViewMode>("card");
  const allItems = gallery?.items || [];

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((item) => {
      const haystack = `${item.title} ${item.caption}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allItems, query]);

  return (
    <div className="site-shell bg-white">
      <Header variant="solid" />

      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[var(--navy-deep)] pt-28 pb-14 text-white md:pt-32 md:pb-16">
          <div className="container">
            <p className="section-label !text-white/55">{t.galleryLabel}</p>
            <h1 className="section-title !mb-3 !text-white">
              {gallery?.title || t.galleryTitle}
            </h1>
            <p className="max-w-xl text-white/70">{gallery?.lead || t.galleryLead}</p>
          </div>
        </section>

        <section className="border-b border-[var(--line)] bg-white py-5">
          <div className="container">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-[var(--muted)]">
                {query.trim()
                  ? t.galleryResultCount(items.length, allItems.length)
                  : t.galleryTotalCount(allItems.length)}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <ViewModeToggle
                  value={viewMode}
                  onChange={setViewMode}
                  listLabel={t.galleryViewList}
                  cardLabel={t.galleryViewCard}
                />

                <label className="block w-full max-w-md">
                  <span className="sr-only">{t.gallerySearch}</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.gallerySearchPlaceholder}
                    className="w-full border border-[var(--line)] bg-[#f8fafb] px-3 py-2.5 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {allItems.length === 0 ? (
          <section className="section bg-white">
            <div className="container">
              <p className="text-[var(--muted)]">{t.galleryLead}</p>
            </div>
          </section>
        ) : items.length === 0 ? (
          <section className="section bg-white">
            <div className="container">
              <p className="text-[var(--muted)]">{t.galleryNoResults}</p>
            </div>
          </section>
        ) : (
          <GallerySection
            items={items}
            closeLabel={t.galleryClose}
            showIntro={false}
            viewMode={viewMode}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export function GalleryPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: "ko" | "en";
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <GallerySections />
    </LanguageProvider>
  );
}
