import type {
  GalleryItem,
  HeroSlide,
  HistoryItem,
  LocaleContent,
  PerformanceItem,
  ServiceBrandItem,
  ServiceCategoryItem,
  ServiceOfferingItem,
  ServiceProductItem,
  ServicesContent,
  TeamMember,
} from "@/lib/types";

function isBlank(value: unknown) {
  return typeof value !== "string" || !value.trim();
}

/** Prefer Korean text when present; otherwise fall back to English. */
function text(ko: string | undefined, en: string | undefined) {
  if (!isBlank(ko)) return ko as string;
  return (en || "").trim() ? (en as string) : ko || "";
}

/** Shared media / URL fields follow English when English has a value. */
function media(ko: string | undefined, en: string | undefined) {
  if (!isBlank(en)) return en as string;
  return ko || "";
}

function seedHeroSlide(ko: HeroSlide | undefined, en: HeroSlide): HeroSlide {
  return {
    id: en.id,
    type: en.type,
    src: media(ko?.src, en.src),
    label: text(ko?.label, en.label),
    brand: text(ko?.brand, en.brand),
    headline: text(ko?.headline, en.headline),
    subheadline: text(ko?.subheadline, en.subheadline),
    ctaLabel: text(ko?.ctaLabel, en.ctaLabel),
    ctaHref: media(ko?.ctaHref, en.ctaHref),
  };
}

function seedProduct(ko: ServiceProductItem | undefined, en: ServiceProductItem): ServiceProductItem {
  return {
    id: en.id,
    title: text(ko?.title, en.title),
    image: media(ko?.image, en.image),
    description: text(ko?.description, en.description),
  };
}

function seedBrand(ko: ServiceBrandItem | undefined, en: ServiceBrandItem): ServiceBrandItem {
  const koProducts = new Map((ko?.products || []).map((item) => [item.id, item]));
  return {
    id: en.id,
    slug: media(ko?.slug, en.slug) || en.slug,
    brand: text(ko?.brand, en.brand),
    folder: text(ko?.folder, en.folder),
    lead: text(ko?.lead, en.lead),
    products: (en.products || []).map((product) =>
      seedProduct(koProducts.get(product.id), product),
    ),
  };
}

function seedOffering(
  ko: ServiceOfferingItem | undefined,
  en: ServiceOfferingItem,
): ServiceOfferingItem {
  return {
    id: en.id,
    title: text(ko?.title, en.title),
    description: text(ko?.description, en.description),
  };
}

function seedCategory(
  ko: ServiceCategoryItem | undefined,
  en: ServiceCategoryItem,
): ServiceCategoryItem {
  return {
    id: en.id,
    title: text(ko?.title, en.title),
    description: text(ko?.description, en.description),
    items: (en.items || []).map((link, index) => {
      const prev = ko?.items?.[index];
      return {
        label: text(prev?.label, link.label),
        slug: media(prev?.slug, link.slug) || link.slug,
      };
    }),
  };
}

function seedServices(ko: ServicesContent | undefined, en: ServicesContent): ServicesContent {
  const koBrands = new Map((ko?.brands || []).map((item) => [item.id, item]));
  const koOfferings = new Map((ko?.offerings || []).map((item) => [item.id, item]));
  const koCategories = new Map((ko?.categories || []).map((item) => [item.id, item]));

  return {
    label: text(ko?.label, en.label),
    title: text(ko?.title, en.title),
    lead: text(ko?.lead, en.lead),
    offeringsLabel: text(ko?.offeringsLabel, en.offeringsLabel),
    offeringsTitle: text(ko?.offeringsTitle, en.offeringsTitle),
    offeringsLead: text(ko?.offeringsLead, en.offeringsLead),
    equipmentLabel: text(ko?.equipmentLabel, en.equipmentLabel),
    equipmentTitle: text(ko?.equipmentTitle, en.equipmentTitle),
    equipmentLead: text(ko?.equipmentLead, en.equipmentLead),
    viewDocs: text(ko?.viewDocs, en.viewDocs),
    ctaTitle: text(ko?.ctaTitle, en.ctaTitle),
    ctaLead: text(ko?.ctaLead, en.ctaLead),
    ctaButton: text(ko?.ctaButton, en.ctaButton),
    offerings: (en.offerings || []).map((item) =>
      seedOffering(koOfferings.get(item.id), item),
    ),
    brands: (en.brands || []).map((item) => seedBrand(koBrands.get(item.id), item)),
    categories: (en.categories || []).map((item) =>
      seedCategory(koCategories.get(item.id), item),
    ),
  };
}

function seedTeamMember(ko: TeamMember | undefined, en: TeamMember): TeamMember {
  return {
    name: text(ko?.name, en.name),
    role: text(ko?.role, en.role),
    bio: text(ko?.bio, en.bio),
    photo: media(ko?.photo, en.photo),
  };
}

function seedHistory(ko: HistoryItem | undefined, en: HistoryItem): HistoryItem {
  return {
    id: en.id || ko?.id,
    date: text(ko?.date, en.date),
    detail: text(ko?.detail, en.detail),
  };
}

function seedPerformance(
  ko: PerformanceItem | undefined,
  en: PerformanceItem,
): PerformanceItem {
  return {
    id: en.id || ko?.id,
    date: text(ko?.date, en.date),
    detail: text(ko?.detail, en.detail),
    client: text(ko?.client, en.client),
  };
}

function seedGalleryItem(ko: GalleryItem | undefined, en: GalleryItem): GalleryItem {
  return {
    id: en.id,
    title: text(ko?.title, en.title),
    image: media(ko?.image, en.image),
    caption: text(ko?.caption, en.caption),
  };
}

