"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/types";

export type GalleryViewMode = "card" | "list";

export function GallerySection({
  label,
  title,
  lead,
  items,
  closeLabel,
  showIntro = true,
  viewMode = "card",
}: {
  label?: string;
  title?: string;
  lead?: string;
  items: GalleryItem[];
  closeLabel: string;
  showIntro?: boolean;
  viewMode?: GalleryViewMode;
}) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    setActive(null);
  }, [items, viewMode]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft")
        setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, items.length]);

  if (!items.length) return null;

  const current = active !== null ? items[active] : null;

  return (
    <section id={showIntro ? "gallery" : undefined} className="section bg-white">
      <div className="container">
        {showIntro ? (
          <>
            {label ? <p className="section-label">{label}</p> : null}
            {title ? <h2 className="section-title">{title}</h2> : null}
            {lead ? <p className="section-lead">{lead}</p> : null}
          </>
        ) : null}

        {viewMode === "list" ? (
          <div className={`divide-y divide-[var(--line)] border border-[var(--line)] ${showIntro ? "mt-10" : ""}`}>
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className="flex w-full items-center gap-4 bg-white px-3 py-3 text-left transition-colors hover:bg-[#f8fafb] sm:gap-5 sm:px-4"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-[var(--bg)] sm:h-20 sm:w-28">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--ink)] sm:text-base">
                    {item.title}
                  </p>
                  {item.caption ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)] sm:text-sm">
                      {item.caption}
                    </p>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${showIntro ? "mt-10" : ""}`}>
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className="group relative aspect-[4/3] overflow-hidden bg-[var(--bg)] text-left"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 pt-10">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  {item.caption ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/75">{item.caption}</p>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {current && active !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
              <Image
                src={current.image}
                alt={current.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="mt-3 flex items-start justify-between gap-4 text-white">
              <div>
                <p className="font-display text-lg font-semibold">{current.title}</p>
                {current.caption ? (
                  <p className="mt-1 text-sm text-white/70">{current.caption}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="shrink-0 border border-white/30 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
                onClick={() => setActive(null)}
              >
                {closeLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
