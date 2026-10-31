import type { Locale } from "@/lib/types";
import { LOCALE_STORAGE_KEY } from "@/lib/ui";

export const LOCALE_COOKIE = LOCALE_STORAGE_KEY;
/** Set only when the user explicitly picks a language in the UI. */
export const LOCALE_MANUAL_KEY = "hsc_locale_manual";

/**
 * Prefer Korean when Accept-Language ranks `ko*` highest among ko/en,
 * English for `en*`, otherwise English (India-facing default).
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "en";

  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number(q.split("=")[1]) || 0 : 1;
      return { tag: (tag || "").toLowerCase(), quality };
    })
    .filter((item) => item.tag)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of tags) {
    if (tag === "ko" || tag.startsWith("ko-")) return "ko";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }

  return "en";
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ko" || value === "en";
}
