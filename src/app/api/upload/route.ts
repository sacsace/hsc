import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { ensureUploadsDir, storageStatus, uploadsDir } from "@/lib/storage";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const ext =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "gif";

  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  await ensureUploadsDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir(), name), buffer);

  const status = storageStatus();
  // Served by /uploads/[...path] from the persistent data volume (+ seed fallback)
  return NextResponse.json({
    url: `/uploads/${name}`,
    persistent: status.persistent,
    warning: status.uploadsAtRisk
      ? "Railway Volume(/data)이 없습니다. 재배포 시 이 이미지가 삭제될 수 있습니다."
      : undefined,
  });
}
