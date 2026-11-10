import type { Locale } from "@/lib/types";

export type AdminSectionId =
  | "hero"
  | "greeting"
  | "company"
  | "history"
  | "performance"
  | "services"
  | "clients"
  | "team"
  | "gallery"
  | "affiliate"
  | "inquiries"
  | "mail"
  | "security";

export type MenuItem = { id: AdminSectionId; label: string; desc: string };
export type MenuGroup = { id: string; label: string; items: MenuItem[] };

const menuGroupsKo: MenuGroup[] = [
  {
    id: "company",
    label: "회사 소개",
    items: [
      { id: "greeting", label: "인사말", desc: "소개 문구" },
      { id: "company", label: "회사 정보", desc: "법인·주소·인증" },
      { id: "history", label: "연혁", desc: "회사 히스토리" },
      { id: "team", label: "팀원", desc: "대표·팀원 소개" },
      { id: "affiliate", label: "관계사", desc: "한국 관계사" },
    ],
  },
  {
    id: "site",
    label: "사이트",
    items: [
      { id: "hero", label: "히어로", desc: "메인 배너·미디어" },
      { id: "gallery", label: "갤러리", desc: "사진 관리" },
    ],
  },
  {
    id: "business",
    label: "사업·서비스",
    items: [
      { id: "services", label: "설비·서비스", desc: "제공 서비스·제품" },
      { id: "performance", label: "실적", desc: "주요 수행" },
      { id: "clients", label: "고객사", desc: "고객사 목록" },
    ],
  },
  {
    id: "ops",
    label: "운영",
    items: [
      { id: "inquiries", label: "문의 내역", desc: "접수된 문의" },
      { id: "mail", label: "메일 설정", desc: "Google SMTP" },
      { id: "security", label: "보안", desc: "비밀번호 변경" },
    ],
  },
];

const menuGroupsEn: MenuGroup[] = [
  {
    id: "company",
    label: "Company",
    items: [
      { id: "greeting", label: "Greeting", desc: "Intro message" },
      { id: "company", label: "Company", desc: "Legal · address · certs" },
      { id: "history", label: "History", desc: "Company timeline" },
      { id: "team", label: "Team", desc: "CEO · members" },
      { id: "affiliate", label: "Affiliate", desc: "Korea affiliate" },
    ],
  },
  {
    id: "site",
    label: "Website",
    items: [
      { id: "hero", label: "Hero", desc: "Main banner & media" },
      { id: "gallery", label: "Gallery", desc: "Photo management" },
    ],
  },
  {
    id: "business",
    label: "Business",
    items: [
      { id: "services", label: "Services", desc: "Equipment & products" },
      { id: "performance", label: "Performance", desc: "Key projects" },
      { id: "clients", label: "Clients", desc: "Client list" },
    ],
  },
  {
    id: "ops",
    label: "Operations",
    items: [
      { id: "inquiries", label: "Inquiries", desc: "Received messages" },
      { id: "mail", label: "Mail", desc: "Google SMTP" },
      { id: "security", label: "Security", desc: "Change password" },
    ],
  },
];

export function adminMenuGroups(locale: Locale): MenuGroup[] {
  return locale === "en" ? menuGroupsEn : menuGroupsKo;
}

export function adminMenu(locale: Locale): MenuItem[] {
  return adminMenuGroups(locale).flatMap((group) => group.items);
}

