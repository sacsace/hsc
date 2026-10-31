import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

export type SeoPage =
  | "home"
  | "about"
  | "services"
  | "team"
  | "gallery"
  | "contact"
  | "clients"
  | "performance";

type SeoCopy = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
};

const SITE_NAME = "Hankook Service Center";
const LEGAL_NAME = "Hankook Service Center Private Limited";
const CONTACT_EMAIL = "hyun.hs@hksc.in";

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
        "압축공기",
        "인도",
        "방갈로르",
        "첸나이",
        "Atlas Copco",
        "ELGI",
      ],
      ogTitle: `${SITE_NAME} | Total Air Solution`,
      ogDescription: "산업용 압축공기 판매·수리·유지보수 파트너.",
    },
    about: {
      title: `회사 소개 | ${SITE_NAME}`,
      description: "대표 인사말, 회사 개요, 연혁 및 인증 안내. Hankook Service Center 회사 소개.",
      keywords: ["회사 소개", "대표 인사말", "연혁", "인증", "Hankook Service Center"],
      ogTitle: `회사 소개 | ${SITE_NAME}`,
      ogDescription: "대표 인사말과 회사 개요, 연혁을 확인하세요.",
    },
    services: {
      title: `설비와 서비스 | ${SITE_NAME}`,
      description:
        "에어 컴프레서, 드라이어·필터, 오일, 질소, DG·UPS 등 설비 공급과 판매·수리·오버홀·AMC 서비스 안내.",
      keywords: [
        "설비",
        "서비스",
        "에어 컴프레서",
        "드라이어",
        "필터",
        "오버홀",
        "AMC",
        "Hankook Service Center",
      ],
      ogTitle: `설비와 서비스 | ${SITE_NAME}`,
      ogDescription: "Total Air Solution 설비와 서비스를 확인하세요.",
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
    performance: {
      title: `실적 | ${SITE_NAME}`,
      description: "판매, 오버홀, 연간 유지보수 등 Hankook Service Center 주요 수행 실적.",
      keywords: ["실적", "오버홀", "유지보수", "Hankook Service Center"],
      ogTitle: `실적 | ${SITE_NAME}`,
      ogDescription: "주요 수행 실적을 확인하세요.",
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
        "compressed air",
        "India",
        "Bangalore",
        "Chennai",
        "Atlas Copco",
        "ELGI",
      ],
      ogTitle: `${SITE_NAME} | Total Air Solution`,
      ogDescription: "Your industrial compressed air sales, repair, and maintenance partner.",
    },
    about: {
      title: `About Us | ${SITE_NAME}`,
      description: "CEO message, company overview, history, and certifications of Hankook Service Center.",
      keywords: ["about", "CEO message", "company history", "certification", "Hankook Service Center"],
      ogTitle: `About Us | ${SITE_NAME}`,
      ogDescription: "Learn about our CEO message, company overview, and history.",
    },
    services: {
      title: `Equipment & Services | ${SITE_NAME}`,
      description:
        "Air compressors, dryers, filters, oils, nitrogen, DG and UPS supply, plus sales, repair, overhaul, and AMC services.",
      keywords: [
        "equipment",
        "services",
        "air compressor",
        "dryer",
        "filter",
        "overhaul",
        "AMC",
        "Hankook Service Center",
      ],
      ogTitle: `Equipment & Services | ${SITE_NAME}`,
      ogDescription: "Explore our Total Air Solution equipment and services.",
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
    performance: {
      title: `Performance | ${SITE_NAME}`,
      description:
        "Major sales, overhaul, and annual maintenance work by Hankook Service Center.",
      keywords: ["performance", "overhaul", "maintenance", "Hankook Service Center"],
      ogTitle: `Performance | ${SITE_NAME}`,
      ogDescription: "Browse our key project and service records.",
    },
  },
};

function absoluteUrl(path: string) {
  const siteUrl = getSiteUrl();
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(
  page: SeoPage,
  locale: Locale,
  path = "/",
): Metadata {
  const copy = seo[locale][page];
  const url = absoluteUrl(path);
  const ogLocale = locale === "ko" ? "ko_KR" : "en_IN";
  const altLocale = locale === "ko" ? "en_IN" : "ko_KR";
  const ogImage = {
    url: absoluteUrl("/images/symbol-hsc.png"),
    width: 1272,
    height: 1153,
    alt: SITE_NAME,
    type: "image/png",
  };

  return {
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Business",
    applicationName: SITE_NAME,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
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
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.ogTitle,
      description: copy.ogDescription,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "content-language": locale === "ko" ? "ko" : "en",
    },
  };
}

export function organizationJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();
  const description = seo[locale].home.description;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/symbol-hsc.png`,
      width: 1272,
      height: 1153,
    },
    image: `${siteUrl}/images/symbol-hsc.png`,
    description,
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: CONTACT_EMAIL,
        availableLanguage: ["en", "ko"],
        areaServed: "IN",
      },
    ],
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
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    inLanguage: locale === "ko" ? "ko" : "en",
  };
}

export function websiteJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: locale === "ko" ? "ko" : "en",
    publisher: { "@id": `${siteUrl}/#organization` },
    description: seo[locale].home.description,
  };
}

/** Safe JSON-LD payload for <script> text content (no HTML injection). */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
