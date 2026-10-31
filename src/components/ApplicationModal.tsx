"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/components/LanguageProvider";

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 3;
const ALLOWED_EXT = new Set(["pdf", "doc", "docx"]);

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function extensionOf(name: string) {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

const fieldClass =
  "mt-1.5 w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--navy)]";

export function ApplicationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setFiles([]);
    setDone(false);
    setError("");
    setSending(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // onClose is stable enough for Escape; avoid re-running on parent re-renders
  }, [open]);

  function closeModal() {
    if (sending) return;
    onClose();
  }

  function onPickFiles(list: FileList | null) {
    if (!list?.length) return;
    setError("");
    const next = [...files];
    for (const file of Array.from(list)) {
      const ext = extensionOf(file.name);
      if (!ALLOWED_EXT.has(ext)) {
        setError(t.openApplyFileType);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(t.openApplyFileTooLarge);
        continue;
      }
      if (next.length >= MAX_FILES) break;
      if (!next.some((f) => f.name === file.name && f.size === file.size)) {
        next.push(file);
      }
    }
    setFiles(next.slice(0, MAX_FILES));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    setDone(false);

    const body = new FormData();
    body.set("name", name.trim());
    body.set("email", email.trim());
    body.set("phone", phone.trim());
    body.set("message", message.trim());
    for (const file of files) {
      body.append("files", file);
    }

    try {
      const res = await fetch("/api/applications", { method: "POST", body });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setSending(false);
      if (!res.ok) {
        setError(data?.error || t.openApplyError);
        return;
      }
      setDone(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setSending(false);
      setError(t.openApplyError);
    }
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={closeModal}
    >
      <div
        className="max-h-[min(92vh,40rem)] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--line)] bg-white px-5 py-4">
          <h3 id={titleId} className="font-display text-lg font-semibold text-[var(--ink)]">
            {t.openApplyModalTitle}
          </h3>
          <button
            type="button"
            onClick={closeModal}
            disabled={sending}
            className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)] disabled:opacity-50"
            aria-label={t.openApplyClose}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-5 py-5">
          <label className="block text-sm text-[var(--ink)]">
            {t.openApplyName} *
            <input
              required
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm text-[var(--ink)]">
            {t.openApplyEmail} *
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm text-[var(--ink)]">
            {t.openApplyPhone}
            <input
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm text-[var(--ink)]">
            {t.openApplyMessage} *
            <textarea
              required
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${fieldClass} resize-y`}
              placeholder={t.openApplyMessagePlaceholder}
            />
          </label>

          <div className="block text-sm text-[var(--ink)]">
            <span>{t.openApplyFile}</span>
            <p className="mt-1 text-xs text-[var(--muted)]">{t.openApplyFileHint}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              multiple
              className="mt-2 block w-full text-sm text-[var(--muted)] file:mr-3 file:border-0 file:bg-[var(--navy)] file:px-3 file:py-2 file:text-sm file:font-medium file:!text-white"
              onChange={(e) => onPickFiles(e.target.files)}
            />
            {files.length ? (
              <ul className="mt-2 space-y-1.5">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between gap-2 border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs"
                  >
                    <span className="min-w-0 truncate text-[var(--ink)]">
                      {file.name}{" "}
                      <span className="text-[var(--muted)]">
                        ({Math.max(1, Math.round(file.size / 1024))} KB)
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="shrink-0 text-[var(--muted)] underline hover:text-[var(--ink)]"
                    >
                      {t.openApplyClose}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {done ? <p className="text-sm text-emerald-700">{t.openApplySuccess}</p> : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center gap-2 bg-[var(--navy)] px-5 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-[var(--navy-deep)] disabled:opacity-60"
            >
              <SendIcon className="h-4 w-4" />
              {sending ? t.openApplySending : t.openApplySubmit}
            </button>
            <button
              type="button"
              onClick={closeModal}
              disabled={sending}
              className="px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-50"
            >
              {t.openApplyClose}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
