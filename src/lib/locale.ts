import { cookies, headers } from "next/headers";
import type { Locale } from "@/lib/types";
import {
  isLocale,
  localeFromAcceptLanguage,
  LOCALE_COOKIE,
} from "@/lib/locale-detect";

export { isLocale, localeFromAcceptLanguage, LOCALE_COOKIE } from "@/lib/locale-detect";

/** 쿠키 → Accept-Language → 기본(ko) */
export async function getRequestLocale(): Promise<Locale> {
  const jar = await cookies();
  const fromCookie = jar.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get("accept-language"));
}
