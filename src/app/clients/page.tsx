import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { ClientsPage } from "@/components/ClientsPage";
import { getRequestLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata("clients", locale, "/clients");
}

export default async function Page() {
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  return <ClientsPage content={content} initialLocale={locale} />;
}
