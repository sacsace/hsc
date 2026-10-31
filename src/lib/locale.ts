import { cookies, headers } from "next/headers";
import type { Locale } from "@/lib/types";
import {
  isLocale,
  localeFromAcceptLanguage,
  LOCALE_COOKIE,
  LOCALE_MANUAL_KEY,
} from "@/lib/locale-detect";

export {
  isLocale,
  localeFromAcceptLanguage,
  LOCALE_COOKIE,
  LOCALE_MANUAL_KEY,
} from "@/lib/locale-detect";

/**
 * Manual cookie choice → Accept-Language → English.
 * Middleware keeps the locale cookie aligned with the browser language
 * until the visitor explicitly picks KO/EN in the header.
 */
export async function getRequestLocale(): Promise<Locale> {
  const jar = await cookies();
  const manual = jar.get(LOCALE_MANUAL_KEY)?.value === "1";
  const fromCookie = jar.get(LOCALE_COOKIE)?.value;
  if (manual && isLocale(fromCookie)) return fromCookie;

  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get("accept-language"));
}
