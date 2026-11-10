import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { ensureUploadsDir, storageStatus, uploadsDir } from "@/lib/storage";

export const runtime = "nodejs";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const ALLOWED = new Set([...IMAGE_TYPES, ...VIDEO_TYPES]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

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
    return NextResponse.json(
      { error: "Unsupported file type (image: JPG/PNG/WEBP/GIF, video: MP4/WEBM)" },
      { status: 400 },
    );
  }

  const isVideo = VIDEO_TYPES.has(file.type);
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isVideo
          ? "File too large (max 50MB for video)"
          : "File too large (max 8MB for image)",
      },
      { status: 400 },
    );
  }

  const ext = EXT_BY_TYPE[file.type] || "bin";
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  await ensureUploadsDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir(), name), buffer);

  const status = storageStatus();
  return NextResponse.json({
    url: `/uploads/${name}`,
    persistent: status.persistent,
    warning: status.uploadsAtRisk
      ? "Railway Volume(/data)이 없습니다. 재배포 시 이 파일이 삭제될 수 있습니다."
      : undefined,
  });
}
