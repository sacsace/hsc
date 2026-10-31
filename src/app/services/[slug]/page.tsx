import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { getContent } from "@/lib/content";
import { getRequestLocale } from "@/lib/locale";
import { defaultServicesContent } from "@/lib/services-default";
import { getSiteUrl } from "@/lib/seo";
import type { ServiceBrandItem } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function findBrand(brands: ServiceBrandItem[], slug: string) {
  return brands.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  const services = content[locale].services || defaultServicesContent(locale);
  const brand = findBrand(services.brands, slug);
  if (!brand) return {};

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/services/${slug}`;
  const cover = brand.products[0]?.image;

  return {
    title: `${brand.brand} | Hankook Service Center`,
    description: brand.lead,
    alternates: { canonical: url },
    openGraph: {
      title: `${brand.brand} | Hankook Service Center`,
      description: brand.lead,
      url,
      images: cover ? [{ url: `${siteUrl}${cover}` }] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const [content, locale] = await Promise.all([getContent(), getRequestLocale()]);
  const services = content[locale].services || defaultServicesContent(locale);
  const brand = findBrand(services.brands, slug);
  if (!brand) notFound();

  return <ServiceDetailPage content={content} initialLocale={locale} brand={brand} />;
}
