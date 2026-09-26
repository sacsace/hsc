"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteLogo } from "@/components/SiteLogo";

export function Header({ variant = "overlay" }: { variant?: "overlay" | "solid" }) {
  const { locale, setLocale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(variant === "solid");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/about", label: t.nav.about },
    { href: "/performance", label: t.nav.performance },
    { href: "/clients", label: t.nav.clients },
    { href: "/team", label: t.nav.team },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    if (variant === "solid") {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const solid = scrolled || open || variant === "solid";
  const textTone = solid ? "bg-[var(--ink)]" : "bg-white";
  const mutedTone = solid
    ? "text-[var(--muted)] hover:text-[var(--ink)]"
    : "text-white/70 hover:text-white";
  const activeTone = solid ? "text-[var(--ink)]" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300 ${
        solid
          ? "bg-white/95 text-[var(--ink)] shadow-[0_1px_0_var(--line)] backdrop-blur-md"
          : "border-b border-white/10 bg-[var(--navy-deep)]/45 text-white shadow-[0_8px_28px_rgba(0,0,0,0.18)] backdrop-blur-md"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <a href="/" className="inline-flex shrink-0 items-center" aria-label="Hankook Service Center">
          <SiteLogo tone={solid ? "color" : "light"} priority />
        </a>

        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium opacity-85 transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className="flex items-center gap-1 text-xs font-semibold tracking-wide"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLocale("ko")}
              className={`px-1.5 py-1 transition-colors ${locale === "ko" ? activeTone : mutedTone}`}
              aria-pressed={locale === "ko"}
            >
              KO
            </button>
            <span className={mutedTone}>/</span>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`px-1.5 py-1 transition-colors ${locale === "en" ? activeTone : mutedTone}`}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label={t.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{t.menu}</span>
            <div className="flex w-5 flex-col gap-1.5">
              <span className={`h-px w-full ${textTone}`} />
              <span className={`h-px w-full ${textTone}`} />
              <span className={`h-px w-full ${textTone}`} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--line)] bg-white text-[var(--ink)] lg:hidden">
          <nav className="container flex flex-col py-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-3 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
