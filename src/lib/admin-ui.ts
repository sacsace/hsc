import type { Locale } from "@/lib/types";

export type AdminSectionId =
  | "hero"
  | "greeting"
  | "company"
  | "history"
  | "performance"
  | "clients"
  | "team"
  | "gallery"
  | "affiliate"
  | "inquiries"
  | "security";

type MenuItem = { id: AdminSectionId; label: string; desc: string };

const menuKo: MenuItem[] = [
  { id: "hero", label: "히어로", desc: "메인 배너" },
  { id: "greeting", label: "인사말", desc: "소개 문구" },
  { id: "company", label: "회사 정보", desc: "법인·주소·인증" },
  { id: "history", label: "연혁", desc: "회사 히스토리" },
  { id: "performance", label: "실적", desc: "주요 수행" },
  { id: "clients", label: "고객사", desc: "고객사 목록" },
  { id: "team", label: "팀원", desc: "대표·팀원 소개" },
  { id: "gallery", label: "갤러리", desc: "사진 관리" },
  { id: "affiliate", label: "관계사", desc: "한국 관계사" },
  { id: "inquiries", label: "문의 내역", desc: "접수된 문의" },
  { id: "security", label: "보안", desc: "비밀번호 변경" },
];

const menuEn: MenuItem[] = [
  { id: "hero", label: "Hero", desc: "Main banner" },
  { id: "greeting", label: "Greeting", desc: "Intro message" },
  { id: "company", label: "Company", desc: "Legal · address · certs" },
  { id: "history", label: "History", desc: "Company timeline" },
  { id: "performance", label: "Performance", desc: "Key projects" },
  { id: "clients", label: "Clients", desc: "Client list" },
  { id: "team", label: "Team", desc: "CEO · members" },
  { id: "gallery", label: "Gallery", desc: "Photo management" },
  { id: "affiliate", label: "Affiliate", desc: "Korea affiliate" },
  { id: "inquiries", label: "Inquiries", desc: "Received messages" },
  { id: "security", label: "Security", desc: "Change password" },
];

export function adminMenu(locale: Locale): MenuItem[] {
  return locale === "en" ? menuEn : menuKo;
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
    editing: (label: string) =>
      en ? `English · ${label}` : `한국어 · ${label}`,
    loading: en ? "Loading…" : "로딩 중…",
    contentLoading: en ? "Loading content…" : "콘텐츠 로딩 중…",

    // Common fields
    title: en ? "Title" : "제목",
    body: en ? "Body" : "본문",
    brand: en ? "Brand" : "브랜드",
    headline: en ? "Headline" : "헤드라인",
    subheadline: en ? "Subheadline" : "서브 헤드라인",
    ctaLabel: en ? "CTA label" : "CTA 문구",
    ctaLink: en ? "CTA link" : "CTA 링크",
    videoUrl: en ? "Video URL" : "영상 URL",
    sectionTitle: en ? "Section title" : "섹션 제목",
    intro: en ? "Intro text" : "소개 문구",
    name: en ? "Name" : "이름",
    role: en ? "Role" : "직책",
    bio: en ? "Bio" : "소개",
    date: en ? "Date" : "날짜",
    detail: en ? "Detail" : "내용",
    client: en ? "Client" : "고객사",
    manage: en ? "Manage" : "관리",
    register: en ? "Add" : "등록",
    edit: en ? "Edit" : "수정",
    delete: en ? "Delete" : "삭제",
    cancel: en ? "Cancel" : "취소",
    confirmTitle: en ? "Please confirm" : "삭제 확인",
    confirmOk: en ? "Delete" : "삭제",
    confirmCancel: en ? "Cancel" : "취소",
    applyAdd: en ? "Save" : "저장",
    applyEdit: en ? "Save" : "저장",
    total: (n: number) => (en ? `Total ${n}` : `총 ${n}건`),
    totalPeople: (n: number) => (en ? `Total ${n}` : `총 ${n}명`),

    photo: en ? "Photo" : "사진",
    photoHint: en ? "JPG, PNG, WEBP · click preview or button" : "JPG, PNG, WEBP · 클릭하거나 버튼으로 첨부",
    photoAttach: en ? "Add photo" : "사진 첨부",
    photoSelect: en ? "Select photo" : "사진 선택",
    photoChange: en ? "Change photo" : "사진 변경",
    photoRemove: en ? "Remove photo" : "사진 삭제",
    photoClickHint: en ? "You can also click the preview to choose a file." : "미리보기 영역을 눌러도 파일을 선택할 수 있습니다.",
    uploading: en ? "Uploading…" : "업로드 중…",
    logo: en ? "Logo" : "로고",
    logoHint: en ? "Optional · JPG, PNG, WEBP" : "선택 사항 · JPG, PNG, WEBP",
    logoRemove: en ? "Remove logo" : "로고 제거",
    image: en ? "Image" : "이미지",
    imageUrl: en ? "Image URL" : "이미지 URL",
    caption: en ? "Caption" : "설명",
    none: en ? "—" : "—",
    noName: en ? "(Untitled)" : "(이름 없음)",
    noTitle: en ? "(Untitled)" : "(제목 없음)",

    hero: en ? "Hero" : "히어로",
    greeting: en ? "Greeting" : "인사말",
    company: en ? "Company info" : "회사 정보",
    history: en ? "History" : "연혁",
    historyHint: en
      ? "Edits are saved automatically and applied to the site. Save KO and EN separately."
      : "변경 시 자동 저장되어 사이트에 바로 반영됩니다. KO/EN은 각각 수정하세요.",
    historyAdd: en ? "+ Add history" : "+ 연혁 추가",
    historyEmpty: en ? "No history yet. Add one with the button above." : "등록된 연혁이 없습니다. 위 버튼으로 추가하세요.",
    performance: en ? "Performance" : "실적",
    performanceHint: en
      ? "Add, edit, or delete items, then click Save. List is sorted by date (newest first)."
      : "추가·수정·삭제 후 저장을 누르면 사이트에 반영됩니다. 날짜 기준(최신순)으로 정렬됩니다.",
    performanceList: en ? "Performance list" : "실적 목록",
    performanceAdd: en ? "+ Add performance" : "+ 실적 추가",
    performanceEmpty: en
      ? "No performance records yet. Add one with the button above."
      : "등록된 실적이 없습니다. 위 버튼으로 추가하세요.",
    performanceSave: en ? "Save" : "저장",
    performanceSaved: en ? "Saved" : "저장됨",
    performanceClient: en ? "Client" : "고객사",
    performanceDeleteConfirm: en ? "Delete this performance record?" : "이 실적을 삭제할까요?",
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
      ? "Messages submitted through the site contact form."
      : "사이트 문의 양식으로 접수된 내용입니다.",
    inquiriesEmpty: en ? "No inquiries yet." : "아직 접수된 문의가 없습니다.",
    inquiriesLoading: en ? "Loading…" : "불러오는 중…",
    inquiriesDelete: en ? "Delete" : "삭제",
    inquiryDeleteConfirm: en ? "Delete this inquiry?" : "이 문의를 삭제할까요?",
    inquiriesFrom: en ? "From" : "보낸 사람",
    inquiriesCompany: en ? "Company" : "회사",
    inquiriesMessage: en ? "Message" : "내용",
    inquiriesDate: en ? "Date" : "일시",
  };
}

export type AdminUi = ReturnType<typeof adminUi>;
