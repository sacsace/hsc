import { promises as fs } from "fs";
import path from "path";
import { sortPerformances, type SiteContent } from "@/lib/types";

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

const contentPath = path.join(process.cwd(), "data", "content.json");

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(contentPath, "utf-8");
  const content = JSON.parse(raw) as SiteContent;

  for (const locale of ["ko", "en"] as const) {
    const localeData = content[locale];
    if (!localeData.hero.videoUrl) localeData.hero.videoUrl = "";
    if (!localeData.company.chennaiOffice) {
      localeData.company.chennaiOffice =
        "28-B, CASA Grande Futura, Singaperumal Koil Road, Sriperumbudur, Kancheepuram, Tamil Nadu - 602105, India.";
    }
    if (!localeData.company.chennaiMapEmbed) {
      localeData.company.chennaiMapEmbed =
        "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1973.2628005165345!2d79.93732026970514!3d12.95249630619212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU3JzA5LjAiTiA3OcKwNTYnMTYuNyJF!5e1!3m2!1sko!2skr!4v1790449072251!5m2!1sko!2skr";
    }
    if (!localeData.hero.slides?.length) {
      localeData.hero.slides =
        locale === "ko"
          ? [
              {
                id: "slide-compressor",
                type: "video",
                src: "/videos/air-compressor.mp4",
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
                type: "image",
                src: "/images/slide-2.png",
                label: "컴프레서 설비",
                brand: "Reliable Service",
                headline: "안정적인 설비 운영",
                subheadline:
                  "산업 현장의 컴프레서 설비를 점검하고, 생산이 멈추지 않도록 신속하고 정확한 서비스를 제공합니다.",
                ctaLabel: "실적 보기",
                ctaHref: "#performance",
              },
              {
                id: "slide-pipe",
                type: "video",
                src: "/videos/pipe.mp4",
                label: "배관",
                brand: "Engineering",
                headline: "배관과 엔지니어링",
                subheadline:
                  "압축공기 배관 설계부터 시공·유지관리까지, 현장 맞춤형 엔지니어링 솔루션을 지원합니다.",
                ctaLabel: "회사 소개",
                ctaHref: "/about",
              },
            ]
          : [
              {
                id: "slide-compressor",
                type: "video",
                src: "/videos/air-compressor.mp4",
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
                type: "image",
                src: "/images/slide-2.png",
                label: "Compressor Facility",
                brand: "Reliable Service",
                headline: "Keep Operations Running",
                subheadline:
                  "We inspect and service compressor facilities so your production stays stable and efficient.",
                ctaLabel: "View Performance",
                ctaHref: "#performance",
              },
              {
                id: "slide-pipe",
                type: "video",
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
            ? "함께 성장해 온 주요 고객사입니다."
            : "Partners we have worked with.",
        items: names.map((name, i) => ({
          id: `c-${i + 1}`,
          name,
          logo: "",
        })),
      };
    }
    localeData.performances = sortPerformances(localeData.performances, true);
  }

  return content;
}

export async function saveContent(content: SiteContent): Promise<void> {
  for (const locale of ["ko", "en"] as const) {
    content[locale].performances = sortPerformances(content[locale].performances, true);
  }
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf-8");
}
