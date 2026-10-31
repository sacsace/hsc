import type { Locale } from "@/lib/types";

export type ServiceOffering = {
  id: string;
  title: string;
  description: string;
};

export type EquipmentLink = {
  label: string;
  slug: string;
};

export type EquipmentCategory = {
  id: string;
  title: string;
  description: string;
  items: EquipmentLink[];
};

export type ServicesCopy = {
  label: string;
  title: string;
  lead: string;
  offeringsLabel: string;
  offeringsTitle: string;
  offeringsLead: string;
  equipmentLabel: string;
  equipmentTitle: string;
  equipmentLead: string;
  brandsLabel: string;
  viewDocs: string;
  ctaTitle: string;
  ctaLead: string;
  ctaButton: string;
  offerings: ServiceOffering[];
  equipment: EquipmentCategory[];
};

const ko: ServicesCopy = {
  label: "Products & Services",
  title: "설비와 서비스",
  lead:
    "산업용 압축공기 Total Air Solution. 멀티 브랜드 에어 컴프레서와 주변 설비 공급부터 설치, 수리·오버홀, 연간 유지보수까지 한곳에서 지원합니다.",
  offeringsLabel: "Services",
  offeringsTitle: "제공 서비스",
  offeringsLead: "현장 가동을 안정적으로 유지하기 위한 판매·정비·공사 서비스를 제공합니다.",
  equipmentLabel: "Equipment",
  equipmentTitle: "취급 설비",
  equipmentLead:
    "브랜드를 선택하면 Document For Websites 폴더의 제품 사진(카탈로그 표지)과 설명을 볼 수 있습니다.",
  brandsLabel: "주요 취급 브랜드",
  viewDocs: "제품 자료 보기",
  ctaTitle: "설비 선정이나 유지보수 상담이 필요하신가요?",
  ctaLead: "현장 조건에 맞는 컴프레서·처리설비·유지보수 방안을 함께 검토합니다.",
  ctaButton: "문의하기",
  offerings: [
    {
      id: "sales",
      title: "신규 설비 판매",
      description:
        "에어 컴프레서, 드라이어, 필터, 오일, UPS, DG 등 현장 요구에 맞는 설비를 제안하고 공급합니다.",
    },
    {
      id: "repair",
      title: "수리 · 오버홀",
      description:
        "Atlas Copco, ELGI, Chicago Pneumatic, FS Curtis 등 멀티 브랜드 컴프레서의 에어엔드·모터·제어반 정비와 오버홀을 수행합니다.",
    },
    {
      id: "amc",
      title: "연간 유지보수(AMC)",
      description:
        "예방정비 계약으로 정기 점검, 소모품 교체, 고장 대응을 지원해 비가동 리스크를 낮춥니다.",
    },
    {
      id: "treatment",
      title: "공기처리 · 배관 공사",
      description:
        "드라이어·필터·애프터쿨러 구성과 파이프라인 공사로 안정적인 압축공기 품질과 공급 라인을 구축합니다.",
    },
    {
      id: "rental",
      title: "렌탈 컴프레서",
      description:
        "설비 교체·증설·돌발 대응 시 렌탈 컴프레서로 생산 중단을 최소화합니다.",
    },
    {
      id: "special",
      title: "질소·냉각·전원 설비",
      description:
        "질소 발생장치, 칠러 재컨디셔닝, DG·UPS 등 생산 유틸리티 설비를 함께 지원합니다.",
    },
  ],
  equipment: [
    {
      id: "compressors",
      title: "에어 컴프레서",
      description:
        "오일 주입식·오일프리, 고정속·VSD/VFD 등 산업용 스크류 컴프레서 패키지를 취급합니다.",
      items: [
        { label: "Atlas Copco", slug: "atlas-copco" },
        { label: "Chicago Pneumatic (CP)", slug: "chicago-pneumatic" },
        { label: "ELGI", slug: "elgi" },
        { label: "FS Curtis", slug: "fs-curtis" },
        { label: "Ingersoll Rand", slug: "ingersoll-rand" },
        { label: "Alisha", slug: "alisha" },
      ],
    },
    {
      id: "dryers-filters",
      title: "드라이어 · 필터 · 애프터쿨러",
      description:
        "제습·여과·냉각 설비로 압축공기 품질을 관리합니다. Summit Adsorb(흡착식), Elix(냉동식) 드라이어와 필터를 포함합니다.",
      items: [
        { label: "Summit 드라이어·필터", slug: "summit" },
        { label: "질소 발생장치", slug: "summit" },
      ],
    },
    {
      id: "oil",
      title: "컴프레서 오일",
      description: "장수명·식품급 등 용도별 합성 컴프레서 오일을 공급합니다.",
      items: [
        { label: "Klüber Summit PS / SH / FG Elite", slug: "oil" },
      ],
    },
    {
      id: "power",
      title: "DG · UPS",
      description:
        "비상·대기 전원과 안정적인 전력 품질을 위한 디젤 발전기 및 UPS 솔루션입니다.",
      items: [
        { label: "Kirloskar DG", slug: "dg" },
        { label: "SBN Tech UPS", slug: "ups" },
      ],
    },
    {
      id: "utility",
      title: "진공펌프 · 액세서리",
      description: "FS Curtis 진공펌프 및 액세서리 자료를 확인할 수 있습니다.",
      items: [{ label: "FS Curtis Accessories / Vacuum", slug: "fs-curtis" }],
    },
  ],
};

