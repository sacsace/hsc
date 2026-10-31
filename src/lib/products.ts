import catalog from "@/data/product-catalog.json";
import type { Locale } from "@/lib/types";

export type CatalogProduct = {
  id: string;
  title: string;
  fileName: string;
  image: string;
  description: string;
};

export type CatalogBrand = {
  slug: string;
  group: string;
  brand: string;
  folder: string;
  products: CatalogProduct[];
};

export const productCatalog = catalog as CatalogBrand[];

const brandIntro: Record<
  string,
  { ko: { title: string; lead: string }; en: { title: string; lead: string } }
> = {
  "atlas-copco": {
    ko: {
      title: "Atlas Copco",
      lead: "오일 주입식 스크류 컴프레서 등 Atlas Copco 산업용 압축공기 설비 자료를 안내합니다.",
    },
    en: {
      title: "Atlas Copco",
      lead: "Industrial compressed-air equipment documents for Atlas Copco screw compressors and related systems.",
    },
  },
  "chicago-pneumatic": {
    ko: {
      title: "Chicago Pneumatic",
      lead: "오일프리·VSD/iPM 컴프레서, 필터 등 Chicago Pneumatic(CP) 제품 카탈로그입니다.",
    },
    en: {
      title: "Chicago Pneumatic",
      lead: "Chicago Pneumatic (CP) catalogs for oil-free and VSD/iPM compressors, filters, and quality-air solutions.",
    },
  },
  elgi: {
    ko: {
      title: "ELGI",
      lead: "ELGI EGPM 등 산업용 에어 컴프레서 카탈로그를 확인하세요.",
    },
    en: {
      title: "ELGI",
      lead: "ELGI industrial air compressor catalogs including the EGPM range.",
    },
  },
  "fs-curtis": {
    ko: {
      title: "FS Curtis",
      lead: "A-Series, NxVI, Eco Rotary, 진공펌프·액세서리 등 FS Curtis 제품 자료입니다.",
    },
    en: {
      title: "FS Curtis",
      lead: "FS Curtis product documents including A-Series, NxVI, Eco Rotary, vacuum pumps, and accessories.",
    },
  },
  "ingersoll-rand": {
    ko: {
      title: "Ingersoll Rand",
      lead: "RMB 시리즈 등 Ingersoll Rand 컴프레서 카탈로그입니다.",
    },
    en: {
      title: "Ingersoll Rand",
      lead: "Ingersoll Rand compressor catalogs including the RMB series.",
    },
  },
  alisha: {
    ko: {
      title: "Alisha",
      lead: "Alisha 제품 브로슈어 이미지를 확인하세요.",
    },
    en: {
      title: "Alisha",
      lead: "Browse the Alisha product brochure visuals.",
    },
  },
  summit: {
    ko: {
      title: "Summit",
      lead: "흡착식·냉동식 드라이어, 필터, Hankook 질소 발생장치 등 Summit 관련 설비 자료입니다.",
    },
    en: {
      title: "Summit",
      lead: "Summit air-treatment documents covering heatless and refrigeration dryers, filters, and Hankook nitrogen plants.",
    },
  },
  oil: {
    ko: {
      title: "Klüber Summit Oil",
      lead: "컴프레서용 Klüber Summit 합성 오일(PS, SH, FG Elite) 제품 안내입니다.",
    },
    en: {
      title: "Klüber Summit Oil",
      lead: "Klüber Summit synthetic compressor oils including PS, SH, and FG Elite grades.",
    },
  },
  dg: {
    ko: {
      title: "Kirloskar DG",
      lead: "Kirloskar 디젤 발전기(DG) 관련 자료를 안내합니다.",
    },
    en: {
      title: "Kirloskar DG",
      lead: "Kirloskar diesel generator (DG) product documents.",
    },
  },
  ups: {
    ko: {
      title: "SBN Tech UPS",
      lead: "SBN Tech UPS 및 전원 솔루션 회사·제품 프로필입니다.",
    },
    en: {
      title: "SBN Tech UPS",
      lead: "SBN Tech UPS and power-solution company profile documents.",
    },
  },
  hankook: {
    ko: {
      title: "Hankook Service Center",
      lead: "회사 프로필 및 컴프레서·공기처리 비교 참고 자료입니다.",
    },
    en: {
      title: "Hankook Service Center",
      lead: "Company profile and reference materials for compressors and air treatment.",
    },
  },
};

export function getBrandBySlug(slug: string): CatalogBrand | undefined {
  return productCatalog.find((item) => item.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return productCatalog.map((item) => item.slug);
}

export function getBrandIntro(slug: string, locale: Locale) {
  const intro = brandIntro[slug];
  if (!intro) {
    const brand = getBrandBySlug(slug);
    const title = brand?.brand || slug;
    return {
      title,
      lead:
        locale === "ko"
          ? `${title} 관련 제품 자료입니다.`
          : `Product documents for ${title}.`,
    };
  }
  return intro[locale];
}

export function getBrandCover(brand: CatalogBrand): string | undefined {
  return brand.products[0]?.image;
}

export const productPageUi = {
  ko: {
    back: "설비·서비스로 돌아가기",
    docsLabel: "제품 자료",
    docsLead: "해당 폴더의 카탈로그·브로슈어 미리보기와 요약 설명입니다.",
    empty: "등록된 제품 자료가 없습니다.",
    contact: "이 제품 문의하기",
  },
  en: {
    back: "Back to Equipment & Services",
    docsLabel: "Product Documents",
    docsLead: "Preview images and short descriptions from the product folder.",
    empty: "No product documents yet.",
    contact: "Ask about this product line",
  },
} as const;
