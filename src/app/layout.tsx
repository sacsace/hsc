import type { Metadata } from "next";
import { headers } from "next/headers";
import { getRequestLocale } from "@/lib/locale";
import { getSiteUrl, organizationJsonLd, serializeJsonLd } from "@/lib/seo";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/500.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/600.css";
import "@fontsource/noto-sans-kr/700.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: "Hankook Service Center",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "32x32" },
      ],
      apple: "/apple-icon.png",
    },
    other: {
      "content-language": locale === "ko" ? "ko" : "en",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const jsonLd = organizationJsonLd(locale);
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang={locale} className="h-full">
      <head>
        <script type="application/ld+json" nonce={nonce}>
          {serializeJsonLd(jsonLd)}
        </script>
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
