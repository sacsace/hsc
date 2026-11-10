import { promises as fs } from "fs";
import { ensureServicesContent } from "@/lib/services-default";
import { sortPerformances, type SiteContent } from "@/lib/types";
import {
  ensureRuntimeContentFile,
  ensureSeedUploads,
  contentFilePath,
} from "@/lib/storage";

export type {
  Locale,
  HistoryItem,
  PerformanceItem,
  CertificateItem,
  GalleryItem,
  HeroSlide,
  TeamMember,
  LocaleContent,
  SiteContent,
} from "@/lib/types";

export { dateSortKey, sortPerformances } from "@/lib/types";

const RETIRED_HERO_VIDEO = "/videos/air-compressor.mp4";
const CURRENT_HERO_VIDEO = "/videos/hero-reel.mp4";
/** Temporary CP product hero slides — restore original facility/pipe set once. */
const CP_HERO_SLIDE_SRCS = new Set([
  "/images/hero/cp-75-220.jpg",
  "/images/hero/cp-cpf221.jpg",
  "/images/hero/cp-cpc-40-60.jpg",
  "/images/hero/cp-cpm60.jpg",
  "/images/hero/cp-oil-free.jpg",
  "/images/hero/cp-piston.jpg",
]);

const CP_FLAGSHIP_PRODUCT_IDS = [
  "cp-75-220",
  "cp-cpf221",
  "cp-cpc-40-60",
  "cp-cpm60",
  "cp-oil-free",
  "cp-piston",
] as const;

function defaultHeroSlides(locale: "ko" | "en") {
  if (locale === "ko") {
    return [
      {
        id: "slide-compressor",
        type: "video" as const,
        src: CURRENT_HERO_VIDEO,
        label: "에어 컴프레서",
        brand: "Hankook Service Center",
        headline: "Total Air Solution",
        subheadline:
          "에어 컴프레서 판매·수리·유지보수. 인도에서 신뢰할 수 있는 산업용 에어 솔루션을 제공합니다.",
        ctaLabel: "문의하기",
        ctaHref: "/contact",
      },
      {
        id: "slide-facility",
        type: "image" as const,
        src: "/images/slide-2.png",
        label: "컴프레서 설비",
        brand: "Reliable Service",
        headline: "안정적인 설비 운영",
        subheadline:
          "산업 현장의 컴프레서 설비를 점검하고, 생산이 멈추지 않도록 신속하고 정확한 서비스를 제공합니다.",
        ctaLabel: "실적 보기",
        ctaHref: "/performance",
      },
      {
        id: "slide-pipe",
        type: "video" as const,
        src: "/videos/pipe.mp4",
        label: "배관",
        brand: "Engineering",
        headline: "배관과 엔지니어링",
        subheadline:
          "압축공기 배관 설계부터 시공·유지관리까지, 현장 맞춤형 엔지니어링 솔루션을 지원합니다.",
        ctaLabel: "회사 소개",
        ctaHref: "/about",
      },
    ];
  }

  return [
    {
      id: "slide-compressor",
      type: "video" as const,
      src: CURRENT_HERO_VIDEO,
      label: "Air Compressor",
      brand: "Hankook Service Center",
      headline: "Total Air Solution",
      subheadline:
        "Air compressor sales, repair, and maintenance. Trusted industrial air solutions in India.",
      ctaLabel: "Contact Us",
      ctaHref: "/contact",
    },
    {
      id: "slide-facility",
      type: "image" as const,
      src: "/images/slide-2.png",
      label: "Compressor Facility",
      brand: "Reliable Service",
      headline: "Keep Operations Running",
      subheadline:
        "We inspect and service compressor facilities so your production stays stable and efficient.",
      ctaLabel: "View All Projects",
      ctaHref: "/performance",
    },
    {
      id: "slide-pipe",
      type: "video" as const,
      src: "/videos/pipe.mp4",
      label: "Piping",
      brand: "Engineering",
      headline: "Piping & Engineering",
      subheadline:
        "From compressed-air piping design to installation and maintenance, we support site-ready engineering.",
      ctaLabel: "About Us",
      ctaHref: "/about",
    },
  ];
}

function replaceRetiredHeroVideo(value: string) {
  return value === RETIRED_HERO_VIDEO ? CURRENT_HERO_VIDEO : value;
}

function needsHeroSlideRefresh(slides: { src?: string; id?: string }[] | undefined) {
  if (!slides?.length) return true;
  // Roll back the temporary CP product hero set; leave admin-managed slides alone.
  return slides.some(
    (slide) =>
      CP_HERO_SLIDE_SRCS.has(slide.src || "") ||
      (slide.id || "").startsWith("slide-cp-"),
  );
}

