import type { Locale } from "@/lib/types";

export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_STORAGE_KEY = "hsc_locale";

export type UiCopy = {
  nav: {
    about: string;
    company: string;
    history: string;
    performance: string;
    clients: string;
    team: string;
    gallery: string;
    contact: string;
  };
  menu: string;
  learnMore: string;
  aboutLabel: string;
  aboutPageLabel: string;
  aboutPageTitle: string;
  aboutPageLead: string;
  companyLabel: string;
  companyTitle: string;
  companyLead: string;
  fields: {
    legalName: string;
    founded: string;
    employees: string;
    businessType: string;
    businessItem: string;
    hqKorea: string;
    branchIndia: string;
    chennaiOffice: string;
    cin: string;
    email: string;
  };
  historyLabel: string;
  historyTitle: string;
  historyLead: string;
  performanceLabel: string;
  performanceTitle: string;
  performanceLead: string;
  table: {
    date: string;
    details: string;
    client: string;
  };
  galleryLabel: string;
  galleryTitle: string;
  galleryLead: string;
  galleryClose: string;
  teamLabel: string;
  teamTitle: string;
  teamLead: string;
  teamCeoLabel: string;
  teamMembersLabel: string;
  teamEmpty: string;
  certLabel: string;
  certTitle: string;
  certSearch: string;
  certSearchPlaceholder: string;
  certNoResults: string;
  certTotalCount: (n: number) => string;
  certResultCount: (shown: number, total: number) => string;
  certViewCard: string;
  certViewList: string;
  familyLabel: string;
  familyLead: string;
  contactLabel: string;
  contactTitle: string;
  contactLead: string;
  clientsLabel: string;
  clientsTitle: string;
  clientsLead: string;
  clientsEmpty: string;
  clientsSearch: string;
  clientsSearchPlaceholder: string;
  clientsNoResults: string;
  clientsTotalCount: (n: number) => string;
  clientsResultCount: (shown: number, total: number) => string;
  viewMore: string;
  viewMoreClients: string;
  viewMorePerformance: string;
  performanceEmpty: string;
  performanceSearch: string;
  performanceSearchPlaceholder: string;
  performanceNoResults: string;
  performanceTotalCount: (n: number) => string;
  performanceResultCount: (shown: number, total: number) => string;
  gallerySearch: string;
  gallerySearchPlaceholder: string;
  galleryNoResults: string;
  galleryTotalCount: (n: number) => string;
  galleryResultCount: (shown: number, total: number) => string;
  galleryViewCard: string;
  galleryViewList: string;
  contactCta: string;
  contactForm: {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    companyPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
  footerTagline: string;
  footerRights: string;
  developedBy: string;
  footerAdmin: string;
  footerMvs: string;
  heroImageAlt: string;
  slidePrev: string;
  slideNext: string;
  openInMaps: string;
};

export const ui: Record<Locale, UiCopy> = {
  ko: {
    nav: {
      about: "회사소개",
      company: "회사정보",
      history: "연혁",
      performance: "실적",
      clients: "고객사",
      team: "팀원",
      gallery: "갤러리",
      contact: "문의",
    },
    menu: "메뉴",
    learnMore: "더 알아보기",
    aboutLabel: "인사말",
    aboutPageLabel: "About",
    aboutPageTitle: "회사 소개",
    aboutPageLead: "대표 인사말, 회사 개요, 연혁과 인증을 안내합니다.",
    companyLabel: "회사정보",
    companyTitle: "회사 개요",
    companyLead: "안정적인 압축공기가 필요한 제조 현장을 위한 산업용 컴프레서 판매·서비스.",
    fields: {
      legalName: "법인명",
      founded: "설립일",
      employees: "임직원",
      businessType: "업종",
      businessItem: "사업 내용",
      hqKorea: "본사 (한국)",
      branchIndia: "Registration Office",
      chennaiOffice: "첸나이 사무실",
      cin: "CIN",
      email: "이메일",
    },
    historyLabel: "연혁",
    historyTitle: "회사 연혁",
    historyLead: "한국에서 태국, 인도까지 2010년부터 쌓아 온 컴프레서 서비스 전문성.",
    performanceLabel: "실적",
    performanceTitle: "주요 실적",
    performanceLead: "판매, 오버홀, 연간 유지보수 계약 등 주요 수행 내역입니다.",
    performanceEmpty: "등록된 실적이 없습니다.",
    performanceSearch: "검색",
    performanceSearchPlaceholder: "날짜, 내용, 고객사 검색",
    performanceNoResults: "검색 결과가 없습니다.",
    performanceTotalCount: (n) => `총 ${n}건`,
    performanceResultCount: (shown, total) => `검색 결과 ${shown}건 / 전체 ${total}건`,
    table: {
      date: "일자",
      details: "내용",
      client: "고객사",
    },
    galleryLabel: "Gallery",
    galleryTitle: "갤러리",
    galleryLead: "현장과 서비스 활동 사진입니다.",
    galleryClose: "닫기",
    teamLabel: "Team",
    teamTitle: "팀원 소개",
    teamLead: "산업용 컴프레서 판매·서비스를 책임지는 Hankook Service Center 팀입니다.",
    teamCeoLabel: "대표",
    teamMembersLabel: "팀원",
    teamEmpty: "팀원 정보는 준비 중입니다.",
    certLabel: "인증",
    certTitle: "인증 서류",
    certSearch: "검색",
    certSearchPlaceholder: "서류명 검색",
    certNoResults: "검색 결과가 없습니다.",
    certTotalCount: (n) => `총 ${n}건`,
    certResultCount: (shown, total) => `검색 결과 ${shown}건 / 전체 ${total}건`,
    certViewCard: "카드로 보기",
    certViewList: "리스트로 보기",
    familyLabel: "관계사",
    familyLead: "한국 관계사 안내입니다.",
    contactLabel: "문의",
    contactTitle: "문의하기",
    contactLead: "아래 양식을 작성해 주시면 빠르게 답변드리겠습니다.",
    clientsLabel: "고객사",
    clientsTitle: "고객사",
    clientsLead:
      "고객의 생산 현장에 필요한 압축공기 솔루션과 책임 있는 서비스로, 안정적인 설비 운영과 지속적인 성장을 함께합니다.",
    clientsEmpty: "등록된 고객사가 없습니다.",
    clientsSearch: "검색",
    clientsSearchPlaceholder: "고객사명 검색",
    clientsNoResults: "검색 결과가 없습니다.",
    clientsTotalCount: (n) => `총 ${n}건`,
    clientsResultCount: (shown, total) => `검색 결과 ${shown}건 / 전체 ${total}건`,
    viewMore: "자세히 보기",
    viewMoreClients: "고객사 더보기",
    viewMorePerformance: "실적 더보기",
    contactCta: "문의 남기기",
    contactForm: {
      name: "이름",
      email: "이메일",
      phone: "연락처",
      company: "회사명",
      message: "문의 내용",
      namePlaceholder: "홍길동",
      emailPlaceholder: "name@example.com",
      phonePlaceholder: "+91 98765 43210",
      companyPlaceholder: "회사명을 입력하세요",
      messagePlaceholder: "문의하실 내용을 적어 주세요.",
      submit: "문의 보내기",
      sending: "전송 중…",
      success: "문의가 접수되었습니다. 감사합니다.",
      error: "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    },
    footerTagline: "산업용 컴프레서 판매·수리·유지보수 Total Air Solution.",
    footerRights: "All rights reserved.",
    developedBy: "개발",
    footerAdmin: "Admin",
    footerMvs: "업무 시스템 MVS",
    heroImageAlt: "Hankook Service Center 파트너십",
    slidePrev: "이전 슬라이드",
    slideNext: "다음 슬라이드",
    openInMaps: "지도에서 보기",
    gallerySearch: "검색",
    gallerySearchPlaceholder: "제목, 설명 검색",
    galleryNoResults: "검색 결과가 없습니다.",
    galleryTotalCount: (n) => `총 ${n}건`,
    galleryResultCount: (shown, total) => `검색 결과 ${shown}건 / 전체 ${total}건`,
    galleryViewCard: "카드로 보기",
    galleryViewList: "리스트로 보기",
  },
  en: {
    nav: {
      about: "About",
      company: "Company",
      history: "History",
      performance: "Performance",
      clients: "Clients",
      team: "Team",
      gallery: "Gallery",
      contact: "Contact",
    },
    menu: "Menu",
    learnMore: "Learn more",
    aboutLabel: "CEO Message",
    aboutPageLabel: "About",
    aboutPageTitle: "About Us",
    aboutPageLead: "CEO message, company overview, history, and certifications.",
    companyLabel: "Company",
    companyTitle: "Company Information",
    companyLead:
      "Industrial compressor sales and service for manufacturers who need reliable compressed air.",
    fields: {
      legalName: "Legal name",
      founded: "Founded",
      employees: "Employees",
      businessType: "Business type",
      businessItem: "Business item",
      hqKorea: "Headquarters (Korea)",
      branchIndia: "Registration Office",
      chennaiOffice: "Chennai Office",
      cin: "CIN",
      email: "Email",
    },
    historyLabel: "History",
    historyTitle: "Company History",
    historyLead:
      "From Korea to Thailand and India building compressor service expertise since 2010.",
    performanceLabel: "Performance",
    performanceTitle: "Major Performance",
    performanceLead: "Selected sales, overhaul, and annual maintenance work.",
    performanceEmpty: "No performance records yet.",
    performanceSearch: "Search",
    performanceSearchPlaceholder: "Search by date, detail, or client",
    performanceNoResults: "No matching results.",
    performanceTotalCount: (n) => `Total ${n}`,
    performanceResultCount: (shown, total) => `${shown} of ${total} results`,
    table: {
      date: "Date",
      details: "Details",
      client: "Client",
    },
    galleryLabel: "Gallery",
    galleryTitle: "Gallery",
    galleryLead: "Photos from our field service and operations.",
    galleryClose: "Close",
    teamLabel: "Team",
    teamTitle: "Our Team",
    teamLead: "The people behind Hankook Service Center industrial air solutions.",
    teamCeoLabel: "Director",
    teamMembersLabel: "Team Members",
    teamEmpty: "Team profiles are being prepared.",
    certLabel: "Certification",
    certTitle: "Certification Documents",
    certSearch: "Search",
    certSearchPlaceholder: "Search by document title",
    certNoResults: "No matching results.",
    certTotalCount: (n) => `Total ${n}`,
    certResultCount: (shown, total) => `${shown} of ${total} results`,
    certViewCard: "Card view",
    certViewList: "List view",
    familyLabel: "Family Company",
    familyLead: "Reference affiliate in Korea.",
    contactLabel: "Contact",
    contactTitle: "Send an inquiry",
    contactLead: "Fill out the form below and we will get back to you soon.",
    clientsLabel: "Clients",
    clientsTitle: "Clients",
    clientsLead:
      "With compressed air solutions and responsible service for production sites, we support stable equipment operation and grow together with our clients.",
    clientsEmpty: "No clients listed yet.",
    clientsSearch: "Search",
    clientsSearchPlaceholder: "Search by client name",
    clientsNoResults: "No matching results.",
    clientsTotalCount: (n) => `Total ${n}`,
    clientsResultCount: (shown, total) => `${shown} of ${total} results`,
    viewMore: "View more",
    viewMoreClients: "View all clients",
    viewMorePerformance: "View all performance",
    contactCta: "Contact us",
    contactForm: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "name@example.com",
      phonePlaceholder: "+91 98765 43210",
      companyPlaceholder: "Company name",
      messagePlaceholder: "Tell us about your inquiry.",
      submit: "Send inquiry",
      sending: "Sending…",
      success: "Your inquiry has been submitted. Thank you.",
      error: "Failed to send. Please try again.",
    },
    footerTagline: "Industrial compressor sales, repair, and maintenance Total Air Solution.",
    footerRights: "All rights reserved.",
    developedBy: "Developed by",
    footerAdmin: "Admin",
    footerMvs: "MVS Work System",
    heroImageAlt: "Hankook Service Center partnership",
    slidePrev: "Previous slide",
    slideNext: "Next slide",
    openInMaps: "Open in Maps",
    gallerySearch: "Search",
    gallerySearchPlaceholder: "Search by title or caption",
    galleryNoResults: "No matching results.",
    galleryTotalCount: (n) => `Total ${n}`,
    galleryResultCount: (shown, total) => `${shown} of ${total} results`,
    galleryViewCard: "Card view",
    galleryViewList: "List view",
  },
};
