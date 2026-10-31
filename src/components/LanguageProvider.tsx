"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale, LocaleContent, SiteContent } from "@/lib/types";
import { LOCALE_MANUAL_KEY } from "@/lib/locale-detect";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, ui, type UiCopy } from "@/lib/ui";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: LocaleContent;
  t: UiCopy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function syncLocaleCookie(locale: Locale, manual: boolean) {
  void fetch("/api/locale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale, manual }),
    credentials: "same-origin",
  }).catch(() => {
    // Ignore network errors; UI locale still updates in memory.
  });
}

export function LanguageProvider({
  siteContent,
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  siteContent: SiteContent;
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const manual = window.localStorage.getItem(LOCALE_MANUAL_KEY) === "1";
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);

    // Explicit UI choice wins; otherwise follow server (Accept-Language / cookie).
    if (manual && (saved === "ko" || saved === "en")) {
      setLocaleState(saved);
      syncLocaleCookie(saved, true);
      return;
    }

    setLocaleState(initialLocale);
    syncLocaleCookie(initialLocale, false);
  }, [initialLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    window.localStorage.setItem(LOCALE_MANUAL_KEY, "1");
    syncLocaleCookie(next, true);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      content: siteContent[locale],
      t: ui[locale],
    }),
    [locale, setLocale, siteContent],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
