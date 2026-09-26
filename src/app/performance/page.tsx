import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PerformancePage } from "@/components/PerformancePage";
import { getRequestLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata("performance", locale, "/performance");
}

export default async function Page() {
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  return <PerformancePage content={content} initialLocale={locale} />;
}
