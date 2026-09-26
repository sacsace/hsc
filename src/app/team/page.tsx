import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { TeamPage } from "@/components/TeamPage";
import { getRequestLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata("team", locale, "/team");
}

export default async function Page() {
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  return <TeamPage content={content} initialLocale={locale} />;
}
