export type Locale = "ko" | "en";

export type HistoryItem = { id?: string; date: string; detail: string };
export type PerformanceItem = { id?: string; date: string; detail: string; client: string };
export type CertificateItem = { title: string; image: string };
export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  caption: string;
};
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
};

export type HeroSlide = {
  id: string;
  type: "image" | "video";
  src: string;
  label: string;
  brand: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ClientItem = {
  id: string;
  name: string;
  logo: string;
};

export type LocaleContent = {
  hero: {
    brand: string;
    headline: string;
    subheadline: string;
    ctaLabel: string;
    ctaHref: string;
    videoUrl: string;
    slides: HeroSlide[];
  };
  greeting: {
    title: string;
    body: string;
  };
  company: {
    legalName: string;
    founded: string;
    employees: string;
    businessType: string;
    businessItem: string;
    hqKorea: string;
    branchIndia: string;
    chennaiOffice: string;
    chennaiMapEmbed: string;
    cin: string;
    pan: string;
    tan: string;
    email: string;
    phone: string;
  };
  history: HistoryItem[];
  performances: PerformanceItem[];
  clients: {
    title: string;
    lead: string;
    items: ClientItem[];
  };
  team: {
    title: string;
    lead: string;
    ceo: TeamMember;
    members: TeamMember[];
  };
  media: {
    title: string;
    lead: string;
    items: { title: string; description: string; videoUrl: string }[];
  };
  gallery: {
    title: string;
    lead: string;
    items: GalleryItem[];
  };
  affiliate: {
    name: string;
    tel: string;
    fax: string;
    email: string;
    website: string;
  };
  certificates: CertificateItem[];
};

export type SiteContent = {
  ko: LocaleContent;
  en: LocaleContent;
};

/** Normalize date strings like 2022.04.30 / 2022-4-30 / 2022.4 for sorting */
export function dateSortKey(date: string): number {
  const parts = date
    .trim()
    .split(/[^\d]+/)
    .filter(Boolean)
    .map((part) => Number(part));

  if (!parts.length || Number.isNaN(parts[0])) return 0;

  const year = parts[0];
  const month = parts.length >= 2 ? Math.min(Math.max(parts[1], 1), 12) : 1;
  const day = parts.length >= 3 ? Math.min(Math.max(parts[2], 1), 31) : 1;

  if (year < 1000 || year > 9999) {
    // Fallback for compact digits like 20220430
    const digits = date.replace(/[^\d]/g, "");
    if (digits.length >= 8) return Number(digits.slice(0, 8));
    if (digits.length >= 6) {
      const y = digits.slice(0, 4);
      const m = digits.slice(4, 6).padStart(2, "0");
      const d = (digits.slice(6, 8) || "01").padStart(2, "0");
      return Number(`${y}${m}${d}`);
    }
    return 0;
  }

  return year * 10000 + month * 100 + day;
}

export function sortPerformances(items: PerformanceItem[], newestFirst = true): PerformanceItem[] {
  return [...items].sort((a, b) => {
    const diff = dateSortKey(a.date) - dateSortKey(b.date);
    if (diff !== 0) return newestFirst ? -diff : diff;
    return newestFirst
      ? compareStable(b.detail, a.detail)
      : compareStable(a.detail, b.detail);
  });
}

function compareStable(a: string, b: string) {
  return (a || "").localeCompare(b || "", undefined, { sensitivity: "base", numeric: true });
}
