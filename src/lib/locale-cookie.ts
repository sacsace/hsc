import type { Locale } from "@/lib/types";
import { LOCALE_COOKIE, LOCALE_MANUAL_KEY } from "@/lib/locale-detect";

const MAX_AGE = 60 * 60 * 24 * 365;

export function localeCookieOptions(locale: Locale) {
  return {
    name: LOCALE_COOKIE,
    value: locale,
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };
}

/** Marks that the visitor explicitly chose a language in the UI. */
export function localeManualCookieOptions(manual: boolean) {
  return {
    name: LOCALE_MANUAL_KEY,
    value: manual ? "1" : "0",
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };
}
