"use client";

import { FormEvent, type ReactNode, useCallback, useEffect, useState } from "react";
import type { ClientItem, GalleryItem, Locale, LocaleContent, SiteContent, TeamMember } from "@/lib/types";
import type { Inquiry } from "@/lib/inquiry";

type AdminSectionId =
  | "hero"
  | "greeting"
  | "company"
  | "history"
  | "performance"
  | "clients"
  | "team"
  | "gallery"
  | "affiliate"
  | "inquiries";

const MENU: { id: AdminSectionId; label: string; desc: string }[] = [
  { id: "hero", label: "히어로", desc: "메인 배너" },
  { id: "greeting", label: "인사말", desc: "소개 문구" },
  { id: "company", label: "회사 정보", desc: "법인·주소" },
  { id: "history", label: "연혁", desc: "회사 히스토리" },
  { id: "performance", label: "실적", desc: "주요 수행" },
  { id: "clients", label: "고객사", desc: "고객사 목록" },
  { id: "team", label: "팀원", desc: "대표·팀원 소개" },
  { id: "gallery", label: "갤러리", desc: "사진 관리" },
  { id: "affiliate", label: "관계사", desc: "한국 관계사" },
  { id: "inquiries", label: "문의 내역", desc: "접수된 문의" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [editLocale, setEditLocale] = useState<Locale>("ko");
  const [section, setSection] = useState<AdminSectionId>("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [loginError, setLoginError] = useState("");

  const load = useCallback(async () => {
    const authRes = await fetch("/api/auth");
    const authData = await authRes.json();
    setAuthed(Boolean(authData.authenticated));
    setChecking(false);

    if (authData.authenticated) {
      const res = await fetch("/api/content");
      setContent((await res.json()) as SiteContent);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("비밀번호가 올바르지 않습니다.");
      return;
    }
    setPassword("");
    setAuthed(true);
    const contentRes = await fetch("/api/content");
    setContent((await contentRes.json()) as SiteContent);
  }

  async function onLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
    setContent(null);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus("저장 실패. 다시 로그인해 주세요.");
      return;
    }
    setStatus("저장되었습니다.");
  }

  function updateLocale(next: LocaleContent) {
    if (!content) return;
    setContent({ ...content, [editLocale]: next });
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
        로딩 중…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm border border-[var(--line)] bg-white p-8 shadow-sm"
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--steel)]">ADMIN</p>
          <h1 className="font-display mt-2 text-2xl font-bold text-[var(--ink)]">관리자 로그인</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">사이트 콘텐츠(한/영)를 수정합니다.</p>
          <label className="mt-6 block text-sm font-medium text-[var(--ink)]">
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-[var(--line)] px-3 py-2.5 outline-none focus:border-[var(--navy)]"
              autoFocus
            />
          </label>
          {loginError && <p className="mt-3 text-sm text-red-600">{loginError}</p>}
          <button type="submit" className="btn btn-primary mt-6 w-full">
            로그인
          </button>
          <a href="/" className="mt-4 block text-center text-sm text-[var(--muted)] hover:text-[var(--ink)]">
            ← 사이트로 돌아가기
          </a>
        </form>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
        콘텐츠 로딩 중…
      </div>
    );
  }

  const localeContent = content[editLocale];
  const activeMenu = MENU.find((m) => m.id === section)!;

  return (
    <div className="min-h-screen bg-[var(--bg)] lg:flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/35 lg:hidden"
          aria-label="메뉴 닫기"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--line)] bg-[var(--navy-deep)] text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-white/50">ADMIN</p>
          <p className="font-display mt-1 text-lg font-bold">Hankook SC</p>
          <p className="mt-1 text-xs text-white/55">콘텐츠 관리</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {MENU.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full flex-col rounded-sm px-3 py-2.5 text-left transition-colors ${
                  active ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/6 hover:text-white"
                }`}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-xs text-white/45">{item.desc}</span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 px-4 py-4 text-sm">
          <a href="/" className="block text-white/65 transition-colors hover:text-white">
            사이트 보기
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="block text-white/65 transition-colors hover:text-white"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center border border-[var(--line)] lg:hidden"
                aria-label="메뉴"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="flex w-4 flex-col gap-1">
                  <span className="h-px w-full bg-[var(--ink)]" />
                  <span className="h-px w-full bg-[var(--ink)]" />
                  <span className="h-px w-full bg-[var(--ink)]" />
                </span>
              </button>
              <div>
                <h1 className="font-display text-lg font-bold md:text-xl">{activeMenu.label}</h1>
                <p className="text-xs text-[var(--muted)]">{activeMenu.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {section !== "inquiries" &&
                (["ko", "en"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setEditLocale(code)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                      editLocale === code
                        ? "bg-[var(--navy)] text-white"
                        : "border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {code === "ko" ? "KO" : "EN"}
                  </button>
                ))}
            </div>
          </div>
        </header>

        {section === "inquiries" ? (
          <div className="flex-1 px-4 py-6 md:px-6">
            <div className="mx-auto max-w-3xl">
              <InquiriesPanel />
            </div>
          </div>
        ) : (
        <form onSubmit={onSave} className="flex flex-1 flex-col">
          <div className="flex-1 px-4 py-6 md:px-6">
            <div className="mx-auto max-w-3xl">
              {section === "hero" && (
                <Panel title="히어로">
                  <Field
                    label="브랜드"
                    value={localeContent.hero.brand}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        hero: { ...localeContent.hero, brand: v },
                      })
                    }
                  />
                  <Field
                    label="헤드라인"
                    value={localeContent.hero.headline}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        hero: { ...localeContent.hero, headline: v },
                      })
                    }
                  />
                  <TextArea
                    label="소개 문구"
                    value={localeContent.hero.subheadline}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        hero: { ...localeContent.hero, subheadline: v },
                      })
                    }
                  />
                  <Field
                    label="CTA 버튼"
                    value={localeContent.hero.ctaLabel}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        hero: { ...localeContent.hero, ctaLabel: v },
                      })
                    }
                  />
                </Panel>
              )}

              {section === "greeting" && (
                <Panel title="인사말">
                  <Field
                    label="제목"
                    value={localeContent.greeting.title}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        greeting: { ...localeContent.greeting, title: v },
                      })
                    }
                  />
                  <TextArea
                    label="본문"
                    rows={12}
                    value={localeContent.greeting.body}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        greeting: { ...localeContent.greeting, body: v },
                      })
                    }
                  />
                </Panel>
              )}

              {section === "company" && (
                <Panel title="회사 정보">
                  {(
                    [
                      ["legalName", "법인명"],
                      ["founded", "설립일"],
                      ["employees", "임직원"],
                      ["businessType", "업종"],
                      ["businessItem", "사업 내용"],
                      ["branchIndia", "Registration Office"],
                      ["chennaiOffice", "첸나이 사무실"],
                      ["chennaiMapEmbed", "첸나이 지도 embed URL"],
                      ["cin", "CIN"],
                      ["pan", "PAN"],
                      ["tan", "TAN"],
                      ["email", "이메일"],
                      ["phone", "전화"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field
                      key={key}
                      label={label}
                      value={localeContent.company[key]}
                      onChange={(v) =>
                        updateLocale({
                          ...localeContent,
                          company: { ...localeContent.company, [key]: v },
                        })
                      }
                    />
                  ))}
                </Panel>
              )}

              {section === "history" && (
                <Panel title="연혁" hint="한 줄 형식: 날짜 | 내용">
                  <TextArea
                    label="연혁 목록"
                    rows={14}
                    value={localeContent.history.map((h) => `${h.date} | ${h.detail}`).join("\n")}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        history: v
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line) => {
                            const [date, ...rest] = line.split("|");
                            return { date: (date || "").trim(), detail: rest.join("|").trim() };
                          }),
                      })
                    }
                  />
                </Panel>
              )}

              {section === "performance" && (
                <Panel title="실적" hint="한 줄 형식: 날짜 | 내용 | 고객사">
                  <TextArea
                    label="실적 목록"
                    rows={16}
                    value={localeContent.performances
                      .map((p) => `${p.date} | ${p.detail} | ${p.client}`)
                      .join("\n")}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        performances: v
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line) => {
                            const [date, detail, ...rest] = line.split("|");
                            return {
                              date: (date || "").trim(),
                              detail: (detail || "").trim(),
                              client: rest.join("|").trim(),
                            };
                          }),
                      })
                    }
                  />
                </Panel>
              )}

              {section === "clients" && (
                <ClientsEditor
                  clients={
                    localeContent.clients || {
                      title: editLocale === "ko" ? "고객사" : "Clients",
                      lead: "",
                      items: [],
                    }
                  }
                  onChange={(clients) => updateLocale({ ...localeContent, clients })}
                />
              )}

              {section === "team" && (
                <TeamEditor
                  team={
                    localeContent.team || {
                      title: editLocale === "ko" ? "팀원 소개" : "Our Team",
                      lead: "",
                      ceo: { name: "", role: "", bio: "", photo: "" },
                      members: [],
                    }
                  }
                  onChange={(team) => updateLocale({ ...localeContent, team })}
                />
              )}

              {section === "gallery" && (
                <GalleryEditor
                  gallery={
                    localeContent.gallery || {
                      title: editLocale === "ko" ? "갤러리" : "Gallery",
                      lead: "",
                      items: [],
                    }
                  }
                  onChange={(gallery) => updateLocale({ ...localeContent, gallery })}
                />
              )}

              {section === "affiliate" && (
                <Panel title="관계사">
                  {(
                    [
                      ["name", "이름"],
                      ["tel", "전화"],
                      ["fax", "팩스"],
                      ["email", "이메일"],
                      ["website", "웹사이트"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field
                      key={key}
                      label={label}
                      value={localeContent.affiliate[key]}
                      onChange={(v) =>
                        updateLocale({
                          ...localeContent,
                          affiliate: { ...localeContent.affiliate, [key]: v },
                        })
                      }
                    />
                  ))}
                </Panel>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-[var(--line)] bg-white px-4 py-3 md:px-6">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
              <p className="text-sm text-[var(--muted)]">
                {status ||
                  `${editLocale === "ko" ? "한국어" : "English"} · ${activeMenu.label} 수정 중`}
              </p>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "저장 중…" : "저장"}
              </button>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}

function InquiriesPanel() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/inquiries");
    if (res.ok) {
      setItems((await res.json()) as Inquiry[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    if (!window.confirm("이 문의를 삭제할까요?")) return;
    const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <Panel title="문의 내역" hint="사이트 문의 양식으로 접수된 내용입니다.">
      {loading ? (
        <p className="text-sm text-[var(--muted)]">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">아직 접수된 문의가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="border border-[var(--line)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[var(--ink)]">{item.name}</p>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">
                    {item.email}
                    {item.phone ? ` · ${item.phone}` : ""}
                    {item.company ? ` · ${item.company}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <time className="text-xs text-[var(--muted)]">
                    {new Date(item.createdAt).toLocaleString("ko-KR")}
                  </time>
                  <button
                    type="button"
                    onClick={() => void remove(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">
                {item.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </Panel>
  );
}

function ClientsEditor({
  clients,
  onChange,
}: {
  clients: { title: string; lead: string; items: ClientItem[] };
  onChange: (clients: { title: string; lead: string; items: ClientItem[] }) => void;
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  function updateItem(index: number, patch: Partial<ClientItem>) {
    onChange({
      ...clients,
      items: clients.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  }

  function addItem() {
    onChange({
      ...clients,
      items: [...clients.items, { id: `c-${Date.now()}`, name: "", logo: "" }],
    });
  }

  function removeItem(index: number) {
    onChange({
      ...clients,
      items: clients.items.filter((_, i) => i !== index),
    });
  }

  async function uploadLogo(index: number, file: File) {
    setUploadError("");
    setUploadingIndex(index);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploadingIndex(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "업로드 실패");
      return;
    }
    const data = (await res.json()) as { url: string };
    updateItem(index, { logo: data.url });
  }

  return (
    <Panel title="고객사" hint="메인 페이지 고객사 영역에 표시됩니다. 로고가 없으면 이름으로 표시됩니다.">
      <Field
        label="섹션 제목"
        value={clients.title}
        onChange={(v) => onChange({ ...clients, title: v })}
      />
      <TextArea
        label="소개 문구"
        value={clients.lead}
        onChange={(v) => onChange({ ...clients, lead: v })}
      />
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <div className="space-y-4">
        {clients.items.map((item, index) => (
          <div key={item.id} className="border border-[var(--line)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">고객사 {index + 1}</p>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-sm text-red-600 hover:underline"
              >
                삭제
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-[120px_1fr]">
              <div className="relative flex aspect-[3/2] items-center justify-center overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
                {item.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.logo} alt="" className="h-full w-full object-contain p-2" />
                ) : (
                  <span className="text-xs text-[var(--muted)]">로고 없음</span>
                )}
              </div>
              <div className="grid gap-3">
                <Field
                  label="고객사명"
                  value={item.name}
                  onChange={(v) => updateItem(index, { name: v })}
                />
                <label className="block text-sm font-medium">
                  로고 업로드 (선택)
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1.5 block w-full text-sm"
                    disabled={uploadingIndex === index}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadLogo(index, file);
                      e.target.value = "";
                    }}
                  />
                  {uploadingIndex === index ? (
                    <span className="mt-1 block text-xs text-[var(--muted)]">업로드 중…</span>
                  ) : null}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="btn border border-[var(--line)] bg-white text-sm"
      >
        + 고객사 추가
      </button>
    </Panel>
  );
}

function TeamEditor({
  team,
  onChange,
}: {
  team: {
    title: string;
    lead: string;
    ceo: TeamMember;
    members: TeamMember[];
  };
  onChange: (team: {
    title: string;
    lead: string;
    ceo: TeamMember;
    members: TeamMember[];
  }) => void;
}) {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  function updateCeo(patch: Partial<TeamMember>) {
    onChange({ ...team, ceo: { ...team.ceo, ...patch } });
  }

  function updateMember(index: number, patch: Partial<TeamMember>) {
    onChange({
      ...team,
      members: team.members.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  }

  function addMember() {
    onChange({
      ...team,
      members: [...team.members, { name: "", role: "", bio: "", photo: "" }],
    });
  }

  function removeMember(index: number) {
    onChange({
      ...team,
      members: team.members.filter((_, i) => i !== index),
    });
  }

  async function uploadPhoto(key: string, file: File, onUrl: (url: string) => void) {
    setUploadError("");
    setUploadingKey(key);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploadingKey(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "업로드 실패");
      return;
    }
    const data = (await res.json()) as { url: string };
    onUrl(data.url);
  }

  return (
    <Panel title="팀원 소개" hint="대표와 팀원 정보를 입력하면 /team 페이지에 반영됩니다.">
      <Field
        label="섹션 제목"
        value={team.title}
        onChange={(v) => onChange({ ...team, title: v })}
      />
      <TextArea
        label="소개 문구"
        value={team.lead}
        onChange={(v) => onChange({ ...team, lead: v })}
      />

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <div className="border border-[var(--line)] p-4">
        <p className="mb-3 text-sm font-semibold text-[var(--ink)]">대표 (CEO)</p>
        <div className="grid gap-3 md:grid-cols-[140px_1fr]">
          <div className="relative aspect-[4/5] overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
            {team.ceo.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team.ceo.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
                사진 없음
              </div>
            )}
          </div>
          <div className="grid gap-3">
            <label className="block text-sm font-medium">
              사진 업로드
              <input
                type="file"
                accept="image/*"
                className="mt-1.5 block w-full text-sm"
                disabled={uploadingKey === "ceo"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadPhoto("ceo", file, (url) => updateCeo({ photo: url }));
                  e.target.value = "";
                }}
              />
              {uploadingKey === "ceo" ? (
                <span className="mt-1 block text-xs text-[var(--muted)]">업로드 중…</span>
              ) : null}
            </label>
            <Field label="이름" value={team.ceo.name} onChange={(v) => updateCeo({ name: v })} />
            <Field label="직책" value={team.ceo.role} onChange={(v) => updateCeo({ role: v })} />
            <TextArea label="소개" value={team.ceo.bio} onChange={(v) => updateCeo({ bio: v })} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {team.members.map((member, index) => (
          <div key={index} className="border border-[var(--line)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--ink)]">팀원 {index + 1}</p>
              <button
                type="button"
                onClick={() => removeMember(index)}
                className="text-sm text-red-600 hover:underline"
              >
                삭제
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-[140px_1fr]">
              <div className="relative aspect-[4/5] overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
                    사진 없음
                  </div>
                )}
              </div>
              <div className="grid gap-3">
                <label className="block text-sm font-medium">
                  사진 업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1.5 block w-full text-sm"
                    disabled={uploadingKey === `m-${index}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadPhoto(`m-${index}`, file, (url) => updateMember(index, { photo: url }));
                      }
                      e.target.value = "";
                    }}
                  />
                  {uploadingKey === `m-${index}` ? (
                    <span className="mt-1 block text-xs text-[var(--muted)]">업로드 중…</span>
                  ) : null}
                </label>
                <Field
                  label="이름"
                  value={member.name}
                  onChange={(v) => updateMember(index, { name: v })}
                />
                <Field
                  label="직책"
                  value={member.role}
                  onChange={(v) => updateMember(index, { role: v })}
                />
                <TextArea
                  label="소개"
                  value={member.bio}
                  onChange={(v) => updateMember(index, { bio: v })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addMember}
        className="btn border border-[var(--line)] bg-white text-sm"
      >
        + 팀원 추가
      </button>
    </Panel>
  );
}

function GalleryEditor({
  gallery,
  onChange,
}: {
  gallery: { title: string; lead: string; items: GalleryItem[] };
  onChange: (gallery: { title: string; lead: string; items: GalleryItem[] }) => void;
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  function updateItem(index: number, patch: Partial<GalleryItem>) {
    onChange({
      ...gallery,
      items: gallery.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  }

  function addItem() {
    onChange({
      ...gallery,
      items: [
        ...gallery.items,
        {
          id: `g-${Date.now()}`,
          title: "",
          image: "",
          caption: "",
        },
      ],
    });
  }

  function removeItem(index: number) {
    onChange({
      ...gallery,
      items: gallery.items.filter((_, i) => i !== index),
    });
  }

  async function uploadImage(index: number, file: File) {
    setUploadError("");
    setUploadingIndex(index);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploadingIndex(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "업로드 실패");
      return;
    }
    const data = (await res.json()) as { url: string };
    updateItem(index, { image: data.url });
  }

  return (
    <Panel title="갤러리" hint="사진을 추가하고 제목·설명을 입력하세요. 사이트 갤러리에 바로 반영됩니다.">
      <Field
        label="섹션 제목"
        value={gallery.title}
        onChange={(v) => onChange({ ...gallery, title: v })}
      />
      <TextArea
        label="소개 문구"
        value={gallery.lead}
        onChange={(v) => onChange({ ...gallery, lead: v })}
      />

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <div className="space-y-4">
        {gallery.items.map((item, index) => (
          <div key={item.id} className="border border-[var(--line)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--ink)]">사진 {index + 1}</p>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-sm text-red-600 hover:underline"
              >
                삭제
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[140px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
                    미리보기
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <Field
                  label="제목"
                  value={item.title}
                  onChange={(v) => updateItem(index, { title: v })}
                />
                <Field
                  label="설명"
                  value={item.caption}
                  onChange={(v) => updateItem(index, { caption: v })}
                />
                <Field
                  label="이미지 URL"
                  value={item.image}
                  onChange={(v) => updateItem(index, { image: v })}
                />
                <label className="block text-sm font-medium text-[var(--ink)]">
                  이미지 업로드
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="mt-1.5 block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(index, file);
                      e.target.value = "";
                    }}
                  />
                  {uploadingIndex === index && (
                    <span className="mt-1 block text-xs text-[var(--muted)]">업로드 중…</span>
                  )}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="btn border border-[var(--line)] bg-white text-sm"
      >
        + 사진 추가
      </button>
    </Panel>
  );
}

function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-[var(--line)] bg-white p-5 md:p-6">
      <div className="mb-5">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        {hint && <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-[var(--ink)]">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm font-medium text-[var(--ink)]">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full resize-y border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
      />
    </label>
  );
}
