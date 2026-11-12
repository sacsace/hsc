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
const DOC_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
const ALLOWED = new Set([...IMAGE_TYPES, ...VIDEO_TYPES, ...DOC_TYPES]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const MAX_DOC_BYTES = 40 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

function extFromName(name: string) {
  const ext = path.extname(name).toLowerCase().replace(/^\./, "");
  return ext || "";
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  // Some browsers send empty type for doc/docx — fall back to extension.
  let mime = file.type;
  const nameExt = extFromName(file.name);
  if (!mime || mime === "application/octet-stream") {
    if (nameExt === "pdf") mime = "application/pdf";
    else if (nameExt === "doc") mime = "application/msword";
    else if (nameExt === "docx") {
      mime =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (nameExt === "xls") mime = "application/vnd.ms-excel";
    else if (nameExt === "xlsx") {
      mime =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (nameExt === "jpg" || nameExt === "jpeg") mime = "image/jpeg";
    else if (nameExt === "png") mime = "image/png";
    else if (nameExt === "webp") mime = "image/webp";
    else if (nameExt === "gif") mime = "image/gif";
  }

  if (!ALLOWED.has(mime)) {
    return NextResponse.json(
      {
        error:
          "Unsupported file type (PDF, Word, Excel, JPG/PNG/WEBP/GIF, MP4/WEBM)",
      },
      { status: 400 },
    );
  }

  const isVideo = VIDEO_TYPES.has(mime);
  const isDoc = DOC_TYPES.has(mime);
  const maxBytes = isVideo
    ? MAX_VIDEO_BYTES
    : isDoc
      ? MAX_DOC_BYTES
      : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isVideo
          ? "File too large (max 50MB for video)"
          : isDoc
            ? "File too large (max 40MB for documents)"
            : "File too large (max 8MB for image)",
      },
      { status: 400 },
    );
  }

  const ext = EXT_BY_TYPE[mime] || nameExt || "bin";
  const storedName = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  await ensureUploadsDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir(), storedName), buffer);

  const status = storageStatus();
  return NextResponse.json({
    url: `/uploads/${storedName}`,
    fileName: file.name,
    persistent: status.persistent,
    warning: status.uploadsAtRisk
      ? "Railway Volume(/data)이 없습니다. 재배포 시 이 파일이 삭제될 수 있습니다."
      : undefined,
  });
}
