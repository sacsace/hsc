import type {
  GalleryItem,
  HeroSlide,
  HistoryItem,
  LocaleContent,
  PerformanceItem,
  ServiceBrandItem,
  ServiceCategoryItem,
  ServiceCategoryLink,
  ServiceOfferingItem,
  ServiceProductItem,
  ServicesContent,
  TeamMember,
} from "@/lib/types";

function isBlank(value: unknown) {
  return typeof value !== "string" || !value.trim();
}

/**
 * If only one side has a value, copy it to the empty side.
 * If both are filled (or both empty), keep each value as-is.
 */
function fillBlank(a: string | undefined, b: string | undefined): [string, string] {
  const left = a || "";
  const right = b || "";
  if (!isBlank(left) && isBlank(right)) return [left, left];
  if (isBlank(left) && !isBlank(right)) return [right, right];
  return [left, right];
}

function syncIdLists<T extends { id: string }>(
  koList: T[] | undefined,
  enList: T[] | undefined,
  syncItem: (ko: T | undefined, en: T | undefined, id: string) => { ko: T; en: T },
): { ko: T[]; en: T[] } {
  const koItems = koList || [];
  const enItems = enList || [];
  const koMap = new Map(koItems.map((item) => [item.id, item]));
  const enMap = new Map(enItems.map((item) => [item.id, item]));
  const allIds = new Set<string>([...koMap.keys(), ...enMap.keys()]);

  const pairs = new Map<string, { ko: T; en: T }>();
  for (const id of allIds) {
    pairs.set(id, syncItem(koMap.get(id), enMap.get(id), id));
  }

  const koOut: T[] = [];
  const seenKo = new Set<string>();
  for (const item of koItems) {
    koOut.push(pairs.get(item.id)!.ko);
    seenKo.add(item.id);
  }
  for (const id of allIds) {
    if (!seenKo.has(id)) koOut.push(pairs.get(id)!.ko);
  }

  const enOut: T[] = [];
  const seenEn = new Set<string>();
  for (const item of enItems) {
    enOut.push(pairs.get(item.id)!.en);
    seenEn.add(item.id);
  }
  for (const id of allIds) {
    if (!seenEn.has(id)) enOut.push(pairs.get(id)!.en);
  }

  return { ko: koOut, en: enOut };
}

/** Pair by id when possible, otherwise by index (h-ko-* / h-en-*). */
function syncAlignedLists<T extends { id?: string }>(
  koList: T[] | undefined,
  enList: T[] | undefined,
  syncItem: (ko: T | undefined, en: T | undefined) => { ko: T; en: T },
): { ko: T[]; en: T[] } {
  const koItems = koList || [];
  const enItems = enList || [];
  const len = Math.max(koItems.length, enItems.length);
  const koOut: T[] = [];
  const enOut: T[] = [];

  const koById = new Map(
    koItems.filter((item) => item.id).map((item) => [item.id as string, item]),
  );
  const enById = new Map(
    enItems.filter((item) => item.id).map((item) => [item.id as string, item]),
  );
  const usedKo = new Set<string>();
  const usedEn = new Set<string>();

  for (let i = 0; i < len; i += 1) {
    let koItem = koItems[i];
    let enItem = enItems[i];

    if (koItem?.id && enById.has(koItem.id)) {
      enItem = enById.get(koItem.id);
      usedEn.add(koItem.id);
      usedKo.add(koItem.id);
    } else if (enItem?.id && koById.has(enItem.id)) {
      koItem = koById.get(enItem.id);
      usedKo.add(enItem.id);
      usedEn.add(enItem.id);
    } else {
      if (koItem?.id) usedKo.add(koItem.id);
      if (enItem?.id) usedEn.add(enItem.id);
    }

    const pair = syncItem(koItem, enItem);
    koOut.push(pair.ko);
    enOut.push(pair.en);
  }

  return { ko: koOut, en: enOut };
}

