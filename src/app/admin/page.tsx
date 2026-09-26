"use client";

import Image from "next/image";
import { FormEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import type {
  ClientItem,
  GalleryItem,
  HistoryItem,
  Locale,
  LocaleContent,
  PerformanceItem,
  SiteContent,
  TeamMember,
} from "@/lib/types";
import type { Inquiry } from "@/lib/inquiry";
import { SiteLogo } from "@/components/SiteLogo";
import { adminMenu, adminUi, type AdminSectionId, type AdminUi } from "@/lib/admin-ui";

function AdminSymbol({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/symbol-hsc.png"
      alt="Hankook Service Center"
      width={96}
      height={88}
      className={`object-contain ${className}`}
      priority
    />
  );
}
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [editLocale, setEditLocale] = useState<Locale>("ko");
  const [section, setSection] = useState<AdminSectionId>("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusKey, setStatusKey] = useState<"" | "saved" | "failed">("");
  const [saving, setSaving] = useState(false);
  const [loginError, setLoginError] = useState("");
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<SiteContent | null>(null);

  const load = useCallback(async () => {
    const authRes = await fetch("/api/auth");
    const authData = await authRes.json();
    setAuthed(Boolean(authData.authenticated));
    setChecking(false);

    if (authData.authenticated) {
      const res = await fetch("/api/content");
      const data = (await res.json()) as SiteContent;
      contentRef.current = data;
      setContent(data);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, []);

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
    const data = (await contentRes.json()) as SiteContent;
    contentRef.current = data;
    setContent(data);
  }

  async function onLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
    setContent(null);
    contentRef.current = null;
  }

  const persistContent = useCallback(async (next: SiteContent) => {
    setSaving(true);
    setStatusKey("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (!res.ok) {
      setStatusKey("failed");
      return;
    }
    setStatusKey("saved");
  }, []);

  function schedulePersist(next: SiteContent) {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      void persistContent(next);
    }, 1200);
  }

  function updateLocale(next: LocaleContent) {
    const current = contentRef.current;
    if (!current) return;
    const nextContent = { ...current, [editLocale]: next };
    contentRef.current = nextContent;
    setContent(nextContent);
    schedulePersist(nextContent);
  }

  async function persistLocaleNow(next: LocaleContent) {
    const current = contentRef.current;
    if (!current) return;
    const nextContent = { ...current, [editLocale]: next };
    contentRef.current = nextContent;
    setContent(nextContent);
    if (persistTimer.current) clearTimeout(persistTimer.current);
    await persistContent(nextContent);
  }

  if (checking) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[var(--bg)] px-4 text-[var(--muted)]">
        로딩 중…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[var(--bg)] px-4 py-8">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-3">
            <AdminSymbol className="h-10 w-auto" />
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[var(--steel)]">ADMIN</p>
              <h1 className="font-display text-xl font-bold text-[var(--ink)] sm:text-2xl">
                관리자 로그인
              </h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">사이트 콘텐츠(한/영)를 수정합니다.</p>
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
      <div className="flex min-h-[100svh] items-center justify-center bg-[var(--bg)] px-4 text-[var(--muted)]">
        콘텐츠 로딩 중…
      </div>
    );
  }

  const localeContent = content[editLocale];
  const menu = adminMenu(editLocale);
  const t = adminUi(editLocale);
  const activeMenu = menu.find((m) => m.id === section)!;

  return (
    <div className="min-h-[100svh] w-full bg-[var(--bg)] lg:flex lg:items-stretch">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/35 lg:hidden"
          aria-label={t.closeMenu}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,85vw)] flex-col border-r border-[var(--line)] bg-[var(--navy-deep)] text-white transition-transform duration-200 lg:static lg:w-64 lg:shrink-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <a href="/" className="mb-3 block" aria-label="Hankook Service Center">
            <SiteLogo tone="light" className="!h-8 !max-w-full md:!h-9" />
          </a>
          <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-white/50">ADMIN</p>
          <p className="mt-1 text-xs text-white/55">{t.contentManage}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menu.map((item) => {
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
            {t.viewSite}
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="block text-white/65 transition-colors hover:text-white"
          >
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-[100svh] min-w-0 flex-1 flex-col lg:min-h-0">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--line)] lg:hidden"
                aria-label={t.openMenu}
                onClick={() => setSidebarOpen(true)}
              >
                <span className="flex w-4 flex-col gap-1">
                  <span className="h-px w-full bg-[var(--ink)]" />
                  <span className="h-px w-full bg-[var(--ink)]" />
                  <span className="h-px w-full bg-[var(--ink)]" />
                </span>
              </button>
              <AdminSymbol className="hidden h-8 w-auto sm:block lg:hidden" />
              <div className="min-w-0">
                <h1 className="font-display truncate text-base font-bold sm:text-lg md:text-xl">
                  {activeMenu.label}
                </h1>
                <p className="truncate text-xs text-[var(--muted)]">{activeMenu.desc}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <p className="hidden text-xs text-[var(--muted)] sm:block">
                {saving
                  ? t.saving
                  : statusKey === "saved"
                    ? t.saved
                    : statusKey === "failed"
                      ? t.saveFailed
                      : t.editing(activeMenu.label)}
              </p>
              {section !== "inquiries" &&
                section !== "security" &&
                (["ko", "en"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setEditLocale(code);
                      setStatusKey("");
                    }}
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
          <div className="flex-1 overflow-x-auto px-3 py-5 sm:px-4 md:px-6 md:py-6 lg:px-8">
            <div className="w-full min-w-0">
              <InquiriesPanel ui={t} />
            </div>
          </div>
        ) : section === "security" ? (
          <div className="flex-1 overflow-x-auto px-3 py-5 sm:px-4 md:px-6 md:py-6 lg:px-8">
            <div className="w-full min-w-0 max-w-xl">
              <PasswordPanel />
            </div>
          </div>
        ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-x-auto px-3 py-5 sm:px-4 md:px-6 md:py-6 lg:px-8">
            <div className="w-full min-w-0">
              {section === "hero" && (
                <Panel title={t.hero}>
                  <Field
                    label={t.brand}
                    value={localeContent.hero.brand}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        hero: { ...localeContent.hero, brand: v },
                      })
                    }
                  />
                  <Field
                    label={t.headline}
                    value={localeContent.hero.headline}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        hero: { ...localeContent.hero, headline: v },
                      })
                    }
                  />
                  <TextArea
                    label={t.intro}
                    value={localeContent.hero.subheadline}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        hero: { ...localeContent.hero, subheadline: v },
                      })
                    }
                  />
                  <Field
                    label={t.ctaLabel}
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
                <Panel title={t.greeting}>
                  <Field
                    label={t.title}
                    value={localeContent.greeting.title}
                    onChange={(v) =>
                      updateLocale({
                        ...localeContent,
                        greeting: { ...localeContent.greeting, title: v },
                      })
                    }
                  />
                  <TextArea
                    label={t.body}
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
                <Panel title={t.company} layout="table">
                  {(
                    [
                      "legalName",
                      "founded",
                      "employees",
                      "businessType",
                      "businessItem",
                      "branchIndia",
                      "chennaiOffice",
                      "chennaiMapEmbed",
                      "cin",
                      "pan",
                      "tan",
                      "email",
                      "phone",
                    ] as const
                  ).map((key) => (
                    <ListRow
                      key={key}
                      label={t.companyFields[key]}
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
                <HistoryEditor
                  items={localeContent.history}
                  onChange={(history) => updateLocale({ ...localeContent, history })}
                />
              )}

              {section === "performance" && (
                <PerformanceEditor
                  ui={t}
                  items={localeContent.performances}
                  onSave={(performances) =>
                    void persistLocaleNow({ ...localeContent, performances })
                  }
                />
              )}

              {section === "clients" && (
                <ClientsEditor
                  ui={t}
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
                  ui={t}
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
                  ui={t}
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
                <Panel title={t.affiliate} layout="table">
                  {(
                    [
                      ["name", t.affiliateName],
                      ["tel", t.affiliateTel],
                      ["fax", t.affiliateFax],
                      ["email", t.affiliateEmail],
                      ["website", t.affiliateWebsite],
                    ] as const
                  ).map(([key, label]) => (
                    <ListRow
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
        </div>
        )}
      </div>
    </div>
  );
}

function ensureHistoryIds(items: HistoryItem[]): HistoryItem[] {
  return items.map((item, index) =>
    item.id
      ? item
      : {
          ...item,
          id: `h-${index}-${Math.random().toString(36).slice(2, 9)}`,
        },
  );
}

function HistoryEditor({
  items,
  onChange,
}: {
  items: HistoryItem[];
  onChange: (items: HistoryItem[]) => void;
}) {
  const [rows, setRows] = useState(() => ensureHistoryIds(items));
  const rowsRef = useRef(rows);
  const typingRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  // 외부(언어 전환 등)에서 목록이 바뀌면 동기화. 입력 중에는 덮어쓰지 않음.
  useEffect(() => {
    if (typingRef.current) return;
    setRows(ensureHistoryIds(items));
  }, [items]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function commit(next: HistoryItem[], immediate = false) {
    setRows(next);
    rowsRef.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (immediate) {
      onChange(next);
      return;
    }
    saveTimer.current = setTimeout(() => {
      onChange(rowsRef.current);
    }, 1000);
  }

  function updateItem(index: number, patch: Partial<HistoryItem>) {
    typingRef.current = true;
    const next = rowsRef.current.map((item, i) => (i === index ? { ...item, ...patch } : item));
    commit(next);
  }

  function finishTyping() {
    typingRef.current = false;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    onChange(rowsRef.current);
  }

  function addItem() {
    typingRef.current = false;
    commit(
      [...rowsRef.current, { id: `h-${Date.now()}`, date: "", detail: "" }],
      true,
    );
  }

  function removeItem(index: number) {
    typingRef.current = false;
    commit(
      rowsRef.current.filter((_, i) => i !== index),
      true,
    );
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= rowsRef.current.length) return;
    typingRef.current = false;
    const copy = [...rowsRef.current];
    const tmp = copy[index];
    copy[index] = copy[nextIndex];
    copy[nextIndex] = tmp;
    commit(copy, true);
  }

  return (
    <Panel
      title="연혁"
      hint="입력 후 잠시 지나면 자동 저장되어 사이트에 반영됩니다. 새 항목은 목록 맨 아래에 추가됩니다."
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={addItem}
          className="btn border border-[var(--line)] bg-white text-sm"
        >
          + 연혁 추가
        </button>
      </div>

      <div className="overflow-hidden border border-[var(--line)]">
        <div className="hidden border-b border-[var(--line)] bg-[#f5f7f9] px-3 py-2 text-xs font-medium text-[var(--muted)] sm:grid sm:grid-cols-[9rem_1fr_7.5rem] sm:gap-3 sm:px-4">
          <span>날짜</span>
          <span>내용</span>
          <span className="text-right">관리</span>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[var(--muted)]">
            등록된 연혁이 없습니다. 위 버튼으로 추가하세요.
          </p>
        ) : (
          rows.map((item, index) => (
            <div
              key={item.id || `row-${index}`}
              className="grid gap-2 border-b border-[var(--line)] px-3 py-3 last:border-b-0 sm:grid-cols-[9rem_1fr_7.5rem] sm:items-start sm:gap-3 sm:px-4"
            >
              <label className="block text-sm sm:text-inherit">
                <span className="mb-1 block text-xs font-medium text-[var(--muted)] sm:hidden">
                  날짜
                </span>
                <input
                  value={item.date}
                  onChange={(e) => updateItem(index, { date: e.target.value })}
                  onBlur={finishTyping}
                  placeholder="2021.11"
                  className="w-full border border-[var(--line)] bg-[#f8fafb] px-2.5 py-2 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                />
              </label>
              <label className="block min-w-0 text-sm">
                <span className="mb-1 block text-xs font-medium text-[var(--muted)] sm:hidden">
                  내용
                </span>
                <input
                  value={item.detail}
                  onChange={(e) => updateItem(index, { detail: e.target.value })}
                  onBlur={finishTyping}
                  placeholder="연혁 내용을 입력하세요"
                  className="w-full min-w-0 border border-[var(--line)] bg-[#f8fafb] px-2.5 py-2 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                />
              </label>
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="border border-[var(--line)] px-2 py-1.5 text-xs disabled:opacity-30"
                  aria-label="위로"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === rows.length - 1}
                  className="border border-[var(--line)] px-2 py-1.5 text-xs disabled:opacity-30"
                  aria-label="아래로"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-2 py-1.5 text-xs text-red-600 hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}

function ensurePerformanceIds(items: PerformanceItem[]): PerformanceItem[] {
  return items.map((item, index) =>
    item.id
      ? item
      : {
          ...item,
          id: `p-${index}-${Math.random().toString(36).slice(2, 9)}`,
        },
  );
}

function PerformanceEditor({
  ui,
  items,
  onSave,
}: {
  ui: AdminUi;
  items: PerformanceItem[];
  onSave: (items: PerformanceItem[]) => void | Promise<void>;
}) {
  const [rows, setRows] = useState(() => ensurePerformanceIds(items));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  useEffect(() => {
    if (dirty) return;
    setRows(ensurePerformanceIds(items));
  }, [items, dirty]);

  function updateItem(index: number, patch: Partial<PerformanceItem>) {
    setDirty(true);
    setSavedFlash(false);
    setRows((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setDirty(true);
    setSavedFlash(false);
    setRows((prev) => [...prev, { id: `p-${Date.now()}`, date: "", detail: "", client: "" }]);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const next = index + direction;
    setRows((prev) => {
      if (next < 0 || next >= prev.length) return prev;
      setDirty(true);
      setSavedFlash(false);
      const copy = [...prev];
      const tmp = copy[index];
      copy[index] = copy[next];
      copy[next] = tmp;
      return copy;
    });
  }

  function requestRemove(index: number) {
    setPendingDelete(index);
  }

  function confirmRemove() {
    if (pendingDelete === null) return;
    const index = pendingDelete;
    setPendingDelete(null);
    setDirty(true);
    setSavedFlash(false);
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(rows);
    setSaving(false);
    setDirty(false);
    setSavedFlash(true);
  }

  return (
    <>
      <Panel title={ui.performance} hint={ui.performanceHint}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-[var(--muted)]">{ui.total(rows.length)}</p>
          <button
            type="button"
            onClick={addItem}
            className="btn border border-[var(--line)] bg-white text-sm"
          >
            {ui.performanceAdd}
          </button>
        </div>

        <div className="overflow-x-auto border border-[var(--line)]">
          <div className="hidden min-w-[40rem] border-b border-[var(--line)] bg-[#f5f7f9] px-3 py-2 text-xs font-medium text-[var(--muted)] sm:grid sm:grid-cols-[8.5rem_1fr_9rem_7.5rem] sm:gap-3 sm:px-4">
            <span>{ui.date}</span>
            <span>{ui.detail}</span>
            <span>{ui.performanceClient}</span>
            <span className="text-right">{ui.manage}</span>
          </div>

          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">{ui.performanceEmpty}</p>
          ) : (
            rows.map((item, index) => (
              <div
                key={item.id || `perf-${index}`}
                className="grid min-w-[40rem] gap-2 border-b border-[var(--line)] px-3 py-3 last:border-b-0 sm:grid-cols-[8.5rem_1fr_9rem_7.5rem] sm:items-start sm:gap-3 sm:px-4"
              >
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-[var(--muted)] sm:hidden">
                    {ui.date}
                  </span>
                  <input
                    value={item.date}
                    onChange={(e) => updateItem(index, { date: e.target.value })}
                    placeholder="2022.11.30"
                    className="w-full border border-[var(--line)] bg-[#f8fafb] px-2.5 py-2 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                  />
                </label>
                <label className="block min-w-0 text-sm">
                  <span className="mb-1 block text-xs font-medium text-[var(--muted)] sm:hidden">
                    {ui.detail}
                  </span>
                  <input
                    value={item.detail}
                    onChange={(e) => updateItem(index, { detail: e.target.value })}
                    placeholder={ui.detail}
                    className="w-full min-w-0 border border-[var(--line)] bg-[#f8fafb] px-2.5 py-2 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-[var(--muted)] sm:hidden">
                    {ui.performanceClient}
                  </span>
                  <input
                    value={item.client}
                    onChange={(e) => updateItem(index, { client: e.target.value })}
                    placeholder={ui.performanceClient}
                    className="w-full border border-[var(--line)] bg-[#f8fafb] px-2.5 py-2 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                  />
                </label>
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="border border-[var(--line)] px-2 py-1.5 text-xs disabled:opacity-30"
                    aria-label="위로"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === rows.length - 1}
                    className="border border-[var(--line)] px-2 py-1.5 text-xs disabled:opacity-30"
                    aria-label="아래로"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => requestRemove(index)}
                    className="px-2 py-1.5 text-xs text-red-600 hover:underline"
                  >
                    {ui.delete}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--line)] pt-4">
          {savedFlash && !dirty ? (
            <p className="text-sm text-emerald-700">{ui.performanceSaved}</p>
          ) : dirty ? (
            <p className="text-sm text-[var(--muted)]">
              {ui.editing(ui.performance)}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || !dirty}
            className="btn btn-primary text-sm disabled:opacity-40"
          >
            {saving ? ui.saving : ui.performanceSave}
          </button>
        </div>
      </Panel>

      {pendingDelete !== null && (
        <ConfirmDialog
          title={ui.confirmTitle}
          message={ui.performanceDeleteConfirm}
          confirmLabel={ui.confirmOk}
          cancelLabel={ui.confirmCancel}
          onConfirm={confirmRemove}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  );
}

function PasswordPanel() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });

    setSaving(false);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "비밀번호 변경에 실패했습니다.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("비밀번호가 변경되었습니다. 다음 로그인부터 새 비밀번호를 사용하세요.");
  }

  return (
    <form onSubmit={onSubmit}>
      <Panel
        title="비밀번호 변경"
        hint="현재 비밀번호 확인 후 새 비밀번호로 변경합니다. 변경된 비밀번호는 서버에 안전하게 저장됩니다."
      >
        <label className="block min-w-0 text-sm font-medium text-[var(--ink)]">
          현재 비밀번호
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1.5 w-full min-w-0 border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
            autoComplete="current-password"
            required
          />
        </label>
        <label className="block min-w-0 text-sm font-medium text-[var(--ink)]">
          새 비밀번호
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1.5 w-full min-w-0 border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>
        <label className="block min-w-0 text-sm font-medium text-[var(--ink)]">
          새 비밀번호 확인
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 w-full min-w-0 border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-700">{message}</p>}

        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={saving}>
          {saving ? "변경 중…" : "비밀번호 변경"}
        </button>
      </Panel>
    </form>
  );
}

function InquiriesPanel({ ui }: { ui: AdminUi }) {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

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

  async function confirmRemove() {
    if (!pendingId) return;
    const id = pendingId;
    setPendingId(null);
    const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <>
      <Panel title={ui.inquiriesTitle} hint={ui.inquiriesHint}>
        {loading ? (
          <p className="text-sm text-[var(--muted)]">{ui.inquiriesLoading}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">{ui.inquiriesEmpty}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="border border-[var(--line)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[var(--ink)]">{item.name}</p>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">
                      {item.email}
                      {item.phone ? ` · ${item.phone}` : ""}
                      {item.company ? ` · ${item.company}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <time className="text-xs text-[var(--muted)]">
                      {new Date(item.createdAt).toLocaleString()}
                    </time>
                    <button
                      type="button"
                      onClick={() => setPendingId(item.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      {ui.inquiriesDelete}
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
      {pendingId !== null && (
        <ConfirmDialog
          title={ui.confirmTitle}
          message={ui.inquiryDeleteConfirm}
          confirmLabel={ui.confirmOk}
          cancelLabel={ui.confirmCancel}
          onConfirm={() => void confirmRemove()}
          onCancel={() => setPendingId(null)}
        />
      )}
    </>
  );
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={cancelLabel}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative w-full max-w-sm border border-[var(--line)] bg-white p-5 shadow-lg sm:p-6"
      >
        <h3
          id="confirm-dialog-title"
          className="text-sm font-medium tracking-wide text-[var(--ink)]"
        >
          {title}
        </h3>
        <p
          id="confirm-dialog-desc"
          className="mt-3 text-sm font-normal leading-relaxed text-[var(--muted)]"
        >
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--ink)] hover:bg-[#f5f7f9]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-[var(--navy)] px-4 py-2 text-sm font-normal text-white hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function emptyClientItem(): ClientItem {
  return { id: `c-${Date.now()}`, name: "", logo: "" };
}

function ClientsEditor({
  ui,
  clients,
  onChange,
}: {
  ui: AdminUi;
  clients: { title: string; lead: string; items: ClientItem[] };
  onChange: (clients: { title: string; lead: string; items: ClientItem[] }) => void;
}) {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<ClientItem>(emptyClientItem);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  function openCreate() {
    setMode("create");
    setEditingIndex(null);
    setDraft(emptyClientItem());
    setUploadError("");
  }

  function openEdit(index: number) {
    setMode("edit");
    setEditingIndex(index);
    setDraft({ ...clients.items[index] });
    setUploadError("");
  }

  function cancelForm() {
    setMode("list");
    setEditingIndex(null);
    setDraft(emptyClientItem());
    setUploadError("");
  }

  function saveForm() {
    if (mode === "create") {
      onChange({ ...clients, items: [...clients.items, draft] });
    } else if (mode === "edit" && editingIndex !== null) {
      onChange({
        ...clients,
        items: clients.items.map((item, i) => (i === editingIndex ? draft : item)),
      });
    }
    cancelForm();
  }

  function removeItem(index: number) {
    setPendingDelete(index);
  }

  function confirmRemove() {
    if (pendingDelete === null) return;
    const index = pendingDelete;
    setPendingDelete(null);
    if (editingIndex === index) cancelForm();
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
    onChange({
      ...clients,
      items: clients.items.filter((_, i) => i !== index),
    });
  }

  async function uploadLogo(file: File) {
    setUploadError("");
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "업로드 실패");
      return;
    }
    const data = (await res.json()) as { url: string };
    setDraft((prev) => ({ ...prev, logo: data.url }));
  }

  return (
    <>
    <Panel
      title={ui.clients}
      hint={ui.clientsHint}
    >
      <Field
        label={ui.sectionTitle}
        value={clients.title}
        onChange={(v) => onChange({ ...clients, title: v })}
      />
      <TextArea
        label={ui.intro}
        value={clients.lead}
        onChange={(v) => onChange({ ...clients, lead: v })}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-4">
        <p className="text-sm text-[var(--muted)]">{ui.total(clients.items.length)}</p>
        <button
          type="button"
          onClick={openCreate}
          className="btn btn-primary text-sm"
          disabled={mode !== "list"}
        >
          {ui.register}
        </button>
      </div>

      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full min-w-[28rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[#f5f7f9] text-left text-xs font-semibold text-[var(--muted)]">
              <th className="w-12 px-3 py-2.5 text-center">No</th>
              <th className="w-16 px-3 py-2.5">로고</th>
              <th className="px-3 py-2.5">고객사명</th>
              <th className="w-28 px-3 py-2.5 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {clients.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[var(--muted)]">
                  등록된 고객사가 없습니다. 등록 버튼으로 추가하세요.
                </td>
              </tr>
            ) : (
              clients.items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-[var(--line)] last:border-b-0 ${
                    editingIndex === index ? "bg-[#f0f4f8]" : "bg-white"
                  }`}
                >
                  <td className="px-3 py-2.5 text-center text-[var(--muted)]">{index + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex h-10 w-14 items-center justify-center overflow-hidden border border-[var(--line)] bg-[#f8fafb]">
                      {item.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.logo} alt="" className="max-h-full max-w-full object-contain p-1" />
                      ) : (
                        <span className="text-[10px] text-[var(--muted)]">없음</span>
                      )}
                    </div>
                  </td>
                  <td className="max-w-[16rem] truncate px-3 py-2.5 font-medium text-[var(--ink)]">
                    {item.name || "(이름 없음)"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(index)}
                        disabled={mode !== "list"}
                        className="border border-[var(--line)] px-2 py-1 text-xs hover:bg-[#f5f7f9] disabled:opacity-30"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={mode !== "list"}
                        className="px-2 py-1 text-xs text-red-600 hover:underline disabled:opacity-30"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mode !== "list" && (
        <div className="border border-[var(--navy)] bg-[#f8fafb] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[var(--ink)]">
              {mode === "create" ? "고객사 등록" : "고객사 수정"}
            </h3>
            <button type="button" onClick={cancelForm} className="text-sm text-[var(--muted)] hover:underline">
              취소
            </button>
          </div>

          <Field
            label="고객사명"
            value={draft.name}
            onChange={(v) => setDraft((prev) => ({ ...prev, name: v }))}
          />

          <ImageAttach
            label="로고"
            hint="선택 사항 · JPG, PNG, WEBP"
            value={draft.logo}
            uploading={uploading}
            fit="contain"
            onFile={(file) => void uploadLogo(file)}
            onClear={() => setDraft((prev) => ({ ...prev, logo: "" }))}
          />

          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={cancelForm}
              className="btn border border-[var(--line)] bg-white text-sm"
            >
              취소
            </button>
            <button
              type="button"
              onClick={saveForm}
              className="border border-[var(--navy)] bg-white px-4 py-2 text-sm text-[var(--navy)] hover:bg-[#f5f7f9]"
            >
              {mode === "create" ? ui.applyAdd : ui.applyEdit}
            </button>
          </div>
        </div>
      )}
    </Panel>
    {pendingDelete !== null && (
      <ConfirmDialog
        title={ui.confirmTitle}
        message={ui.clientDeleteConfirm}
        confirmLabel={ui.confirmOk}
        cancelLabel={ui.confirmCancel}
        onConfirm={confirmRemove}
        onCancel={() => setPendingDelete(null)}
      />
    )}
    </>
  );
}

function emptyTeamMember(): TeamMember {
  return { name: "", role: "", bio: "", photo: "" };
}

function TeamEditor({
  ui,
  team,
  onChange,
}: {
  ui: AdminUi;
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
  type EditTarget = { kind: "ceo" } | { kind: "member"; index: number };

  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [draft, setDraft] = useState<TeamMember>(emptyTeamMember);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  function openCreate() {
    setMode("create");
    setTarget(null);
    setDraft(emptyTeamMember());
    setUploadError("");
  }

  function openEdit(next: EditTarget) {
    setMode("edit");
    setTarget(next);
    setDraft(next.kind === "ceo" ? { ...team.ceo } : { ...team.members[next.index] });
    setUploadError("");
  }

  function cancelForm() {
    setMode("list");
    setTarget(null);
    setDraft(emptyTeamMember());
    setUploadError("");
  }

  function saveForm() {
    if (mode === "create") {
      onChange({ ...team, members: [...team.members, draft] });
    } else if (mode === "edit" && target) {
      if (target.kind === "ceo") {
        onChange({ ...team, ceo: draft });
      } else {
        onChange({
          ...team,
          members: team.members.map((item, i) => (i === target.index ? draft : item)),
        });
      }
    }
    cancelForm();
  }

  function removeMember(index: number) {
    setPendingDelete(index);
  }

  function confirmRemoveMember() {
    if (pendingDelete === null) return;
    const index = pendingDelete;
    setPendingDelete(null);
    if (target?.kind === "member" && target.index === index) cancelForm();
    onChange({
      ...team,
      members: team.members.filter((_, i) => i !== index),
    });
  }

  async function uploadPhoto(file: File) {
    setUploadError("");
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "업로드 실패");
      return;
    }
    const data = (await res.json()) as { url: string };
    setDraft((prev) => ({ ...prev, photo: data.url }));
  }

  const rows: { key: string; label: string; person: TeamMember; target: EditTarget; removable: boolean }[] = [
    { key: "ceo", label: "대표", person: team.ceo, target: { kind: "ceo" }, removable: false },
    ...team.members.map((person, index) => ({
      key: `m-${index}`,
      label: "팀원",
      person,
      target: { kind: "member" as const, index },
      removable: true,
    })),
  ];

  return (
    <>
    <Panel title={ui.team} hint={ui.teamHint}>
      <Field
        label={ui.sectionTitle}
        value={team.title}
        onChange={(v) => onChange({ ...team, title: v })}
      />
      <TextArea
        label={ui.intro}
        value={team.lead}
        onChange={(v) => onChange({ ...team, lead: v })}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-4">
        <p className="text-sm text-[var(--muted)]">{ui.totalPeople(rows.length)}</p>
        <button
          type="button"
          onClick={openCreate}
          className="btn btn-primary text-sm"
          disabled={mode !== "list"}
        >
          {ui.register}
        </button>
      </div>

      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[#f5f7f9] text-left text-xs font-semibold text-[var(--muted)]">
              <th className="w-12 px-3 py-2.5 text-center">No</th>
              <th className="w-14 px-3 py-2.5">사진</th>
              <th className="w-16 px-3 py-2.5">구분</th>
              <th className="px-3 py-2.5">이름</th>
              <th className="hidden px-3 py-2.5 md:table-cell">직책</th>
              <th className="w-28 px-3 py-2.5 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const editing =
                mode === "edit" &&
                ((row.target.kind === "ceo" && target?.kind === "ceo") ||
                  (row.target.kind === "member" &&
                    target?.kind === "member" &&
                    target.index === row.target.index));
              return (
                <tr
                  key={row.key}
                  className={`border-b border-[var(--line)] last:border-b-0 ${
                    editing ? "bg-[#f0f4f8]" : "bg-white"
                  }`}
                >
                  <td className="px-3 py-2.5 text-center text-[var(--muted)]">{index + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="h-10 w-10 overflow-hidden border border-[var(--line)] bg-[#f8fafb]">
                      {row.person.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={row.person.photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-[var(--muted)]">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--muted)]">{row.label}</td>
                  <td className="max-w-[10rem] truncate px-3 py-2.5 font-medium text-[var(--ink)]">
                    {row.person.name || "(이름 없음)"}
                  </td>
                  <td className="hidden max-w-[12rem] truncate px-3 py-2.5 text-[var(--muted)] md:table-cell">
                    {row.person.role || "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(row.target)}
                        disabled={mode !== "list"}
                        className="border border-[var(--line)] px-2 py-1 text-xs hover:bg-[#f5f7f9] disabled:opacity-30"
                      >
                        수정
                      </button>
                      {row.removable ? (
                        <button
                          type="button"
                          onClick={() => removeMember(row.target.kind === "member" ? row.target.index : -1)}
                          disabled={mode !== "list"}
                          className="px-2 py-1 text-xs text-red-600 hover:underline disabled:opacity-30"
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {mode !== "list" && (
        <div className="border border-[var(--navy)] bg-[#f8fafb] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[var(--ink)]">
              {mode === "create"
                ? "팀원 등록"
                : target?.kind === "ceo"
                  ? "대표 수정"
                  : "팀원 수정"}
            </h3>
            <button type="button" onClick={cancelForm} className="text-sm text-[var(--muted)] hover:underline">
              취소
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="이름"
              value={draft.name}
              onChange={(v) => setDraft((prev) => ({ ...prev, name: v }))}
            />
            <Field
              label="직책"
              value={draft.role}
              onChange={(v) => setDraft((prev) => ({ ...prev, role: v }))}
            />
          </div>
          <TextArea
            label="소개"
            value={draft.bio}
            onChange={(v) => setDraft((prev) => ({ ...prev, bio: v }))}
          />

          <ImageAttach
            label="사진"
            hint="JPG, PNG, WEBP · 클릭하거나 버튼으로 첨부"
            value={draft.photo}
            uploading={uploading}
            fit="cover"
            onFile={(file) => void uploadPhoto(file)}
            onClear={() => setDraft((prev) => ({ ...prev, photo: "" }))}
          />

          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={cancelForm}
              className="btn border border-[var(--line)] bg-white text-sm"
            >
              취소
            </button>
            <button
              type="button"
              onClick={saveForm}
              className="border border-[var(--navy)] bg-white px-4 py-2 text-sm text-[var(--navy)] hover:bg-[#f5f7f9]"
            >
              {mode === "create" ? ui.applyAdd : ui.applyEdit}
            </button>
          </div>
        </div>
      )}
    </Panel>
    {pendingDelete !== null && (
      <ConfirmDialog
        title={ui.confirmTitle}
        message={ui.teamDeleteConfirm}
        confirmLabel={ui.confirmOk}
        cancelLabel={ui.confirmCancel}
        onConfirm={confirmRemoveMember}
        onCancel={() => setPendingDelete(null)}
      />
    )}
    </>
  );
}

function emptyGalleryItem(): GalleryItem {
  return { id: `g-${Date.now()}`, title: "", image: "", caption: "" };
}

function GalleryEditor({
  ui,
  gallery,
  onChange,
}: {
  ui: AdminUi;
  gallery: { title: string; lead: string; items: GalleryItem[] };
  onChange: (gallery: { title: string; lead: string; items: GalleryItem[] }) => void;
}) {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<GalleryItem>(emptyGalleryItem);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  function openCreate() {
    setMode("create");
    setEditingIndex(null);
    setDraft(emptyGalleryItem());
    setUploadError("");
  }

  function openEdit(index: number) {
    setMode("edit");
    setEditingIndex(index);
    setDraft({ ...gallery.items[index] });
    setUploadError("");
  }

  function cancelForm() {
    setMode("list");
    setEditingIndex(null);
    setDraft(emptyGalleryItem());
    setUploadError("");
  }

  function saveForm() {
    if (mode === "create") {
      onChange({ ...gallery, items: [...gallery.items, draft] });
    } else if (mode === "edit" && editingIndex !== null) {
      onChange({
        ...gallery,
        items: gallery.items.map((item, i) => (i === editingIndex ? draft : item)),
      });
    }
    cancelForm();
  }

  function removeItem(index: number) {
    setPendingDelete(index);
  }

  function confirmRemoveGallery() {
    if (pendingDelete === null) return;
    const index = pendingDelete;
    setPendingDelete(null);
    if (editingIndex === index) cancelForm();
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
    onChange({
      ...gallery,
      items: gallery.items.filter((_, i) => i !== index),
    });
  }

  function moveItem(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= gallery.items.length) return;
    const copy = [...gallery.items];
    const tmp = copy[index];
    copy[index] = copy[next];
    copy[next] = tmp;
    onChange({ ...gallery, items: copy });
    if (editingIndex === index) setEditingIndex(next);
    else if (editingIndex === next) setEditingIndex(index);
  }

  async function uploadImage(file: File) {
    setUploadError("");
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "업로드 실패");
      return;
    }
    const data = (await res.json()) as { url: string };
    setDraft((prev) => ({ ...prev, image: data.url }));
  }

  return (
    <>
    <Panel
      title={ui.gallery}
      hint={ui.galleryHint}
    >
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

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-4">
        <p className="text-sm text-[var(--muted)]">총 {gallery.items.length}건</p>
        <button
          type="button"
          onClick={openCreate}
          className="btn btn-primary text-sm"
          disabled={mode !== "list"}
        >
          등록
        </button>
      </div>

      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[#f5f7f9] text-left text-xs font-semibold text-[var(--muted)]">
              <th className="w-12 px-3 py-2.5 text-center">No</th>
              <th className="w-20 px-3 py-2.5">이미지</th>
              <th className="px-3 py-2.5">제목</th>
              <th className="hidden px-3 py-2.5 md:table-cell">설명</th>
              <th className="w-40 px-3 py-2.5 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {gallery.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--muted)]">
                  등록된 사진이 없습니다. 등록 버튼으로 추가하세요.
                </td>
              </tr>
            ) : (
              gallery.items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-[var(--line)] last:border-b-0 ${
                    editingIndex === index ? "bg-[#f0f4f8]" : "bg-white"
                  }`}
                >
                  <td className="px-3 py-2.5 text-center text-[var(--muted)]">{index + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="h-12 w-16 overflow-hidden border border-[var(--line)] bg-[#f8fafb]">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-[var(--muted)]">
                          없음
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="max-w-[12rem] truncate px-3 py-2.5 font-medium text-[var(--ink)]">
                    {item.title || "(제목 없음)"}
                  </td>
                  <td className="hidden max-w-[16rem] truncate px-3 py-2.5 text-[var(--muted)] md:table-cell">
                    {item.caption || "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0 || mode !== "list"}
                        className="border border-[var(--line)] px-1.5 py-1 text-xs disabled:opacity-30"
                        aria-label="위로"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === gallery.items.length - 1 || mode !== "list"}
                        className="border border-[var(--line)] px-1.5 py-1 text-xs disabled:opacity-30"
                        aria-label="아래로"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(index)}
                        disabled={mode !== "list"}
                        className="border border-[var(--line)] px-2 py-1 text-xs hover:bg-[#f5f7f9] disabled:opacity-30"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={mode !== "list"}
                        className="px-2 py-1 text-xs text-red-600 hover:underline disabled:opacity-30"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mode !== "list" && (
        <div className="border border-[var(--navy)] bg-[#f8fafb] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[var(--ink)]">
              {mode === "create" ? "사진 등록" : "사진 수정"}
            </h3>
            <button type="button" onClick={cancelForm} className="text-sm text-[var(--muted)] hover:underline">
              취소
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[200px_1fr]">
            <ImageAttach
              label="이미지"
              hint="미리보기 클릭 또는 아래 버튼"
              value={draft.image}
              uploading={uploading}
              fit="cover"
              aspect="wide"
              onFile={(file) => void uploadImage(file)}
              onClear={() => setDraft((prev) => ({ ...prev, image: "" }))}
            />

            <div className="grid gap-3">
              <Field
                label="제목"
                value={draft.title}
                onChange={(v) => setDraft((prev) => ({ ...prev, title: v }))}
              />
              <Field
                label="설명"
                value={draft.caption}
                onChange={(v) => setDraft((prev) => ({ ...prev, caption: v }))}
              />
              <Field
                label="이미지 URL"
                value={draft.image}
                onChange={(v) => setDraft((prev) => ({ ...prev, image: v }))}
              />
              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="btn border border-[var(--line)] bg-white text-sm"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={saveForm}
                  className="border border-[var(--navy)] bg-white px-4 py-2 text-sm text-[var(--navy)] hover:bg-[#f5f7f9]"
                >
                  {mode === "create" ? ui.applyAdd : ui.applyEdit}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Panel>
    {pendingDelete !== null && (
      <ConfirmDialog
        title={ui.confirmTitle}
        message={ui.galleryDeleteConfirm}
        confirmLabel={ui.confirmOk}
        cancelLabel={ui.confirmCancel}
        onConfirm={confirmRemoveGallery}
        onCancel={() => setPendingDelete(null)}
      />
    )}
    </>
  );
}

function ImageAttach({
  label,
  hint,
  value,
  uploading,
  fit = "cover",
  aspect = "square",
  onFile,
  onClear,
}: {
  label: string;
  hint?: string;
  value: string;
  uploading?: boolean;
  fit?: "cover" | "contain";
  aspect?: "square" | "wide";
  onFile: (file: File) => void;
  onClear?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    if (uploading) return;
    inputRef.current?.click();
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-[var(--ink)]">{label}</p>
        {hint ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
      </div>

      <div
        className={`flex flex-wrap items-stretch gap-3 ${
          aspect === "wide" ? "flex-col" : ""
        }`}
      >
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className={`group relative overflow-hidden border border-dashed border-[var(--line)] bg-white text-left transition hover:border-[var(--navy)] hover:bg-[#f5f8fb] disabled:opacity-60 ${
            aspect === "wide" ? "aspect-[4/3] w-full" : "h-24 w-24 shrink-0"
          }`}
          aria-label={value ? `${label} 변경` : `${label} 첨부`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className={`h-full w-full ${fit === "contain" ? "object-contain p-2" : "object-cover"}`}
            />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-[var(--muted)]">
              <span className="text-lg leading-none text-[var(--navy)]" aria-hidden>
                +
              </span>
              <span className="text-[11px] font-medium">사진 첨부</span>
            </span>
          )}
          {uploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-xs font-medium text-[var(--ink)]">
              업로드 중…
            </span>
          ) : null}
        </button>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className="btn btn-primary w-full max-w-[14rem] text-sm disabled:opacity-60"
          >
            {uploading ? "업로드 중…" : value ? "사진 변경" : "사진 선택"}
          </button>
          {value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              disabled={uploading}
              className="w-full max-w-[14rem] border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--muted)] hover:text-red-600 disabled:opacity-60"
            >
              사진 삭제
            </button>
          ) : null}
          <p className="text-xs text-[var(--muted)]">미리보기 영역을 눌러도 파일을 선택할 수 있습니다.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Panel({
  title,
  hint,
  layout = "stack",
  children,
}: {
  title: string;
  hint?: string;
  layout?: "stack" | "table";
  children: ReactNode;
}) {
  return (
    <section className="w-full min-w-0 border border-[var(--line)] bg-white p-4 sm:p-5 md:p-6">
      <div className="mb-5">
        <h2 className="font-display text-base font-bold sm:text-lg">{title}</h2>
        {hint && <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>}
      </div>
      {layout === "table" ? (
        <div className="overflow-hidden border border-[var(--line)]">{children}</div>
      ) : (
        <div className="grid gap-4">{children}</div>
      )}
    </section>
  );
}

function ListRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2 border-b border-[var(--line)] bg-white px-3 py-3 last:border-b-0 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-4 sm:px-4">
      <p className="shrink-0 text-sm font-semibold text-[var(--ink)]">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 border border-[var(--line)] bg-[#f8fafb] px-3 py-2 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
      />
    </div>
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
    <label className="block min-w-0 text-sm font-medium text-[var(--ink)]">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full min-w-0 border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
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
    <label className="block min-w-0 text-sm font-medium text-[var(--ink)]">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full min-w-0 resize-y border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
      />
    </label>
  );
}
