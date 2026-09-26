import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import type { Inquiry } from "@/lib/inquiry";
import { ensureRuntimeInquiriesFile, inquiriesFilePath } from "@/lib/storage";

export const runtime = "nodejs";

async function readInquiries(): Promise<Inquiry[]> {
  try {
    const filePath = await ensureRuntimeInquiriesFile();
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

async function writeInquiries(items: Inquiry[]) {
  const filePath = await ensureRuntimeInquiriesFile();
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await readInquiries();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const company = String(body.company || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const inquiry: Inquiry = {
    id: `${Date.now()}-${randomBytes(3).toString("hex")}`,
    name: name.slice(0, 100),
    email: email.slice(0, 120),
    phone: phone.slice(0, 40),
    company: company.slice(0, 120),
    message: message.slice(0, 2000),
    createdAt: new Date().toISOString(),
  };

  const items = await readInquiries();
  items.unshift(inquiry);
  await writeInquiries(items.slice(0, 500));

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const items = await readInquiries();
  await writeInquiries(items.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
