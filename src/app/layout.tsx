import type { Metadata } from "next";
import { Archivo, Noto_Sans_KR, Source_Sans_3 } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Hankook Service Center | Total Air Solution",
  description:
    "Hankook Service Center Pvt. Ltd. 에어 컴프레서 판매·수리·유지보수. 인도 방갈로르 산업용 에어 솔루션.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html
 lang="ko"
 className={`${display.variable} ${body.variable} ${korean.variable} h-full`}
 >
 <body className="min-h-full antialiased">{children}</body>
 </html>
 );
}
