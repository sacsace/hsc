"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ApplicationModal } from "@/components/ApplicationModal";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteLogo } from "@/components/SiteLogo";

function ApplyIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M12 18v-6" />
      <path d="m9 15 3-3 3 3" />
    </svg>
  );
}

export function Header({ variant = "overlay" }: { variant?: "overlay" | "solid" }) {
  const { locale, setLocale, t } = useLanguage();
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(variant === "solid");
  const [open, setOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/performance", label: t.nav.performance },
    { href: "/clients", label: t.nav.clients },
    { href: "/team", label: t.nav.team },
    { href: "/gallery", label: t.nav.gallery },
  ];

  const nextLocale = locale === "ko" ? "en" : "ko";

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

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
  const textTone = "bg-[var(--ink)]";

  function openApply() {
    setOpen(false);
    setApplyOpen(true);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-[var(--ink)] backdrop-blur-md transition-[background-color,box-shadow] duration-300 ${
        solid
          ? "bg-white/95 shadow-[0_1px_0_var(--line)]"
          : "border-b border-[var(--line)]/70 bg-white/92 shadow-[0_8px_28px_rgba(0,0,0,0.05)]"
      }`}
    >
      <div className="container flex h-[3.465rem] items-center justify-between gap-3 md:h-[3.71rem] md:gap-4">
        <a href="/" className="inline-flex shrink-0 items-center" aria-label="Hankook Service Center">
          <SiteLogo tone="color" priority />
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5 sm:gap-3 md:gap-4">
          <nav className="hidden h-full items-stretch gap-5 lg:flex xl:gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center border-b-2 text-[0.866rem] font-medium transition-colors ${
                    active
                      ? "border-[var(--navy)] text-[var(--navy)]"
                      : "border-transparent text-[var(--navy)]/80 hover:text-[var(--navy)]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setLocale(nextLocale)}
            aria-label={nextLocale === "en" ? "Switch to English" : "한국어로 변경"}
            className="inline-flex h-[2.2rem] w-[2.2rem] shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[0.69rem] font-semibold tracking-wide text-[var(--navy)] transition-colors hover:border-[var(--navy)]"
          >
            {nextLocale.toUpperCase()}
          </button>

          <a
            href="/contact"
            className={`hidden items-center gap-1.5 rounded-full px-4 py-[0.45rem] text-[0.866rem] font-semibold tracking-wide transition-colors sm:inline-flex ${
              isActive("/contact")
                ? "bg-[var(--navy-deep)] !text-white"
                : "bg-[var(--navy)] !text-white hover:bg-[var(--navy-deep)]"
            }`}
          >
            {t.nav.contact}
            <span aria-hidden className="text-[0.85em] leading-none">
              ↗
            </span>
          </a>

          <button
            type="button"
            onClick={openApply}
            aria-label={t.nav.apply}
            title={t.nav.apply}
            className="inline-flex h-[2.2rem] w-[2.2rem] shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--navy)] transition-colors hover:border-[var(--navy)] hover:bg-[var(--navy)] hover:!text-white"
          >
            <ApplyIcon className="h-[1.05rem] w-[1.05rem]" />
          </button>

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
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-l-2 py-2.5 pl-3 text-[0.866rem] font-medium ${
                    active
                      ? "border-[var(--navy)] text-[var(--navy)]"
                      : "border-transparent text-[var(--navy)]/85"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="/contact"
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--navy)] px-4 py-2.5 text-[0.866rem] font-semibold !text-white"
              onClick={() => setOpen(false)}
            >
              {t.nav.contact}
              <span aria-hidden>↗</span>
            </a>
            <button
              type="button"
              onClick={openApply}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--navy)] px-4 py-2.5 text-[0.866rem] font-semibold text-[var(--navy)]"
            >
              <ApplyIcon className="h-4 w-4" />
              {t.openApplyCta}
            </button>
          </nav>
        </div>
      )}

      <ApplicationModal open={applyOpen} onClose={() => setApplyOpen(false)} />
    </header>
  );
}