export function adminUi(locale: Locale) {
  const en = locale === "en";
  return {
    contentManage: en ? "Content management" : "콘텐츠 관리",
    viewSite: en ? "View site" : "사이트 보기",
    logout: en ? "Log out" : "로그아웃",
    closeMenu: en ? "Close menu" : "메뉴 닫기",
    openMenu: en ? "Menu" : "메뉴",
    save: en ? "Save" : "저장",
    saving: en ? "Saving…" : "저장 중…",
    saved: en ? "Saved · applied to the site" : "저장됨 · 사이트에 반영됨",
    saveFailed: en ? "Save failed. Please log in again." : "저장 실패. 다시 로그인해 주세요.",
    storageRiskTitle: en
      ? "Uploads may be lost on redeploy"
      : "재배포 시 업로드 이미지가 사라질 수 있습니다",
    storageRiskBody: en
      ? "Attach a Railway Volume at /data so client logos and gallery photos persist. Seed images in the deploy image are restored automatically when missing."
      : "Railway Volume을 /data 경로에 연결하세요. 고객사 로고·갤러리 사진이 유지됩니다. 배포 이미지에 포함된 seed 이미지는 없을 때 자동으로 복구됩니다.",
    editing: (label: string) =>
      en ? `English · ${label}` : `한국어 · ${label}`,
    loading: en ? "Loading…" : "로딩 중…",
    contentLoading: en ? "Loading content…" : "콘텐츠 로딩 중…",

    // Common fields
    title: en ? "Title" : "제목",
    body: en ? "Body" : "본문",
    brand: en ? "Brand" : "브랜드",
    headline: en ? "Headline" : "헤드라인",
    subheadline: en ? "Subheadline" : "서브헤드라인",
    ctaLabel: en ? "CTA label" : "CTA 문구",
    ctaHref: en ? "CTA link" : "CTA 링크",
    videoUrl: en ? "Video URL" : "영상 URL",
    intro: en ? "Intro text" : "소개 문구",
    sectionTitle: en ? "Section title" : "섹션 제목",
    add: en ? "Add" : "추가",
    register: en ? "Add" : "등록",
    edit: en ? "Edit" : "수정",
    delete: en ? "Delete" : "삭제",
    cancel: en ? "Cancel" : "취소",
    confirm: en ? "Confirm" : "확인",
    confirmTitle: en ? "Please confirm" : "확인",
    confirmOk: en ? "OK" : "확인",
    confirmCancel: en ? "Cancel" : "취소",
    applyAdd: en ? "Add" : "추가 반영",
    applyEdit: en ? "Apply edit" : "수정 반영",
    total: (n: number) => (en ? `Total ${n}` : `총 ${n}건`),
    totalPeople: (n: number) => (en ? `Total ${n}` : `총 ${n}명`),
    no: "No",
    none: en ? "None" : "없음",
    noTitle: en ? "(No title)" : "(제목 없음)",
    manage: en ? "Manage" : "관리",
    date: en ? "Date" : "일자",
    detail: en ? "Details" : "내용",
    name: en ? "Name" : "이름",
    role: en ? "Role" : "직책",
    bio: en ? "Bio" : "소개",
    photo: en ? "Photo" : "사진",
    photoHint: en ? "JPG, PNG, WEBP" : "JPG, PNG, WEBP",
    caption: en ? "Caption" : "설명",
    image: en ? "Image" : "이미지",
    imageUrl: en ? "Image URL" : "이미지 URL",
    logo: en ? "Logo" : "로고",
    logoHint: en ? "Optional · JPG, PNG, WEBP" : "선택 사항 · JPG, PNG, WEBP",
    logoRemove: en ? "Remove logo" : "로고 제거",

    hero: en ? "Hero" : "히어로",
    heroSlides: en ? "Hero slides" : "히어로 슬라이드",
    heroSlidesHint: en
      ? "Upload or replace each slide image/video. Changes auto-save and show on the home page."
      : "슬라이드별 이미지·동영상을 업로드하거나 교체할 수 있습니다. 저장 후 메인 페이지에 바로 반영됩니다.",
    heroSlidesEmpty: en
      ? "No slides yet. Add an image or video slide."
      : "등록된 슬라이드가 없습니다. 이미지 또는 동영상 슬라이드를 추가하세요.",
    heroSlideAdd: en ? "Add slide" : "슬라이드 추가",
    heroSlideEdit: en ? "Edit slide" : "슬라이드 수정",
    heroSlideDeleteConfirm: en ? "Delete this hero slide?" : "이 히어로 슬라이드를 삭제할까요?",
    heroSlideLabel: en ? "Label" : "라벨",
    heroType: en ? "Type" : "유형",
    heroTypeImage: en ? "Image" : "이미지",
    heroTypeVideo: en ? "Video" : "동영상",
    heroMedia: en ? "Media" : "미디어",
    heroMediaUrl: en ? "Media URL" : "미디어 URL",
    heroMediaPick: en ? "Choose file" : "파일 선택",
    heroMediaChange: en ? "Replace file" : "파일 변경",
    heroMediaHint: en
      ? "Image: JPG/PNG/WEBP/GIF (max 8MB) · Video: MP4/WEBM (max 50MB)"
      : "이미지: JPG/PNG/WEBP/GIF (최대 8MB) · 동영상: MP4/WEBM (최대 50MB)",
    heroMediaRequired: en
      ? "Please upload a file or enter a media URL."
      : "파일을 업로드하거나 미디어 URL을 입력하세요.",
    heroUploading: en ? "Uploading…" : "업로드 중…",
    heroUploadFailed: en ? "Upload failed" : "업로드 실패",
    greeting: en ? "Greeting" : "인사말",
    company: en ? "Company" : "회사 정보",
    history: en ? "History" : "연혁",
    historyHint: en
      ? "Add timeline entries. Save after edit."
      : "연혁을 등록·수정합니다. 수정 후 저장하세요.",
    historyAdd: en ? "Add history" : "연혁 추가",
    historyEmpty: en ? "No history yet." : "등록된 연혁이 없습니다.",
    historySave: en ? "Save" : "저장",
    historySaved: en ? "Saved" : "저장됨",
    historyDeleteConfirm: en ? "Delete this history entry?" : "이 연혁을 삭제할까요?",
    performance: en ? "Performance" : "실적",
    performanceHint: en
      ? "Add key project records. Save after edit."
      : "주요 실적을 등록·수정합니다. 수정 후 저장하세요.",
    performanceAdd: en ? "Add performance" : "실적 추가",
    performanceEmpty: en
      ? "No performance records yet. Add one with the button above."
      : "등록된 실적이 없습니다. 위 버튼으로 추가하세요.",
    performanceSave: en ? "Save" : "저장",
    performanceSaved: en ? "Saved" : "저장됨",
    performanceClient: en ? "Client" : "고객사",
    performanceDeleteConfirm: en ? "Delete this performance record?" : "이 실적을 삭제할까요?",
    services: en ? "Equipment & Services" : "설비·서비스",
    servicesHint: en
      ? "Edit page copy, offerings, brands, and product documents shown on /services."
      : "제공 서비스·브랜드·제품 자료를 관리합니다. 저장하면 /services에 바로 반영됩니다.",
    servicesPage: en ? "Page copy" : "페이지 문구",
    servicesOfferings: en ? "Offerings" : "제공 서비스",
    servicesBrands: en ? "Brands & products" : "브랜드·제품",
    servicesCategories: en ? "Categories" : "설비 분류",
    servicesAddOffering: en ? "Add offering" : "서비스 추가",
    servicesAddBrand: en ? "Add brand" : "브랜드 추가",
    servicesAddProduct: en ? "Add product" : "제품 추가",
    servicesAddCategory: en ? "Add category" : "분류 추가",
    servicesBrandName: en ? "Brand name" : "브랜드명",
    servicesSlug: en ? "URL slug" : "URL 슬러그",
    servicesFolder: en ? "Folder / source" : "폴더·출처",
    servicesLead: en ? "Intro" : "소개",
    servicesProductTitle: en ? "Document title" : "자료 제목",
    servicesProductDesc: en ? "Description" : "설명",
    servicesCategoryItems: en ? "Links (label|slug per line)" : "링크 (한 줄에 라벨|슬러그)",
    servicesEmptyOfferings: en ? "No offerings yet." : "등록된 제공 서비스가 없습니다.",
    servicesEmptyBrands: en ? "No brands yet." : "등록된 브랜드가 없습니다.",
    clients: en ? "Clients" : "고객사",
    clientsHint: en
      ? "Save after add/edit — applied to the site. If no logo, the name is shown."
      : "등록·수정 후 저장하면 사이트에 바로 반영됩니다. 로고가 없으면 이름으로 표시됩니다.",
    clientsEmpty: en ? "No clients yet. Use Add to create one." : "등록된 고객사가 없습니다. 등록 버튼으로 추가하세요.",
    clientName: en ? "Client name" : "고객사명",
    clientCreate: en ? "Add client" : "고객사 등록",
    clientEdit: en ? "Edit client" : "고객사 수정",
    clientDeleteConfirm: en ? "Delete this client?" : "이 고객사를 삭제할까요?",
    team: en ? "Team" : "팀원 소개",
    teamHint: en
      ? "Save after add/edit — applied to /team."
      : "등록·수정 후 저장하면 /team 페이지에 바로 반영됩니다.",
    teamCeo: en ? "CEO" : "대표",
    teamMember: en ? "Member" : "팀원",
    teamCreate: en ? "Add member" : "팀원 등록",
    teamEditCeo: en ? "Edit CEO" : "대표 수정",
    teamEditMember: en ? "Edit member" : "팀원 수정",
    teamDeleteConfirm: en ? "Delete this member?" : "이 팀원을 삭제할까요?",
    gallery: en ? "Gallery" : "갤러리",
    galleryHint: en
      ? "Save after add/edit — applied to the gallery."
      : "등록·수정 후 저장하면 갤러리에 바로 반영됩니다.",
    galleryEmpty: en ? "No photos yet. Use Add to create one." : "등록된 사진이 없습니다. 등록 버튼으로 추가하세요.",
    galleryCreate: en ? "Add photo" : "사진 등록",
    galleryEdit: en ? "Edit photo" : "사진 수정",
    galleryDeleteConfirm: en ? "Delete this photo?" : "이 사진을 삭제할까요?",
    certificates: en ? "Certificates" : "인증 서류",
    certificatesHint: en
      ? "Register certificates for the About page. Save after add/edit — applied immediately."
      : "회사소개에 표시할 인증 서류를 등록합니다. 등록·수정 후 저장하면 바로 반영됩니다.",
    certificatesEmpty: en
      ? "No certificates yet. Use Add to create one."
      : "등록된 인증 서류가 없습니다. 등록 버튼으로 추가하세요.",
    certificatesCreate: en ? "Add certificate" : "인증 서류 등록",
    certificatesEdit: en ? "Edit certificate" : "인증 서류 수정",
    certificatesDeleteConfirm: en ? "Delete this certificate?" : "이 인증 서류를 삭제할까요?",
    affiliate: en ? "Affiliate" : "관계사",
    affiliateName: en ? "Name" : "이름",
    affiliateTel: en ? "Phone" : "전화",
    affiliateFax: en ? "Fax" : "팩스",
    affiliateEmail: en ? "Email" : "이메일",
    affiliateWebsite: en ? "Website" : "웹사이트",

    companyFields: {
      legalName: en ? "Legal name" : "법인명",
      founded: en ? "Established" : "설립일",
      employees: en ? "Employees" : "임직원",
      businessType: en ? "Business type" : "업종",
      businessItem: en ? "Business scope" : "사업 내용",
      branchIndia: en ? "Registration Office" : "Registration Office",
      branchIndiaMapEmbed: en
        ? "Registration Office map embed URL"
        : "Registration Office 지도 embed URL",
      chennaiOffice: en ? "Chennai office" : "첸나이 사무실",
      chennaiMapEmbed: en ? "Chennai map embed URL" : "첸나이 지도 embed URL",
      cin: "CIN",
      pan: "PAN",
      tan: "TAN",
      email: en ? "Email" : "이메일",
      phone: en ? "Phone" : "전화",
    },

    passwordTitle: en ? "Change password" : "비밀번호 변경",
    passwordHint: en
      ? "Confirm the current password, then set a new one. It is stored securely on the server."
      : "현재 비밀번호 확인 후 새 비밀번호로 변경합니다. 변경된 비밀번호는 서버에 안전하게 저장됩니다.",
    currentPassword: en ? "Current password" : "현재 비밀번호",
    newPassword: en ? "New password" : "새 비밀번호",
    confirmPassword: en ? "Confirm new password" : "새 비밀번호 확인",
    changePassword: en ? "Change password" : "비밀번호 변경",
    changing: en ? "Changing…" : "변경 중…",

    inquiriesTitle: en ? "Inquiries" : "문의 내역",
    inquiriesHint: en
      ? "Messages submitted from the contact form."
      : "문의 양식으로 접수된 메시지입니다.",
    inquiriesEmpty: en ? "No inquiries yet." : "접수된 문의가 없습니다.",
    inquiriesRefresh: en ? "Refresh" : "새로고침",
    inquiriesDelete: en ? "Delete" : "삭제",
    inquiriesDeleteConfirm: en ? "Delete this inquiry?" : "이 문의를 삭제할까요?",
    inquiriesLoading: en ? "Loading inquiries…" : "문의 불러오는 중…",
    inquiryDeleteConfirm: en ? "Delete this inquiry?" : "이 문의를 삭제할까요?",

    mailTitle: en ? "Mail settings" : "메일 설정",
    mailHint: en
      ? "Google SMTP for inquiry email notifications."
      : "문의 알림용 Google SMTP 설정입니다.",
    mailGuide: en
      ? "Use a Google App Password (not your normal Gmail password)."
      : "일반 Gmail 비밀번호가 아닌 Google 앱 비밀번호를 사용하세요.",
    mailEnabled: en ? "Enable sending" : "발송 사용",
    mailHost: en ? "SMTP host" : "SMTP 호스트",
    mailPort: en ? "Port" : "포트",
    mailSecure: en ? "Use SSL/TLS" : "SSL/TLS 사용",
    mailUser: en ? "Gmail address" : "Gmail 주소",
    mailPass: en ? "App password" : "앱 비밀번호",
    mailPassKeep: en ? "Leave blank to keep the current password" : "비워 두면 기존 비밀번호 유지",
    mailFromName: en ? "From name" : "발신자 이름",
    mailFromEmail: en ? "From email" : "발신 이메일",
    mailTo: en ? "Recipient" : "수신자",
    mailSave: en ? "Save mail settings" : "메일 설정 저장",
    mailSaved: en ? "Mail settings saved." : "메일 설정이 저장되었습니다.",
    mailTest: en ? "Send test email" : "테스트 메일 보내기",
    mailTestOk: en ? "Test email sent." : "테스트 메일을 보냈습니다.",
    mailAppPasswordHelp: en
      ? "Google Account → Security → 2-Step Verification → App passwords"
      : "Google 계정 → 보안 → 2단계 인증 → 앱 비밀번호",
  };
}

export type AdminUi = ReturnType<typeof adminUi>;