const en: ServicesCopy = {
  label: "Products & Services",
  title: "Equipment & Services",
  lead:
    "A Total Air Solution for industrial compressed air. We supply multi-brand compressors and related equipment, and support installation, repair, overhaul, and annual maintenance from one team.",
  offeringsLabel: "Services",
  offeringsTitle: "What We Provide",
  offeringsLead:
    "Sales, service, and installation support to keep production air systems running reliably.",
  equipmentLabel: "Equipment",
  equipmentTitle: "Equipment We Handle",
  equipmentLead:
    "Select a brand to view product photos (catalog covers) and descriptions from our Document For Websites folders.",
  brandsLabel: "Key Brands",
  viewDocs: "View product docs",
  ctaTitle: "Need help selecting equipment or planning maintenance?",
  ctaLead:
    "We review compressor, air-treatment, and maintenance options that fit your site conditions.",
  ctaButton: "Contact us",
  offerings: [
    {
      id: "sales",
      title: "New Equipment Sales",
      description:
        "We recommend and supply air compressors, dryers, filters, oils, UPS, DG, and related utilities for your plant requirements.",
    },
    {
      id: "repair",
      title: "Repair & Overhaul",
      description:
        "Multi-brand compressor service including airend, motor, and controller work for Atlas Copco, ELGI, Chicago Pneumatic, FS Curtis, and more.",
    },
    {
      id: "amc",
      title: "Annual Maintenance (AMC)",
      description:
        "Preventive maintenance contracts covering inspections, consumables, and breakdown response to reduce downtime risk.",
    },
    {
      id: "treatment",
      title: "Air Treatment & Piping",
      description:
        "Dryer, filter, and after-cooler setups plus pipeline work for stable air quality and distribution.",
    },
    {
      id: "rental",
      title: "Rental Compressors",
      description:
        "Temporary rental compressors for replacement, capacity increase, or emergency coverage.",
    },
    {
      id: "special",
      title: "Nitrogen, Cooling & Power",
      description:
        "Nitrogen generation, chiller reconditioning, and DG/UPS support for plant utilities.",
    },
  ],
  equipment: [
    {
      id: "compressors",
      title: "Air Compressors",
      description:
        "Industrial screw compressor packages including oil-injected / oil-free and fixed-speed / VSD-VFD models.",
      items: [
        { label: "Atlas Copco", slug: "atlas-copco" },
        { label: "Chicago Pneumatic (CP)", slug: "chicago-pneumatic" },
        { label: "ELGI", slug: "elgi" },
        { label: "FS Curtis", slug: "fs-curtis" },
        { label: "Ingersoll Rand", slug: "ingersoll-rand" },
        { label: "Alisha", slug: "alisha" },
      ],
    },
    {
      id: "dryers-filters",
      title: "Dryers, Filters & After Coolers",
      description:
        "Air quality equipment including Summit Adsorb heatless dryers, Elix refrigeration dryers, and filters.",
      items: [
        { label: "Summit dryers & filters", slug: "summit" },
        { label: "Nitrogen plant", slug: "summit" },
      ],
    },
    {
      id: "oil",
      title: "Compressor Oils",
      description:
        "Application-specific synthetic compressor lubricants for long life and food-grade needs.",
      items: [{ label: "Klüber Summit PS / SH / FG Elite", slug: "oil" }],
    },
    {
      id: "power",
      title: "DG & UPS",
      description:
        "Diesel generators and UPS solutions for standby power and stable electrical quality.",
      items: [
        { label: "Kirloskar DG", slug: "dg" },
        { label: "SBN Tech UPS", slug: "ups" },
      ],
    },
    {
      id: "utility",
      title: "Vacuum Pumps & Accessories",
      description: "FS Curtis vacuum pump and accessories documents.",
      items: [{ label: "FS Curtis Accessories / Vacuum", slug: "fs-curtis" }],
    },
  ],
};

export const servicesCopy: Record<Locale, ServicesCopy> = { ko, en };

/** Brand cards shown on the services index (excludes company profile folder). */
export const featuredBrandSlugs = [
  "atlas-copco",
  "chicago-pneumatic",
  "elgi",
  "fs-curtis",
  "ingersoll-rand",
  "alisha",
  "summit",
  "oil",
  "dg",
  "ups",
] as const;
