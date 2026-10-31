import type { Locale } from "@/lib/types";

/** Fallback when Accept-Language has neither Korean nor English. */
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "hsc_locale";

export type UiCopy = {
  nav: {
    about: string;
    services: string;
    company: string;
    history: string;
    performance: string;
    clients: string;
    team: string;
    gallery: string;
    contact: string;
    apply: string;
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
  viewMoreTeam: string;
  viewMoreGallery: string;
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
  openApplyTitle: string;
  openApplyLead: string;
  openApplyCta: string;
  openApplyModalTitle: string;
  openApplyName: string;
  openApplyEmail: string;
  openApplyPhone: string;
  openApplyMessage: string;
  openApplyMessagePlaceholder: string;
  openApplyFile: string;
  openApplyFileHint: string;
  openApplySubmit: string;
  openApplySending: string;
  openApplySuccess: string;
  openApplyError: string;
  openApplyClose: string;
  openApplyFileTooLarge: string;
  openApplyFileType: string;
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
      services: "설비·서비스",
      company: "회사정보",
      history: "연혁",
      performance: "실적",
      clients: "고객사",
      team: "팀원",
      gallery: "갤러리",
      contact: "문의",
      apply: "지원서",
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
    viewMoreTeam: "팀 소개",
    viewMoreGallery: "갤러리 보기",
    contactCta: "문의 남기기",
    openApplyTitle: "지원서를 보내주세요",
    openApplyLead:
      "별도의 채용 공고 없이 상시로 지원을 받고 있습니다. 이력서와 간단한 소개를 보내주시면 검토 후 연락드리겠습니다.",
    openApplyCta: "지원서 보내기",
    openApplyModalTitle: "지원서 보내기",
    openApplyName: "이름",
    openApplyEmail: "이메일",
    openApplyPhone: "연락처",
    openApplyMessage: "자기소개 / 지원 내용",
    openApplyMessagePlaceholder: "간단한 소개와 관심 분야를 적어 주세요.",
    openApplyFile: "이력서 첨부",
    openApplyFileHint: "PDF, DOC, DOCX (최대 8MB, 3개까지)",
    openApplySubmit: "보내기",
    openApplySending: "전송 중…",
    openApplySuccess: "지원서가 접수되었습니다. 감사합니다.",
    openApplyError: "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    openApplyClose: "닫기",
    openApplyFileTooLarge: "파일 크기는 8MB 이하여야 합니다.",
    openApplyFileType: "PDF, DOC, DOCX 파일만 첨부할 수 있습니다.",
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
    developedBy: "Developed by",
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
      services: "Services",
      company: "Company",
      history: "History",
      performance: "Projects",
      clients: "Clients",
      team: "Team",
      gallery: "Gallery",
      contact: "Contact",
      apply: "Apply Now",
    },
    menu: "Menu",
    learnMore: "Learn more",
    aboutLabel: "Message from the CEO",
    aboutPageLabel: "About",
    aboutPageTitle: "About Us",
    aboutPageLead: "Message from the CEO, company overview, history, and certifications.",
    companyLabel: "Company",
    companyTitle: "Company Information",
    companyLead:
      "Industrial compressor sales and service for manufacturers who need reliable compressed air.",
    fields: {
      legalName: "Legal name",
      founded: "Established",
      employees: "Employees",
      businessType: "Business type",
      businessItem: "Core Business",
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
    performanceLabel: "Projects",
    performanceTitle: "Featured Projects",
    performanceLead:
      "Selected projects covering equipment sales, overhauls, and annual maintenance services.",
    performanceEmpty: "No projects listed yet.",
    performanceSearch: "Search",
    performanceSearchPlaceholder: "Search by date, project details, or client",
    performanceNoResults: "No matching results.",
    performanceTotalCount: (n) => `${n} Projects`,
    performanceResultCount: (shown, total) => `${shown} of ${total} projects`,
    table: {
      date: "Date",
      details: "Project Details",
      client: "Client",
    },
    galleryLabel: "Gallery",
    galleryTitle: "Gallery",
    galleryLead: "Explore photos of our on-site services and daily operations.",
    galleryClose: "Close",
    teamLabel: "Team",
    teamTitle: "Our Team",
    teamLead: "Meet the people behind Hankook Service Center’s industrial compressed air solutions.",
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
    contactTitle: "Send an Inquiry",
    contactLead: "Contact us to discuss your requirements. We’ll get back to you shortly.",
    clientsLabel: "Clients",
    clientsTitle: "Our Clients",
    clientsLead:
      "We help our clients maintain reliable equipment operation through tailored compressed air solutions and dependable service, building lasting partnerships along the way.",
    clientsEmpty: "No clients listed yet.",
    clientsSearch: "Search",
    clientsSearchPlaceholder: "Search by client name",
    clientsNoResults: "No matching results.",
    clientsTotalCount: (n) => `${n} Clients`,
    clientsResultCount: (shown, total) => `${shown} of ${total} clients`,
    viewMore: "Read More",
    viewMoreClients: "View All Clients",
    viewMorePerformance: "View All Projects",
    viewMoreTeam: "Meet Our Team",
    viewMoreGallery: "View Gallery",
    contactCta: "Contact Us",
    openApplyTitle: "Apply Now",
    openApplyLead:
      "We accept applications year-round without posting separate job listings. Share your resume and a short introduction — we'll review and get in touch.",
    openApplyCta: "Apply Now",
    openApplyModalTitle: "Apply Now",
    openApplyName: "Name",
    openApplyEmail: "Email",
    openApplyPhone: "Phone",
    openApplyMessage: "Introduction / message",
    openApplyMessagePlaceholder: "Tell us briefly about yourself and your interests.",
    openApplyFile: "Attach resume",
    openApplyFileHint: "PDF, DOC, DOCX (max 8MB, up to 3 files)",
    openApplySubmit: "Send",
    openApplySending: "Sending…",
    openApplySuccess: "Your application has been received. Thank you.",
    openApplyError: "Something went wrong. Please try again shortly.",
    openApplyClose: "Close",
    openApplyFileTooLarge: "Each file must be 8MB or smaller.",
    openApplyFileType: "Only PDF, DOC, and DOCX files are allowed.",
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
      submit: "Send Inquiry",
      sending: "Sending…",
      success: "Your inquiry has been submitted. Thank you.",
      error: "Failed to send. Please try again.",
    },
    footerTagline:
      "Comprehensive compressed air solutions, including industrial air compressor sales, repairs, and maintenance.",
    footerRights: "All rights reserved.",
    developedBy: "Developed by",
    footerAdmin: "Admin Login",
    footerMvs: "MVS Work Management System",
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