function syncHeroSlide(
  ko: HeroSlide | undefined,
  en: HeroSlide | undefined,
  id: string,
): { ko: HeroSlide; en: HeroSlide } {
  const base = ko || en;
  const type = (en?.type || ko?.type || "image") as HeroSlide["type"];
  const [srcKo, srcEn] = fillBlank(ko?.src, en?.src);
  const [labelKo, labelEn] = fillBlank(ko?.label, en?.label);
  const [brandKo, brandEn] = fillBlank(ko?.brand, en?.brand);
  const [headlineKo, headlineEn] = fillBlank(ko?.headline, en?.headline);
  const [subKo, subEn] = fillBlank(ko?.subheadline, en?.subheadline);
  const [ctaKo, ctaEn] = fillBlank(ko?.ctaLabel, en?.ctaLabel);
  const [hrefKo, hrefEn] = fillBlank(ko?.ctaHref, en?.ctaHref);

  const slideKo: HeroSlide = {
    id,
    type,
    src: srcKo,
    label: labelKo,
    brand: brandKo,
    headline: headlineKo,
    subheadline: subKo,
    ctaLabel: ctaKo,
    ctaHref: hrefKo || base?.ctaHref || "/contact",
  };
  const slideEn: HeroSlide = {
    id,
    type,
    src: srcEn,
    label: labelEn,
    brand: brandEn,
    headline: headlineEn,
    subheadline: subEn,
    ctaLabel: ctaEn,
    ctaHref: hrefEn || base?.ctaHref || "/contact",
  };
  return { ko: slideKo, en: slideEn };
}

function syncProduct(
  ko: ServiceProductItem | undefined,
  en: ServiceProductItem | undefined,
  id: string,
): { ko: ServiceProductItem; en: ServiceProductItem } {
  const [titleKo, titleEn] = fillBlank(ko?.title, en?.title);
  const [imageKo, imageEn] = fillBlank(ko?.image, en?.image);
  const [descKo, descEn] = fillBlank(ko?.description, en?.description);
  const [fileKo, fileEn] = fillBlank(ko?.file, en?.file);
  const [fileNameKo, fileNameEn] = fillBlank(ko?.fileName, en?.fileName);
  return {
    ko: {
      id,
      title: titleKo,
      image: imageKo,
      description: descKo,
      file: fileKo,
      fileName: fileNameKo,
    },
    en: {
      id,
      title: titleEn,
      image: imageEn,
      description: descEn,
      file: fileEn,
      fileName: fileNameEn,
    },
  };
}

function syncBrand(
  ko: ServiceBrandItem | undefined,
  en: ServiceBrandItem | undefined,
  id: string,
): { ko: ServiceBrandItem; en: ServiceBrandItem } {
  const [slugKo, slugEn] = fillBlank(ko?.slug, en?.slug);
  const [brandKo, brandEn] = fillBlank(ko?.brand, en?.brand);
  const [folderKo, folderEn] = fillBlank(ko?.folder, en?.folder);
  const [leadKo, leadEn] = fillBlank(ko?.lead, en?.lead);
  const products = syncIdLists(ko?.products, en?.products, syncProduct);
  const slug = slugKo || slugEn || id;
  return {
    ko: {
      id,
      slug,
      brand: brandKo,
      folder: folderKo,
      lead: leadKo,
      products: products.ko,
    },
    en: {
      id,
      slug: slugEn || slug,
      brand: brandEn,
      folder: folderEn,
      lead: leadEn,
      products: products.en,
    },
  };
}

function syncOffering(
  ko: ServiceOfferingItem | undefined,
  en: ServiceOfferingItem | undefined,
  id: string,
): { ko: ServiceOfferingItem; en: ServiceOfferingItem } {
  const [titleKo, titleEn] = fillBlank(ko?.title, en?.title);
  const [descKo, descEn] = fillBlank(ko?.description, en?.description);
  return {
    ko: { id, title: titleKo, description: descKo },
    en: { id, title: titleEn, description: descEn },
  };
}

function syncCategoryLinks(
  koLinks: ServiceCategoryLink[] | undefined,
  enLinks: ServiceCategoryLink[] | undefined,
): { ko: ServiceCategoryLink[]; en: ServiceCategoryLink[] } {
  const koItems = koLinks || [];
  const enItems = enLinks || [];
  const bySlug = new Map<string, { ko?: ServiceCategoryLink; en?: ServiceCategoryLink }>();
  for (const link of koItems) {
    if (!link.slug) continue;
    bySlug.set(link.slug, { ...(bySlug.get(link.slug) || {}), ko: link });
  }
  for (const link of enItems) {
    if (!link.slug) continue;
    bySlug.set(link.slug, { ...(bySlug.get(link.slug) || {}), en: link });
  }

  const koOut: ServiceCategoryLink[] = [];
  const enOut: ServiceCategoryLink[] = [];
  const seen = new Set<string>();

  for (const link of koItems) {
    const pair = bySlug.get(link.slug) || { ko: link };
    const [labelKo, labelEn] = fillBlank(pair.ko?.label, pair.en?.label);
    const slug = pair.ko?.slug || pair.en?.slug || link.slug;
    koOut.push({ label: labelKo, slug });
    enOut.push({ label: labelEn, slug });
    seen.add(slug);
  }
  for (const link of enItems) {
    if (seen.has(link.slug)) continue;
    const pair = bySlug.get(link.slug) || { en: link };
    const [labelKo, labelEn] = fillBlank(pair.ko?.label, pair.en?.label);
    const slug = pair.en?.slug || pair.ko?.slug || link.slug;
    koOut.push({ label: labelKo, slug });
    enOut.push({ label: labelEn, slug });
  }
  return { ko: koOut, en: enOut };
}

