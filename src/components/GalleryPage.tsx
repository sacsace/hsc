"use client";

import { Footer } from "@/components/Footer";
import { GallerySection } from "@/components/GallerySection";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import type { SiteContent } from "@/lib/types";

function GallerySections() {
  const { content, t } = useLanguage();
  const { gallery } = content;

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

        <GallerySection
          items={gallery?.items || []}
          closeLabel={t.galleryClose}
          showIntro={false}
        />
      </main>

      <Footer />
    </div>
  );
}

export function GalleryPage({ content }: { content: SiteContent }) {
  return (
    <LanguageProvider siteContent={content}>
      <GallerySections />
    </LanguageProvider>
  );
}