function ensureChicagoPneumaticFlagships(
  content: SiteContent,
  locale: "ko" | "en",
): boolean {
  const brands = content[locale]?.services?.brands;
  if (!Array.isArray(brands)) return false;
  const brand = brands.find((item) => item.slug === "chicago-pneumatic");
  if (!brand || !Array.isArray(brand.products)) return false;

  const existing = new Set(brand.products.map((product) => product.id));
  const missing = CP_FLAGSHIP_PRODUCT_IDS.filter((id) => !existing.has(id));
  if (!missing.length) return false;

  const seedBrand = content.ko?.services?.brands?.find(
    (item) => item.slug === "chicago-pneumatic",
  );
  const seedProducts =
    (locale === "en"
      ? content.en?.services?.brands?.find((item) => item.slug === "chicago-pneumatic")
          ?.products
      : seedBrand?.products) || [];

  // Prefer same-locale product copy already present in bundled content defaults.
  const catalogById = new Map(
    (seedProducts.length ? seedProducts : brand.products).map((product) => [
      product.id,
      product,
    ]),
  );

  const fallbackCopy: Record<
    (typeof CP_FLAGSHIP_PRODUCT_IDS)[number],
    { title: string; image: string; description: string }
  > =
    locale === "ko"
      ? {
          "cp-75-220": {
            title: "CP 75-220 Screw Compressor",
            image: "/images/products/chicago-pneumatic--75-220.jpg",
            description:
              "Chicago Pneumatic CP 75-220 시리즈 오일 주입식 스크류 컴프레서. 산업 현장의 안정적인 압축공기 공급을 위한 주력 모델입니다.",
          },
          "cp-cpf221": {
            title: "CPF 220-450 Fixed Speed",
            image: "/images/products/chicago-pneumatic--cpf221.jpg",
            description:
              "CPF 시리즈 고정속 대용량 스크류 컴프레서. 중대형 공장의 연속 가동과 높은 공기 수요에 적합합니다.",
          },
          "cp-cpc-40-60": {
            title: "CPC 40-60 Package",
            image: "/images/products/chicago-pneumatic--cpc-40-60.jpg",
            description:
              "CPC 40-60 오일 주입식 스크류 컴프레서 패키지. 설치와 유지보수가 용이한 현장 맞춤형 솔루션입니다.",
          },
          "cp-cpm60": {
            title: "CPM / CPMV / CPVS Series",
            image: "/images/products/chicago-pneumatic--cpm60.jpg",
            description:
              "CPM 고정속 및 CPMV·CPVS 가변속 스크류 컴프레서. 부하 변동에 맞춘 에너지 효율적인 운영을 지원합니다.",
          },
          "cp-oil-free": {
            title: "Oil-Free Screw Compressor",
            image: "/images/products/chicago-pneumatic--oil-free.jpg",
            description:
              "Chicago Pneumatic 오일프리 스크류 컴프레서. 청정 압축공기가 필요한 공정에 적합합니다.",
          },
          "cp-piston": {
            title: "Piston Air Compressor",
            image: "/images/products/chicago-pneumatic--piston.jpg",
            description:
              "Chicago Pneumatic 피스톤 컴프레서. 워크숍과 소규모 산업 현장에 적합한 실용형 모델입니다.",
          },
        }
      : {
          "cp-75-220": {
            title: "CP 75-220 Screw Compressor",
            image: "/images/products/chicago-pneumatic--75-220.jpg",
            description:
              "Chicago Pneumatic CP 75-220 oil-injected screw compressors — our flagship series for reliable industrial compressed air.",
          },
          "cp-cpf221": {
            title: "CPF 220-450 Fixed Speed",
            image: "/images/products/chicago-pneumatic--cpf221.jpg",
            description:
              "CPF fixed-speed high-capacity screw compressors for continuous operation and high air demand in mid- to large-scale plants.",
          },
          "cp-cpc-40-60": {
            title: "CPC 40-60 Package",
            image: "/images/products/chicago-pneumatic--cpc-40-60.jpg",
            description:
              "CPC 40-60 oil-injected screw compressor packages — easy to install and service for site-ready solutions.",
          },
          "cp-cpm60": {
            title: "CPM / CPMV / CPVS Series",
            image: "/images/products/chicago-pneumatic--cpm60.jpg",
            description:
              "CPM fixed-speed and CPMV/CPVS variable-speed screw compressors for energy-efficient operation under changing load.",
          },
          "cp-oil-free": {
            title: "Oil-Free Screw Compressor",
            image: "/images/products/chicago-pneumatic--oil-free.jpg",
            description:
              "Chicago Pneumatic oil-free screw compressors for processes that require clean compressed air.",
          },
          "cp-piston": {
            title: "Piston Air Compressor",
            image: "/images/products/chicago-pneumatic--piston.jpg",
            description:
              "Chicago Pneumatic piston compressors suited to workshops and smaller industrial sites.",
          },
        };

  const inserts = missing.map((id) => {
    const fromSeed = catalogById.get(id);
    const fallback = fallbackCopy[id];
    return {
      id,
      title: fromSeed?.title || fallback.title,
      image: fromSeed?.image || fallback.image,
      description: fromSeed?.description || fallback.description,
    };
  });

  brand.products = [...inserts, ...brand.products.filter((p) => p.title?.trim())];
  brand.lead =
    locale === "ko"
      ? "Chicago Pneumatic 주력 스크류·오일프리·피스톤 컴프레서 라인업입니다."
      : "Flagship Chicago Pneumatic screw, oil-free, and piston compressor lineup.";
  return true;
}