function syncCategory(
  ko: ServiceCategoryItem | undefined,
  en: ServiceCategoryItem | undefined,
  id: string,
): { ko: ServiceCategoryItem; en: ServiceCategoryItem } {
  const [titleKo, titleEn] = fillBlank(ko?.title, en?.title);
  const [descKo, descEn] = fillBlank(ko?.description, en?.description);
  const [fileKo, fileEn] = fillBlank(ko?.file, en?.file);
  const [fileNameKo, fileNameEn] = fillBlank(ko?.fileName, en?.fileName);
  const links = syncCategoryLinks(ko?.items, en?.items);
  return {
    ko: {
      id,
      title: titleKo,
      description: descKo,
      items: links.ko,
      file: fileKo,
      fileName: fileNameKo,
    },
    en: {
      id,
      title: titleEn,
      description: descEn,
      items: links.en,
      file: fileEn,
      fileName: fileNameEn,
    },
  };
}

function syncServices(
  ko: ServicesContent | undefined,
  en: ServicesContent | undefined,
): { ko: ServicesContent; en: ServicesContent } {
  const keys = [
    "label",
    "title",
    "lead",
    "offeringsLabel",
    "offeringsTitle",
    "offeringsLead",
    "equipmentLabel",
    "equipmentTitle",
    "equipmentLead",
    "viewDocs",
    "ctaTitle",
    "ctaLead",
    "ctaButton",
  ] as const;

  const koOut = { ...(ko || ({} as ServicesContent)) };
  const enOut = { ...(en || ({} as ServicesContent)) };
  for (const key of keys) {
    const [left, right] = fillBlank(ko?.[key], en?.[key]);
    koOut[key] = left;
    enOut[key] = right;
  }

  const offerings = syncIdLists(ko?.offerings, en?.offerings, syncOffering);
  const brands = syncIdLists(ko?.brands, en?.brands, syncBrand);
  const categories = syncIdLists(ko?.categories, en?.categories, syncCategory);

  koOut.offerings = offerings.ko;
  enOut.offerings = offerings.en;
  koOut.brands = brands.ko;
  enOut.brands = brands.en;
  koOut.categories = categories.ko;
  enOut.categories = categories.en;

  return { ko: koOut, en: enOut };
}

function syncTeamMember(
  ko: TeamMember | undefined,
  en: TeamMember | undefined,
): { ko: TeamMember; en: TeamMember } {
  const [nameKo, nameEn] = fillBlank(ko?.name, en?.name);
  const [roleKo, roleEn] = fillBlank(ko?.role, en?.role);
  const [bioKo, bioEn] = fillBlank(ko?.bio, en?.bio);
  const [photoKo, photoEn] = fillBlank(ko?.photo, en?.photo);
  return {
    ko: { name: nameKo, role: roleKo, bio: bioKo, photo: photoKo },
    en: { name: nameEn, role: roleEn, bio: bioEn, photo: photoEn },
  };
}

function syncHistory(
  ko: HistoryItem | undefined,
  en: HistoryItem | undefined,
): { ko: HistoryItem; en: HistoryItem } {
  const [dateKo, dateEn] = fillBlank(ko?.date, en?.date);
  const [detailKo, detailEn] = fillBlank(ko?.detail, en?.detail);
  const id = ko?.id || en?.id;
  return {
    ko: { id, date: dateKo, detail: detailKo },
    en: { id, date: dateEn, detail: detailEn },
  };
}

