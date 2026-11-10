"use client";

import { useRef, useState } from "react";
import type { HeroSlide, LocaleContent } from "@/lib/types";
import type { AdminUi } from "@/lib/admin-ui";

function emptySlide(locale: "ko" | "en"): HeroSlide {
  return {
    id: `slide-${Date.now()}`,
    type: "image",
    src: "",
    label: "",
    brand: "Chicago Pneumatic",
    headline: "",
    subheadline: "",
    ctaLabel: locale === "ko" ? "제품 보기" : "View Products",
    ctaHref: "/services/chicago-pneumatic",
  };
}

function isVideoUrl(src: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src) || src.includes("/videos/");
}

export function HeroSlidesEditor({
  hero,
  locale,
  ui,
  onChange,
}: {
  hero: LocaleContent["hero"];
  locale: "ko" | "en";
  ui: AdminUi;
  onChange: (hero: LocaleContent["hero"]) => void;
}) {
  const slides = hero.slides || [];
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<HeroSlide>(emptySlide(locale));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function commitSlides(nextSlides: HeroSlide[]) {
    const firstVideo = nextSlides.find((slide) => slide.type === "video" && slide.src);
    onChange({
      ...hero,
      slides: nextSlides,
      videoUrl: firstVideo?.src || hero.videoUrl || "",
    });
  }

  function openCreate() {
    setMode("create");
    setEditingIndex(null);
    setDraft(emptySlide(locale));
    setUploadError("");
  }

  function openEdit(index: number) {
    setMode("edit");
    setEditingIndex(index);
    setDraft({ ...slides[index] });
    setUploadError("");
  }

  function cancelForm() {
    setMode("list");
    setEditingIndex(null);
    setDraft(emptySlide(locale));
    setUploadError("");
  }

  function saveForm() {
    if (!draft.src.trim()) {
      setUploadError(ui.heroMediaRequired);
      return;
    }
    const nextDraft: HeroSlide = {
      ...draft,
      type: draft.type === "video" || isVideoUrl(draft.src) ? "video" : "image",
      id: draft.id || `slide-${Date.now()}`,
    };
    if (mode === "create") {
      commitSlides([...slides, nextDraft]);
    } else if (mode === "edit" && editingIndex !== null) {
      commitSlides(slides.map((slide, i) => (i === editingIndex ? nextDraft : slide)));
    }
    cancelForm();
  }

  function confirmRemove() {
    if (pendingDelete === null) return;
    const index = pendingDelete;
    setPendingDelete(null);
    if (editingIndex === index) cancelForm();
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
    commitSlides(slides.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= slides.length) return;
    const copy = [...slides];
    const tmp = copy[index];
    copy[index] = copy[next];
    copy[next] = tmp;
    commitSlides(copy);
    if (editingIndex === index) setEditingIndex(next);
    else if (editingIndex === next) setEditingIndex(index);
  }

  async function uploadMedia(file: File) {
    setUploadError("");
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(
        typeof data.error === "string" ? data.error : ui.heroUploadFailed,
      );
      return;
    }
    const data = (await res.json()) as { url: string; warning?: string };
    const type: HeroSlide["type"] = file.type.startsWith("video/")
      ? "video"
      : "image";
    setDraft((prev) => ({ ...prev, src: data.url, type }));
    if (data.warning) setUploadError(data.warning);
  }

  return (
    <div className="grid gap-4 border-t border-[var(--line)] pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">{ui.heroSlides}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{ui.heroSlidesHint}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn btn-primary text-sm"
          disabled={mode !== "list"}
        >
          {ui.heroSlideAdd}
        </button>
      </div>

      <p className="text-sm text-[var(--muted)]">{ui.total(slides.length)}</p>

      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[#f5f7f9] text-left text-xs font-semibold text-[var(--muted)]">
              <th className="w-12 px-3 py-2.5 text-center">{ui.no}</th>
              <th className="w-24 px-3 py-2.5">{ui.heroMedia}</th>
              <th className="w-20 px-3 py-2.5">{ui.heroType}</th>
              <th className="px-3 py-2.5">{ui.headline}</th>
              <th className="hidden px-3 py-2.5 md:table-cell">{ui.brand}</th>
              <th className="w-40 px-3 py-2.5 text-right">{ui.manage}</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[var(--muted)]">
                  {ui.heroSlidesEmpty}
                </td>
              </tr>
            ) : (
              slides.map((slide, index) => (
                <tr
                  key={slide.id}
                  className={`border-b border-[var(--line)] last:border-b-0 ${
                    editingIndex === index ? "bg-[#f0f4f8]" : "bg-white"
                  }`}
                >
                  <td className="px-3 py-2.5 text-center text-[var(--muted)]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="h-12 w-20 overflow-hidden border border-[var(--line)] bg-[#f8fafb]">
                      {slide.src ? (
                        slide.type === "video" ? (
                          <video
                            src={slide.src}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={slide.src}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-[var(--muted)]">
                          {ui.none}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--muted)]">
                    {slide.type === "video" ? ui.heroTypeVideo : ui.heroTypeImage}
                  </td>
                  <td className="max-w-[14rem] truncate px-3 py-2.5 font-medium text-[var(--ink)]">
                    {slide.headline || slide.label || ui.noTitle}
                  </td>
                  <td className="hidden max-w-[10rem] truncate px-3 py-2.5 text-[var(--muted)] md:table-cell">
                    {slide.brand || "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0 || mode !== "list"}
                        className="border border-[var(--line)] px-1.5 py-1 text-xs disabled:opacity-30"
                        aria-label="up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === slides.length - 1 || mode !== "list"}
                        className="border border-[var(--line)] px-1.5 py-1 text-xs disabled:opacity-30"
                        aria-label="down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(index)}
                        disabled={mode !== "list"}
                        className="border border-[var(--line)] px-2 py-1 text-xs hover:bg-[#f5f7f9] disabled:opacity-30"
                      >
                        {ui.edit}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(index)}
                        disabled={mode !== "list"}
                        className="px-2 py-1 text-xs text-red-600 hover:underline disabled:opacity-30"
                      >
                        {ui.delete}
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
              {mode === "create" ? ui.heroSlideAdd : ui.heroSlideEdit}
            </h3>
            <button
              type="button"
              onClick={cancelForm}
              className="text-sm text-[var(--muted)] hover:underline"
            >
              {ui.cancel}
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            <div className="grid gap-2">
              <p className="text-sm font-medium text-[var(--ink)]">{ui.heroMedia}</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="group relative aspect-[16/10] w-full overflow-hidden border border-dashed border-[var(--line)] bg-white text-left transition hover:border-[var(--navy)] disabled:opacity-60"
              >
                {draft.src ? (
                  draft.type === "video" ? (
                    <video
                      src={draft.src}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.src} alt="" className="h-full w-full object-cover" />
                  )
                ) : (
                  <span className="flex h-full flex-col items-center justify-center gap-1 text-[var(--muted)]">
                    <span className="text-lg text-[var(--navy)]">+</span>
                    <span className="text-[11px] font-medium">{ui.heroMediaPick}</span>
                  </span>
                )}
                {uploading ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-xs font-medium">
                    {ui.heroUploading}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="btn btn-primary text-sm disabled:opacity-60"
              >
                {uploading
                  ? ui.heroUploading
                  : draft.src
                    ? ui.heroMediaChange
                    : ui.heroMediaPick}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
                className="sr-only"
                tabIndex={-1}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadMedia(file);
                  e.target.value = "";
                }}
              />
              <p className="text-xs text-[var(--muted)]">{ui.heroMediaHint}</p>
            </div>

            <div className="grid gap-3">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-[var(--ink)]">{ui.heroType}</span>
                <select
                  value={draft.type}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      type: e.target.value === "video" ? "video" : "image",
                    }))
                  }
                  className="border border-[var(--line)] bg-white px-3 py-2 text-sm"
                >
                  <option value="image">{ui.heroTypeImage}</option>
                  <option value="video">{ui.heroTypeVideo}</option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-[var(--ink)]">{ui.heroMediaUrl}</span>
                <input
                  value={draft.src}
                  onChange={(e) => {
                    const src = e.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      src,
                      type:
                        prev.type === "video" || isVideoUrl(src) ? "video" : "image",
                    }));
                  }}
                  className="border border-[var(--line)] bg-white px-3 py-2 text-sm"
                  placeholder="/images/hero/... or /uploads/..."
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-[var(--ink)]">{ui.brand}</span>
                <input
                  value={draft.brand}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  className="border border-[var(--line)] bg-white px-3 py-2 text-sm"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-[var(--ink)]">{ui.heroSlideLabel}</span>
                <input
                  value={draft.label}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, label: e.target.value }))
                  }
                  className="border border-[var(--line)] bg-white px-3 py-2 text-sm"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-[var(--ink)]">{ui.headline}</span>
                <input
                  value={draft.headline}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, headline: e.target.value }))
                  }
                  className="border border-[var(--line)] bg-white px-3 py-2 text-sm"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-[var(--ink)]">{ui.subheadline}</span>
                <textarea
                  value={draft.subheadline}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, subheadline: e.target.value }))
                  }
                  rows={3}
                  className="border border-[var(--line)] bg-white px-3 py-2 text-sm"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-[var(--ink)]">{ui.ctaLabel}</span>
                  <input
                    value={draft.ctaLabel}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, ctaLabel: e.target.value }))
                    }
                    className="border border-[var(--line)] bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-[var(--ink)]">{ui.ctaHref}</span>
                  <input
                    value={draft.ctaHref}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, ctaHref: e.target.value }))
                    }
                    className="border border-[var(--line)] bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>

              {uploadError ? (
                <p className="text-sm text-red-600">{uploadError}</p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="btn border border-[var(--line)] bg-white text-sm"
                >
                  {ui.cancel}
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

      {pendingDelete !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm border border-[var(--line)] bg-white p-5 shadow-lg">
            <h4 className="text-base font-bold text-[var(--ink)]">{ui.confirmTitle}</h4>
            <p className="mt-2 text-sm text-[var(--muted)]">{ui.heroSlideDeleteConfirm}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="border border-[var(--line)] px-3 py-2 text-sm"
              >
                {ui.confirmCancel}
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="bg-[var(--navy)] px-3 py-2 text-sm text-white"
              >
                {ui.confirmOk}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
