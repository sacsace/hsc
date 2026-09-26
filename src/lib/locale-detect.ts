import type { Locale } from "@/lib/types";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "@/lib/ui";

export const LOCALE_COOKIE = LOCALE_STORAGE_KEY;

/** Accept-Language / OS·브라우저 언어 설정에서 ko | en 판별 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number(q.split("=")[1]) || 0 : 1;
      return { tag: (tag || "").toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of tags) {
    if (tag.startsWith("ko")) return "ko";
    if (tag.startsWith("en")) return "en";
  }

  return DEFAULT_LOCALE;
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ko" || value === "en";
}
