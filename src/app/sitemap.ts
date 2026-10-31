import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { getAllProductSlugs } from "@/lib/products";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const brandSlugs = new Set(getAllProductSlugs());
  try {
    const content = await getContent();
    for (const locale of ["ko", "en"] as const) {
      for (const brand of content[locale].services?.brands || []) {
        if (brand.slug) brandSlugs.add(brand.slug);
      }
    }
  } catch {
    // Fall back to static catalog slugs if content is unavailable at build time.
  }

  const paths = [
    "",
    "/about",
    "/services",
    ...[...brandSlugs].map((slug) => `/services/${slug}`),
    "/performance",
    "/clients",
    "/team",
    "/gallery",
    "/contact",
  ];

  return paths.map((path) => {
    const isHome = path === "";
    const isServiceDetail = path.startsWith("/services/");
    return {
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: isHome ? "weekly" : "monthly",
      priority: isHome ? 1 : isServiceDetail ? 0.6 : 0.7,
      alternates: {
        languages: {
          ko: `${siteUrl}${path}`,
          en: `${siteUrl}${path}`,
          "x-default": `${siteUrl}${path}`,
        },
      },
    };
  });
}
