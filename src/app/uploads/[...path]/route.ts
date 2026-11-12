import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUploadPathWithFallback } from "@/lib/storage";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

type RouteContext = { params: Promise<{ path: string[] }> };

async function readFirstExisting(paths: Array<string | null>) {
  for (const filePath of paths) {
    if (!filePath) continue;
    try {
      const data = await fs.readFile(filePath);
      return { data, filePath };
    } catch {
      // try next
    }
  }
  return null;
}

export async function GET(request: Request, context: RouteContext) {
  const parts = (await context.params).path || [];
  if (!parts.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { runtime, seed } = resolveUploadPathWithFallback(parts);
  const hit = await readFirstExisting([runtime, seed]);
  if (!hit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(hit.filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  const url = new URL(request.url);
  const download = url.searchParams.get("download");
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  if (download) {
    const safeName = download.trim().slice(0, 180) || path.basename(hit.filePath);
    headers["Content-Disposition"] =
      `attachment; filename*=UTF-8''${encodeURIComponent(safeName)}`;
  }

  return new NextResponse(hit.data, { headers });
}
