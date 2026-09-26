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
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, ui, type UiCopy } from "@/lib/ui";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: LocaleContent;
  t: UiCopy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
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
    // 서버에서 감지한 언어를 우선 반영. 이후 수동 선택만 localStorage에 저장.
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "ko" || saved === "en") {
      setLocaleState(saved);
      writeLocaleCookie(saved);
      return;
    }
    setLocaleState(initialLocale);
    writeLocaleCookie(initialLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    writeLocaleCookie(next);
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