/**
 * When English is edited, fill empty Korean fields with the English values
 * and keep shared media/structure aligned with English order.
 */
export function seedKoreanFromEnglish(
  ko: LocaleContent,
  en: LocaleContent,
): LocaleContent {
  const koSlides = new Map((ko.hero?.slides || []).map((item) => [item.id, item]));
  const koHistory = new Map(
    (ko.history || [])
      .filter((item) => item.id)
      .map((item) => [item.id as string, item]),
  );
  const koPerformances = new Map(
    (ko.performances || [])
      .filter((item) => item.id)
      .map((item) => [item.id as string, item]),
  );
  const koClients = new Map((ko.clients?.items || []).map((item) => [item.id, item]));
  const koMembers = new Map(
    (ko.team?.members || []).map((item, index) => [item.name || `m-${index}`, item]),
  );
  const koGallery = new Map((ko.gallery?.items || []).map((item) => [item.id, item]));
  const koMedia = new Map(
    (ko.media?.items || []).map((item, index) => [item.title || `media-${index}`, item]),
  );
  const koCerts = new Map(
    (ko.certificates || []).map((item, index) => [item.title || `cert-${index}`, item]),
  );

  return {
    ...ko,
    hero: {
      brand: text(ko.hero?.brand, en.hero?.brand),
      headline: text(ko.hero?.headline, en.hero?.headline),
      subheadline: text(ko.hero?.subheadline, en.hero?.subheadline),
      ctaLabel: text(ko.hero?.ctaLabel, en.hero?.ctaLabel),
      ctaHref: media(ko.hero?.ctaHref, en.hero?.ctaHref),
      videoUrl: media(ko.hero?.videoUrl, en.hero?.videoUrl),
      slides: (en.hero?.slides || []).map((slide) =>
        seedHeroSlide(koSlides.get(slide.id), slide),
      ),
    },
    greeting: {
      title: text(ko.greeting?.title, en.greeting?.title),
      body: text(ko.greeting?.body, en.greeting?.body),
    },
    company: {
      legalName: text(ko.company?.legalName, en.company?.legalName),
      founded: text(ko.company?.founded, en.company?.founded),
      employees: text(ko.company?.employees, en.company?.employees),
      businessType: text(ko.company?.businessType, en.company?.businessType),
      businessItem: text(ko.company?.businessItem, en.company?.businessItem),
      hqKorea: text(ko.company?.hqKorea, en.company?.hqKorea),
      branchIndia: text(ko.company?.branchIndia, en.company?.branchIndia),
      branchIndiaMapEmbed: media(
        ko.company?.branchIndiaMapEmbed,
        en.company?.branchIndiaMapEmbed,
      ),
      chennaiOffice: text(ko.company?.chennaiOffice, en.company?.chennaiOffice),
      chennaiMapEmbed: media(ko.company?.chennaiMapEmbed, en.company?.chennaiMapEmbed),
      cin: media(ko.company?.cin, en.company?.cin),
      pan: media(ko.company?.pan, en.company?.pan),
      tan: media(ko.company?.tan, en.company?.tan),
      email: media(ko.company?.email, en.company?.email),
      phone: media(ko.company?.phone, en.company?.phone),
    },
    history: (en.history || []).map((item, index) =>
      seedHistory(
        (item.id && koHistory.get(item.id)) || ko.history?.[index],
        item,
      ),
    ),
    performances: (en.performances || []).map((item, index) =>
      seedPerformance(
        (item.id && koPerformances.get(item.id)) || ko.performances?.[index],
        item,
      ),
    ),
    clients: {
      title: text(ko.clients?.title, en.clients?.title),
      lead: text(ko.clients?.lead, en.clients?.lead),
      items: (en.clients?.items || []).map((item) => {
        const prev = koClients.get(item.id);
        return {
          id: item.id,
          name: text(prev?.name, item.name),
          logo: media(prev?.logo, item.logo),
        };
      }),
    },
    team: {
      title: text(ko.team?.title, en.team?.title),
      lead: text(ko.team?.lead, en.team?.lead),
      ceo: seedTeamMember(ko.team?.ceo, en.team?.ceo || { name: "", role: "", bio: "", photo: "" }),
      members: (en.team?.members || []).map((item, index) =>
        seedTeamMember(koMembers.get(item.name) || ko.team?.members?.[index], item),
      ),
    },
    media: {
      title: text(ko.media?.title, en.media?.title),
      lead: text(ko.media?.lead, en.media?.lead),
      items: (en.media?.items || []).map((item, index) => {
        const prev = koMedia.get(item.title) || ko.media?.items?.[index];
        return {
          title: text(prev?.title, item.title),
          description: text(prev?.description, item.description),
          videoUrl: media(prev?.videoUrl, item.videoUrl),
        };
      }),
    },
    gallery: {
      title: text(ko.gallery?.title, en.gallery?.title),
      lead: text(ko.gallery?.lead, en.gallery?.lead),
      items: (en.gallery?.items || []).map((item) =>
        seedGalleryItem(koGallery.get(item.id), item),
      ),
    },
    affiliate: {
      name: text(ko.affiliate?.name, en.affiliate?.name),
      tel: media(ko.affiliate?.tel, en.affiliate?.tel),
      fax: media(ko.affiliate?.fax, en.affiliate?.fax),
      email: media(ko.affiliate?.email, en.affiliate?.email),
      website: media(ko.affiliate?.website, en.affiliate?.website),
    },
    certificates: (en.certificates || []).map((item, index) => {
      const prev = koCerts.get(item.title) || ko.certificates?.[index];
      return {
        title: text(prev?.title, item.title),
        image: media(prev?.image, item.image),
      };
    }),
    services: seedServices(ko.services, en.services),
  };
}