function syncPerformance(
  ko: PerformanceItem | undefined,
  en: PerformanceItem | undefined,
): { ko: PerformanceItem; en: PerformanceItem } {
  const [dateKo, dateEn] = fillBlank(ko?.date, en?.date);
  const [detailKo, detailEn] = fillBlank(ko?.detail, en?.detail);
  const [clientKo, clientEn] = fillBlank(ko?.client, en?.client);
  const id = ko?.id || en?.id;
  return {
    ko: { id, date: dateKo, detail: detailKo, client: clientKo },
    en: { id, date: dateEn, detail: detailEn, client: clientEn },
  };
}

function syncGalleryItem(
  ko: GalleryItem | undefined,
  en: GalleryItem | undefined,
  id: string,
): { ko: GalleryItem; en: GalleryItem } {
  const [titleKo, titleEn] = fillBlank(ko?.title, en?.title);
  const [imageKo, imageEn] = fillBlank(ko?.image, en?.image);
  const [captionKo, captionEn] = fillBlank(ko?.caption, en?.caption);
  return {
    ko: { id, title: titleKo, image: imageKo, caption: captionKo },
    en: { id, title: titleEn, image: imageEn, caption: captionEn },
  };
}

function syncClientItem(
  ko: { id: string; name: string; logo: string } | undefined,
  en: { id: string; name: string; logo: string } | undefined,
  id: string,
): { ko: { id: string; name: string; logo: string }; en: { id: string; name: string; logo: string } } {
  const [nameKo, nameEn] = fillBlank(ko?.name, en?.name);
  const [logoKo, logoEn] = fillBlank(ko?.logo, en?.logo);
  return {
    ko: { id, name: nameKo, logo: logoKo },
    en: { id, name: nameEn, logo: logoEn },
  };
}

/**
 * Bidirectional locale sync:
 * - empty side inherits the filled side
 * - when both sides already have values, keep each as-is
 */
