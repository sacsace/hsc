import type { Metadata } from "next";
import { Archivo, Noto_Sans_KR, Source_Sans_3 } from "next/font/google";
import { getRequestLocale } from "@/lib/locale";
import { getSiteUrl, organizationJsonLd, serializeJsonLd } from "@/lib/seo";
import "./globals.css";

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body-latin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const korean = Noto_Sans_KR({
  variable: "--font-body-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} ${korean.variable} h-full`}
    >
      <head>
        {/* textContent (not innerHTML) — < escaped for XSS safety */}
        <script type="application/ld+json">{serializeJsonLd(jsonLd)}</script>
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
