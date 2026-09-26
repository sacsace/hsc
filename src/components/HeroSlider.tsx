"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/types";

const AUTO_MS = 7000;

export function HeroSlider({
  slides,
  learnMoreLabel,
  prevLabel,
  nextLabel,
  fallbackBrand,
}: {
  slides: HeroSlide[];
  learnMoreLabel: string;
  prevLabel: string;
  nextLabel: string;
  fallbackBrand: string;
}) {
  const list = slides.length
    ? slides
    : [
        {
          id: "fallback",
          type: "image" as const,
          src: "/images/banner-blue.png",
          label: fallbackBrand,
          brand: fallbackBrand,
          headline: "Total Air Solution",
          subheadline: "",
          ctaLabel: "Contact",
          ctaHref: "/contact",
        },
      ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const active = list[index];

  const go = useCallback(
    (next: number) => {
      setIndex(((next % list.length) + list.length) % list.length);
    },
    [list.length],
  );

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, el]) => {
      if (!el) return;
      if (id === active.id && active.type === "video") {
        el.currentTime = 0;
        void el.play().catch(() => undefined);
      } else {
        el.pause();
      }
    });
  }, [active]);

  useEffect(() => {
    if (paused || list.length < 2) return;
    const timer = window.setTimeout(() => go(index + 1), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, go, list.length]);

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-[var(--navy-deep)] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {list.map((slide, i) => {
        const visible = i === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!visible}
          >
            {slide.type === "video" ? (
              <video
                ref={(el) => {
                  videoRefs.current[slide.id] = el;
                }}
                className="absolute inset-0 h-full w-full object-cover"
                src={slide.src}
                muted
                playsInline
                loop
                preload="metadata"
              />
            ) : (
              <Image
                src={slide.src}
                alt={slide.label || slide.brand}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            )}
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-deep)]/45 via-[var(--navy-deep)]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

      <div className="container relative z-10 flex min-h-[100svh] items-end justify-start pb-28 pt-28 md:pb-32">
        <div
          key={active.id}
          className="relative mb-[20vh] max-w-xl overflow-hidden rounded-[1.25rem] md:max-w-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,40,77,0.52)] via-[rgba(7,40,77,0.32)] to-transparent backdrop-blur-[8px]" />
          <div className="relative px-6 py-6 md:px-8 md:py-7">
            <p className="reveal section-label !mb-2 !text-white/65">{active.brand}</p>
            <h1 className="reveal reveal-delay-1 font-display text-[clamp(2.1rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em]">
              {active.headline}
            </h1>
            <p className="reveal reveal-delay-2 mt-4 max-w-lg text-[0.98rem] leading-relaxed text-white/82 md:text-[1.05rem]">
              {active.subheadline}
            </p>
            <div className="reveal reveal-delay-3 mt-7 flex flex-wrap gap-3">
              <a
                href={active.ctaHref || "/contact"}
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold !text-[var(--navy)] transition-colors hover:bg-white/90"
              >
                {active.ctaLabel}
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10"
              >
                {learnMoreLabel}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-20">
        <div className="container flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">
              {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-white/85">{active.label}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              {list.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={slide.label}
                  onClick={() => go(i)}
                  className={`h-1.5 transition-all ${
                    i === index ? "w-8 bg-white" : "w-3 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={prevLabel}
                onClick={() => go(index - 1)}
                className="flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label={nextLabel}
                onClick={() => go(index + 1)}
                className="flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