export function syncLocalePair(
  ko: LocaleContent,
  en: LocaleContent,
): { ko: LocaleContent; en: LocaleContent } {
  const [heroBrandKo, heroBrandEn] = fillBlank(ko.hero?.brand, en.hero?.brand);
  const [heroHeadlineKo, heroHeadlineEn] = fillBlank(ko.hero?.headline, en.hero?.headline);
  const [heroSubKo, heroSubEn] = fillBlank(ko.hero?.subheadline, en.hero?.subheadline);
  const [heroCtaKo, heroCtaEn] = fillBlank(ko.hero?.ctaLabel, en.hero?.ctaLabel);
  const [heroHrefKo, heroHrefEn] = fillBlank(ko.hero?.ctaHref, en.hero?.ctaHref);
  const [heroVideoKo, heroVideoEn] = fillBlank(ko.hero?.videoUrl, en.hero?.videoUrl);
  const slides = syncIdLists(ko.hero?.slides, en.hero?.slides, syncHeroSlide);

  const [greetTitleKo, greetTitleEn] = fillBlank(ko.greeting?.title, en.greeting?.title);
  const [greetBodyKo, greetBodyEn] = fillBlank(ko.greeting?.body, en.greeting?.body);

  const companyKeys = [
    "legalName",
    "founded",
    "employees",
    "businessType",
    "businessItem",
    "hqKorea",
    "branchIndia",
    "branchIndiaMapEmbed",
    "chennaiOffice",
    "chennaiMapEmbed",
    "cin",
    "pan",
    "tan",
    "email",
    "phone",
  ] as const;
  const companyKo = { ...(ko.company || {}) } as LocaleContent["company"];
  const companyEn = { ...(en.company || {}) } as LocaleContent["company"];
  for (const key of companyKeys) {
    const [left, right] = fillBlank(ko.company?.[key], en.company?.[key]);
    companyKo[key] = left;
    companyEn[key] = right;
  }

  const history = syncAlignedLists(ko.history, en.history, syncHistory);
  const performances = syncAlignedLists(ko.performances, en.performances, syncPerformance);
  const clients = syncIdLists(ko.clients?.items, en.clients?.items, syncClientItem);
  const [clientsTitleKo, clientsTitleEn] = fillBlank(ko.clients?.title, en.clients?.title);
  const [clientsLeadKo, clientsLeadEn] = fillBlank(ko.clients?.lead, en.clients?.lead);

  const [teamTitleKo, teamTitleEn] = fillBlank(ko.team?.title, en.team?.title);
  const [teamLeadKo, teamLeadEn] = fillBlank(ko.team?.lead, en.team?.lead);
  const ceo = syncTeamMember(ko.team?.ceo, en.team?.ceo);
  const members = syncAlignedLists(ko.team?.members, en.team?.members, syncTeamMember);

  const [mediaTitleKo, mediaTitleEn] = fillBlank(ko.media?.title, en.media?.title);
  const [mediaLeadKo, mediaLeadEn] = fillBlank(ko.media?.lead, en.media?.lead);
  const mediaItems = syncAlignedLists(ko.media?.items, en.media?.items, (a, b) => {
    const [titleKo, titleEn] = fillBlank(a?.title, b?.title);
    const [descKo, descEn] = fillBlank(a?.description, b?.description);
    const [urlKo, urlEn] = fillBlank(a?.videoUrl, b?.videoUrl);
    return {
      ko: { title: titleKo, description: descKo, videoUrl: urlKo },
      en: { title: titleEn, description: descEn, videoUrl: urlEn },
    };
  });

  const gallery = syncIdLists(ko.gallery?.items, en.gallery?.items, syncGalleryItem);
  const [galleryTitleKo, galleryTitleEn] = fillBlank(ko.gallery?.title, en.gallery?.title);
  const [galleryLeadKo, galleryLeadEn] = fillBlank(ko.gallery?.lead, en.gallery?.lead);

  const affiliateKeys = ["name", "tel", "fax", "email", "website"] as const;
  const affiliateKo = { ...(ko.affiliate || {}) } as LocaleContent["affiliate"];
  const affiliateEn = { ...(en.affiliate || {}) } as LocaleContent["affiliate"];
  for (const key of affiliateKeys) {
    const [left, right] = fillBlank(ko.affiliate?.[key], en.affiliate?.[key]);
    affiliateKo[key] = left;
    affiliateEn[key] = right;
  }

  const certificates = syncAlignedLists(ko.certificates, en.certificates, (a, b) => {
    const [titleKo, titleEn] = fillBlank(a?.title, b?.title);
    const [imageKo, imageEn] = fillBlank(a?.image, b?.image);
    return {
      ko: { title: titleKo, image: imageKo },
      en: { title: titleEn, image: imageEn },
    };
  });

  const services = syncServices(ko.services, en.services);

  return {
    ko: {
      ...ko,
      hero: {
        brand: heroBrandKo,
        headline: heroHeadlineKo,
        subheadline: heroSubKo,
        ctaLabel: heroCtaKo,
        ctaHref: heroHrefKo,
        videoUrl: heroVideoKo,
        slides: slides.ko,
      },
      greeting: { title: greetTitleKo, body: greetBodyKo },
      company: companyKo,
      history: history.ko,
      performances: performances.ko,
      clients: {
        title: clientsTitleKo,
        lead: clientsLeadKo,
        items: clients.ko,
      },
      team: {
        title: teamTitleKo,
        lead: teamLeadKo,
        ceo: ceo.ko,
        members: members.ko,
      },
      media: {
        title: mediaTitleKo,
        lead: mediaLeadKo,
        items: mediaItems.ko,
      },
      gallery: {
        title: galleryTitleKo,
        lead: galleryLeadKo,
        items: gallery.ko,
      },
      affiliate: affiliateKo,
      certificates: certificates.ko,
      services: services.ko,
    },
    en: {
      ...en,
      hero: {
        brand: heroBrandEn,
        headline: heroHeadlineEn,
        subheadline: heroSubEn,
        ctaLabel: heroCtaEn,
        ctaHref: heroHrefEn,
        videoUrl: heroVideoEn,
        slides: slides.en,
      },
      greeting: { title: greetTitleEn, body: greetBodyEn },
      company: companyEn,
      history: history.en,
      performances: performances.en,
      clients: {
        title: clientsTitleEn,
        lead: clientsLeadEn,
        items: clients.en,
      },
      team: {
        title: teamTitleEn,
        lead: teamLeadEn,
        ceo: ceo.en,
        members: members.en,
      },
      media: {
        title: mediaTitleEn,
        lead: mediaLeadEn,
        items: mediaItems.en,
      },
      gallery: {
        title: galleryTitleEn,
        lead: galleryLeadEn,
        items: gallery.en,
      },
      affiliate: affiliateEn,
      certificates: certificates.en,
      services: services.en,
    },
  };
}

/** @deprecated Prefer syncLocalePair — kept for callers that only need KO filled from EN. */
export function seedKoreanFromEnglish(
  ko: LocaleContent,
  en: LocaleContent,
): LocaleContent {
  return syncLocalePair(ko, en).ko;
}
