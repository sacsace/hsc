import { NextResponse } from "next/server";
import { sendApplicationEmail } from "@/lib/mail";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 3;
const ALLOWED_EXT = new Set(["pdf", "doc", "docx"]);

function extensionOf(name: string) {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function safeFilename(name: string) {
  return name.replace(/[^\w.\-()\s가-힣]/g, "_").slice(0, 120) || "resume.pdf";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const message = String(form.get("message") || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (message.length > 4000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const rawFiles = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  if (rawFiles.length > MAX_FILES) {
    return NextResponse.json({ error: "Too many files" }, { status: 400 });
  }

  const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];

  for (const file of rawFiles) {
    const ext = extensionOf(file.name);
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    attachments.push({
      filename: safeFilename(file.name),
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || (ext === "pdf" ? "application/pdf" : "application/octet-stream"),
    });
  }

  const mail = await sendApplicationEmail({
    name: name.slice(0, 100),
    email: email.slice(0, 120),
    phone: phone.slice(0, 40),
    message: message.slice(0, 4000),
    attachments,
  });

  if (!mail.ok) {
    return NextResponse.json(
      { error: mail.error || "Failed to send application" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
