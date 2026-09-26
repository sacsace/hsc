export type Locale = "ko" | "en";

export type HistoryItem = { date: string; detail: string };
export type PerformanceItem = { date: string; detail: string; client: string };
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

/** Normalize date strings like 2022.04.30 / 2022-04-30 / Apr 2022 for sorting */
export function dateSortKey(date: string): number {
  const digits = date.replace(/[^\d]/g, "");
  if (digits.length >= 8) return Number(digits.slice(0, 8));
  if (digits.length >= 6) return Number(digits.padEnd(8, "0").slice(0, 8));
  if (digits.length >= 4) return Number(digits.padEnd(8, "0").slice(0, 8));
  return 0;
}

export function sortPerformances(items: PerformanceItem[], newestFirst = true): PerformanceItem[] {
  return [...items].sort((a, b) => {
    const diff = dateSortKey(a.date) - dateSortKey(b.date);
    return newestFirst ? -diff : diff;
  });
}
