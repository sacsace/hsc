import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { getRequestLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/HomePage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata("home", locale, "/");
}

export default async function Page() {
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  return <HomePage content={content} initialLocale={locale} />;
}
