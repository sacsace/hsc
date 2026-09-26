import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

export type SeoPage =
  | "home"
  | "about"
  | "team"
  | "gallery"
  | "contact"
  | "clients";

type SeoCopy = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
};

const SITE_NAME = "Hankook Service Center";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://hksc.in").replace(/\/$/, "");
}

const seo: Record<Locale, Record<SeoPage, SeoCopy>> = {
  ko: {
    home: {
      title: `${SITE_NAME} | Total Air Solution`,
      description:
        "Hankook Service Center Pvt. Ltd. 산업용 에어 컴프레서 판매·수리·유지보수. 인도 방갈로르·첸나이 Total Air Solution.",
      keywords: [
        "Hankook Service Center",
        "에어 컴프레서",
        "컴프레서 수리",
        "오버홀",
        "인도",
        "방갈로르",
        "첸나이",
      ],
      ogTitle: `${SITE_NAME} | Total Air Solution`,
      ogDescription: "산업용 압축공기 판매·수리·유지보수 파트너.",
    },
    about: {
      title: `회사 소개 | ${SITE_NAME}`,
      description: "대표 인사말, 회사 개요, 연혁 및 인증 안내. Hankook Service Center 회사 소개.",
      keywords: ["회사 소개", "대표 인사말", "연혁", "Hankook Service Center"],
      ogTitle: `회사 소개 | ${SITE_NAME}`,
      ogDescription: "대표 인사말과 회사 개요, 연혁을 확인하세요.",
    },
    team: {
      title: `팀원 소개 | ${SITE_NAME}`,
      description: "Hankook Service Center 대표 및 팀원 소개.",
      keywords: ["팀원", "대표", "Hankook Service Center"],
      ogTitle: `팀원 소개 | ${SITE_NAME}`,
      ogDescription: "산업용 컴프레서 서비스를 이끄는 팀을 소개합니다.",
    },
    gallery: {
      title: `갤러리 | ${SITE_NAME}`,
      description: "Hankook Service Center 현장 및 서비스 활동 갤러리.",
      keywords: ["갤러리", "현장 사진", "Hankook Service Center"],
      ogTitle: `갤러리 | ${SITE_NAME}`,
      ogDescription: "현장과 서비스 활동 사진입니다.",
    },
    contact: {
      title: `문의 | ${SITE_NAME}`,
      description:
        "문의 양식 및 Registration Office·첸나이 사무실 위치 안내. Hankook Service Center 연락처.",
      keywords: ["문의", "연락처", "첸나이", "방갈로르", "Hankook Service Center"],
      ogTitle: `문의 | ${SITE_NAME}`,
      ogDescription: "문의 양식을 통해 빠르게 상담받으세요.",
    },
    clients: {
      title: `고객사 | ${SITE_NAME}`,
      description: "Hankook Service Center와 함께한 주요 고객사 목록입니다.",
      keywords: ["고객사", "파트너", "Hankook Service Center"],
      ogTitle: `고객사 | ${SITE_NAME}`,
      ogDescription: "함께 성장해 온 주요 고객사를 확인하세요.",
    },
  },
  en: {
    home: {
      title: `${SITE_NAME} | Total Air Solution`,
      description:
        "Hankook Service Center Pvt. Ltd. Industrial air compressor sales, repair, and maintenance in Bangalore and Chennai, India.",
      keywords: [
        "Hankook Service Center",
        "air compressor",
        "compressor repair",
        "overhaul",
        "India",
        "Bangalore",
        "Chennai",
      ],
      ogTitle: `${SITE_NAME} | Total Air Solution`,
      ogDescription: "Your industrial compressed air sales, repair, and maintenance partner.",
    },
    about: {
      title: `About Us | ${SITE_NAME}`,
      description: "CEO message, company overview, history, and certifications of Hankook Service Center.",
      keywords: ["about", "CEO message", "company history", "Hankook Service Center"],
      ogTitle: `About Us | ${SITE_NAME}`,
      ogDescription: "Learn about our CEO message, company overview, and history.",
    },
    team: {
      title: `Our Team | ${SITE_NAME}`,
      description: "Meet the director and team behind Hankook Service Center.",
      keywords: ["team", "director", "Hankook Service Center"],
      ogTitle: `Our Team | ${SITE_NAME}`,
      ogDescription: "The people behind our industrial compressor service.",
    },
    gallery: {
      title: `Gallery | ${SITE_NAME}`,
      description: "Field and service activity photos from Hankook Service Center.",
      keywords: ["gallery", "field photos", "Hankook Service Center"],
      ogTitle: `Gallery | ${SITE_NAME}`,
      ogDescription: "Photos from our field service and operations.",
    },
    contact: {
      title: `Contact | ${SITE_NAME}`,
      description:
        "Send an inquiry and find our Registration Office and Chennai office locations.",
      keywords: ["contact", "inquiry", "Chennai", "Bangalore", "Hankook Service Center"],
      ogTitle: `Contact | ${SITE_NAME}`,
      ogDescription: "Send an inquiry and we will get back to you soon.",
    },
    clients: {
      title: `Clients | ${SITE_NAME}`,
      description: "Major clients and partners of Hankook Service Center.",
      keywords: ["clients", "partners", "Hankook Service Center"],
      ogTitle: `Clients | ${SITE_NAME}`,
      ogDescription: "See the partners we have worked with.",
    },
  },
};

export function buildPageMetadata(
  page: SeoPage,
  locale: Locale,
  path = "/",
): Metadata {
  const copy = seo[locale][page];
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const ogLocale = locale === "ko" ? "ko_KR" : "en_IN";
  const altLocale = locale === "ko" ? "en_IN" : "ko_KR";

  return {
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Business",
    alternates: {
      canonical: url,
      languages: {
        ko: url,
        en: url,
        "x-default": url,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: [altLocale],
      url,
      siteName: SITE_NAME,
      title: copy.ogTitle,
      description: copy.ogDescription,
      images: [
        {
          url: `${siteUrl}/images/logo-hsc.png`,
          width: 1718,
          height: 343,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.ogTitle,
      description: copy.ogDescription,
      images: [`${siteUrl}/images/logo-hsc.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function organizationJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();
  const description = seo[locale].home.description;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Hankook Service Center Private Limited",
    url: siteUrl,
    logo: `${siteUrl}/images/logo-hsc.png`,
    description,
    email: "hyun.hs@hksc.in",
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Bangalore",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    ],
    areaServed: "IN",
    inLanguage: locale === "ko" ? "ko" : "en",
  };
}