export async function getContent(): Promise<SiteContent> {
  const contentPath = await ensureRuntimeContentFile();
  // Restore bundled CMS images into the volume when missing (survives redeploy).
  await ensureSeedUploads();
  const raw = await fs.readFile(contentPath, "utf-8");
  const content = JSON.parse(raw) as SiteContent;
  let contentMigrated = false;

  for (const locale of ["ko", "en"] as const) {
    const hero = content[locale]?.hero;
    if (!hero) continue;
    if (hero.videoUrl === RETIRED_HERO_VIDEO) {
      hero.videoUrl = CURRENT_HERO_VIDEO;
      contentMigrated = true;
    }
    for (const slide of hero.slides || []) {
      if (slide.src === RETIRED_HERO_VIDEO) {
        slide.src = replaceRetiredHeroVideo(slide.src);
        contentMigrated = true;
      }
    }
    if (needsHeroSlideRefresh(hero.slides)) {
      hero.slides = defaultHeroSlides(locale);
      if (!hero.videoUrl || hero.videoUrl === RETIRED_HERO_VIDEO) {
        hero.videoUrl = CURRENT_HERO_VIDEO;
      }
      contentMigrated = true;
    }
    if (ensureChicagoPneumaticFlagships(content, locale)) {
      contentMigrated = true;
    }
  }

  if (contentMigrated) {
    await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf-8");
  }

  for (const locale of ["ko", "en"] as const) {
    const localeData = content[locale];
    if (!localeData.hero.videoUrl) localeData.hero.videoUrl = "";
    if (!localeData.company.chennaiOffice) {
      localeData.company.chennaiOffice =
        "28-B, CASA Grande Futura, Singaperumal Koil Road, Sriperumbudur, Kancheepuram, Tamil Nadu - 602105, India.";
    }
    if (!localeData.company.branchIndiaMapEmbed) {
      localeData.company.branchIndiaMapEmbed =
        "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1973.0562914194513!2d77.69682492859985!3d12.978534306050603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU4JzQyLjciTiA3N8KwNDEnNTAuOSJF!5e1!3m2!1sko!2sin!4v1790584743425!5m2!1sko!2sin";
    }
    if (!localeData.company.chennaiMapEmbed) {
      localeData.company.chennaiMapEmbed =
        "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1973.2628005165345!2d79.93732026970514!3d12.95249630619212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU3JzA5LjAiTiA3OcKwNTYnMTYuNyJF!5e1!3m2!1sko!2skr!4v1790449072251!5m2!1sko!2skr";
    }
    if (!localeData.hero.slides?.length) {
      localeData.hero.slides = defaultHeroSlides(locale);
    }
    if (!localeData.team) {
      localeData.team = {
        title: locale === "ko" ? "팀 소개" : "Our Team",
        lead: "",
        ceo: { name: "", role: "", bio: "", photo: "" },
        members: [],
      };
    }
    if (!localeData.media) {
      localeData.media = {
        title: locale === "ko" ? "현장 영상" : "Field Videos",
        lead: "",
        items: [],
      };
    }
    if (!localeData.gallery) {
      localeData.gallery = {
        title: locale === "ko" ? "갤러리" : "Gallery",
        lead: "",
        items: [],
      };
    }
    if (!localeData.clients) {
      const names = Array.from(
        new Set(
          (localeData.performances || [])
            .map((p) => p.client?.trim())
            .filter(Boolean),
        ),
      );
      localeData.clients = {
        title: locale === "ko" ? "고객사" : "Clients",
        lead:
          locale === "ko"
            ? "고객의 생산 현장에 필요한 압축공기 솔루션과 책임 있는 서비스로, 안정적인 설비 운영과 지속적인 성장을 함께합니다."
            : "With compressed air solutions and responsible service for production sites, we support stable equipment operation and grow together with our clients.",
        items: names.map((name, i) => ({
          id: `c-${i + 1}`,
          name,
          logo: "",
        })),
      };
    }
    localeData.services = ensureServicesContent(localeData.services, locale);
    localeData.history = (localeData.history || []).map((item, index) =>
      item.id ? item : { ...item, id: `h-${locale}-${index}` },
    );
    localeData.performances = (localeData.performances || []).map((item, index) =>
      item.id ? item : { ...item, id: `p-${locale}-${index}` },
    );
    localeData.performances = sortPerformances(localeData.performances, true);
  }

  return content;
}

export async function saveContent(content: SiteContent): Promise<void> {
  for (const locale of ["ko", "en"] as const) {
    content[locale].performances = sortPerformances(content[locale].performances, true);
  }
  const contentPath = contentFilePath();
  await ensureRuntimeContentFile();
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf-8");
}
