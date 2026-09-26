import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { GalleryPage } from "@/components/GalleryPage";
import { getRequestLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata("gallery", locale, "/gallery");
}

export default async function Page() {
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  return <GalleryPage content={content} initialLocale={locale} />;
}
