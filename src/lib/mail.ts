import { promises as fs } from "fs";
import nodemailer from "nodemailer";
import { ensureDataDir, getDataDir } from "@/lib/storage";
import type { Inquiry } from "@/lib/inquiry";
import path from "path";

export type MailSettings = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  to: string;
};

export type PublicMailSettings = Omit<MailSettings, "pass"> & {
  hasPassword: boolean;
};

const DEFAULTS: MailSettings = {
  enabled: false,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  user: "",
  pass: "",
  fromName: "Hankook Service Center",
  fromEmail: "",
  to: "",
};

export function mailFilePath() {
  return path.join(getDataDir(), "mail.json");
}

function fromEnv(): Partial<MailSettings> {
  const port = Number(process.env.SMTP_PORT || "");
  return {
    ...(process.env.SMTP_ENABLED === "true" ? { enabled: true } : {}),
    ...(process.env.SMTP_HOST ? { host: process.env.SMTP_HOST } : {}),
    ...(Number.isFinite(port) && port > 0 ? { port } : {}),
    ...(process.env.SMTP_SECURE === "false" ? { secure: false } : {}),
    ...(process.env.SMTP_SECURE === "true" ? { secure: true } : {}),
    ...(process.env.SMTP_USER ? { user: process.env.SMTP_USER } : {}),
    ...(process.env.SMTP_PASS ? { pass: process.env.SMTP_PASS } : {}),
    ...(process.env.SMTP_FROM_NAME ? { fromName: process.env.SMTP_FROM_NAME } : {}),
    ...(process.env.SMTP_FROM_EMAIL ? { fromEmail: process.env.SMTP_FROM_EMAIL } : {}),
    ...(process.env.MAIL_TO ? { to: process.env.MAIL_TO } : {}),
  };
}

export async function readMailSettings(): Promise<MailSettings> {
  let stored: Partial<MailSettings> = {};
  try {
    const raw = await fs.readFile(mailFilePath(), "utf-8");
    stored = JSON.parse(raw) as Partial<MailSettings>;
  } catch {
    // no file yet
  }

  return {
    ...DEFAULTS,
    ...fromEnv(),
    ...stored,
    port: Number(stored.port ?? fromEnv().port ?? DEFAULTS.port) || DEFAULTS.port,
    enabled: Boolean(stored.enabled ?? fromEnv().enabled ?? DEFAULTS.enabled),
    secure: Boolean(
      stored.secure ??
        fromEnv().secure ??
        (Number(stored.port ?? fromEnv().port ?? DEFAULTS.port) === 465),
    ),
  };
}

export function toPublicMailSettings(settings: MailSettings): PublicMailSettings {
  const { pass, ...rest } = settings;
  return {
    ...rest,
    hasPassword: Boolean(pass),
  };
}

export async function writeMailSettings(
  input: Partial<MailSettings> & { pass?: string },
  keepExistingPass = true,
): Promise<MailSettings> {
  const current = await readMailSettings();
  const next: MailSettings = {
    enabled: Boolean(input.enabled),
    host: String(input.host || current.host || DEFAULTS.host).trim() || DEFAULTS.host,
    port: Number(input.port) || current.port || DEFAULTS.port,
    secure: Boolean(input.secure),
    user: String(input.user || "").trim(),
    pass:
      typeof input.pass === "string" && input.pass.length > 0
        ? input.pass
        : keepExistingPass
          ? current.pass
          : "",
    fromName: String(input.fromName || current.fromName || DEFAULTS.fromName).trim(),
    fromEmail: String(input.fromEmail || "").trim(),
    to: String(input.to || "").trim(),
  };

  await ensureDataDir();
  await fs.writeFile(mailFilePath(), JSON.stringify(next, null, 2), "utf-8");
  return next;
}

function isReady(settings: MailSettings) {
  return (
    settings.enabled &&
    Boolean(settings.host) &&
    Boolean(settings.user) &&
    Boolean(settings.pass) &&
    Boolean(settings.to)
  );
}

function formatInquiryMail(inquiry: Inquiry) {
  const subject = `[문의] ${inquiry.name}${inquiry.company ? ` · ${inquiry.company}` : ""}`;
  const text = [
    "사이트에서 새 문의가 접수되었습니다.",
    "",
    `이름: ${inquiry.name}`,
    `이메일: ${inquiry.email}`,
    `연락처: ${inquiry.phone || "-"}`,
    `회사: ${inquiry.company || "-"}`,
    `일시: ${inquiry.createdAt}`,
    "",
    "내용:",
    inquiry.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <p>사이트에서 새 문의가 접수되었습니다.</p>
      <table style="border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:4px 12px 4px 0;color:#666">이름</td><td>${escapeHtml(inquiry.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">이메일</td><td>${escapeHtml(inquiry.email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">연락처</td><td>${escapeHtml(inquiry.phone || "-")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">회사</td><td>${escapeHtml(inquiry.company || "-")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">일시</td><td>${escapeHtml(inquiry.createdAt)}</td></tr>
      </table>
      <p style="color:#666;margin:0 0 6px">내용</p>
      <pre style="white-space:pre-wrap;background:#f5f7f9;padding:12px;border:1px solid #e5e7eb">${escapeHtml(inquiry.message)}</pre>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendInquiryEmail(inquiry: Inquiry): Promise<{ ok: true } | { ok: false; error: string }> {
  const settings = await readMailSettings();
  if (!isReady(settings)) {
    return { ok: false, error: "Mail is not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: {
        user: settings.user,
        pass: settings.pass,
      },
    });

    const { subject, text, html } = formatInquiryMail(inquiry);
    const fromEmail = settings.fromEmail || settings.user;
    const from = settings.fromName ? `"${settings.fromName}" <${fromEmail}>` : fromEmail;

    await transporter.sendMail({
      from,
      to: settings.to,
      replyTo: inquiry.email,
      subject,
      text,
      html,
    });

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send mail";
    console.error("[mail] sendInquiryEmail failed:", message);
    return { ok: false, error: message };
  }
}

export async function sendTestEmail(): Promise<{ ok: true } | { ok: false; error: string }> {
  const settings = await readMailSettings();
  if (!isReady(settings)) {
    return { ok: false, error: "메일 설정(활성화, 계정, 앱 비밀번호, 수신 주소)을 확인해 주세요." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: {
        user: settings.user,
        pass: settings.pass,
      },
    });

    const fromEmail = settings.fromEmail || settings.user;
    const from = settings.fromName ? `"${settings.fromName}" <${fromEmail}>` : fromEmail;

    await transporter.sendMail({
      from,
      to: settings.to,
      subject: "[테스트] Hankook Service Center 메일 설정",
      text: "Google SMTP 설정이 정상입니다. 문의 접수 시 이 주소로 메일이 발송됩니다.",
      html: "<p>Google SMTP 설정이 정상입니다.<br/>문의 접수 시 이 주소로 메일이 발송됩니다.</p>",
    });

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send mail";
    return { ok: false, error: message };
  }
}
