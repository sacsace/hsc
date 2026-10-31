import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { ServicesPage } from "@/components/ServicesPage";
import { getRequestLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata("services", locale, "/services");
}

export default async function Page() {
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  return <ServicesPage content={content} initialLocale={locale} />;
}
