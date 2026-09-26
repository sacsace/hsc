import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { AboutPage } from "@/components/AboutPage";
import { getRequestLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata("about", locale, "/about");
}

export default async function Page() {
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  return <AboutPage content={content} initialLocale={locale} />;
}
