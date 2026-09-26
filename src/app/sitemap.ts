import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const paths = ["", "/about", "/performance", "/clients", "/team", "/gallery", "/contact"];

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
    alternates: {
      languages: {
        ko: `${siteUrl}${path}`,
        en: `${siteUrl}${path}`,
      },
    },
  }));
}
