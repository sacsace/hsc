import { promises as fs } from "fs";
import path from "path";

/**
 * Persistent storage root.
 * - Local: ./data
 * - Railway: mount a Volume at `/data` (recommended). Railway sets
 *   RAILWAY_VOLUME_MOUNT_PATH automatically; DATA_DIR can override.
 *
 * Do NOT mount the volume at `/app/data` — that hides the seeded
 * content.json shipped in the image.
 */
export function getDataDir() {
  return (
    process.env.DATA_DIR ||
    process.env.RAILWAY_VOLUME_MOUNT_PATH ||
    path.join(process.cwd(), "data")
  );
}

/** Bundled defaults that live in the deploy image (not on the volume). */
export function getSeedDir() {
  return path.join(process.cwd(), "data");
}

export function contentFilePath() {
  return path.join(getDataDir(), "content.json");
}

export function inquiriesFilePath() {
  return path.join(getDataDir(), "inquiries.json");
}

export function adminFilePath() {
  return path.join(getDataDir(), "admin.json");
}

export function uploadsDir() {
  return path.join(getDataDir(), "uploads");
}

export async function ensureDataDir() {
  await fs.mkdir(getDataDir(), { recursive: true });
}

export async function ensureUploadsDir() {
  await fs.mkdir(uploadsDir(), { recursive: true });
}

/**
 * If the runtime content file is missing (fresh volume), copy the
 * seeded content.json from the image so the site has baseline copy.
 */
export async function ensureRuntimeContentFile() {
  const runtimePath = contentFilePath();
  try {
    await fs.access(runtimePath);
    return runtimePath;
  } catch {
    // continue
  }

  await ensureDataDir();
  const seedPath = path.join(getSeedDir(), "content.json");
  try {
    await fs.copyFile(seedPath, runtimePath);
  } catch {
    // Seed missing in image — leave caller to fail clearly
  }
  return runtimePath;
}

export async function ensureRuntimeInquiriesFile() {
  const runtimePath = inquiriesFilePath();
  try {
    await fs.access(runtimePath);
    return runtimePath;
  } catch {
    // continue
  }

  await ensureDataDir();
  await fs.writeFile(runtimePath, "[]", "utf-8");
  return runtimePath;
}

/** Resolve a safe absolute path under uploads/; returns null if traversal. */
export function resolveUploadPath(relativeParts: string[]) {
  const base = path.resolve(uploadsDir());
  const target = path.resolve(base, ...relativeParts);
  if (target !== base && !target.startsWith(base + path.sep)) {
    return null;
  }
  return target;
}
