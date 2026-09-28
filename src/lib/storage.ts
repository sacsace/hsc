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

/** Image files committed in the deploy image for CMS seed / redeploy fallback. */
export function seedUploadsDir() {
  return path.join(getSeedDir(), "seed-uploads");
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

/** True when storage is on an explicit persistent mount (Railway Volume / DATA_DIR). */
export function isPersistentStorage() {
  return Boolean(process.env.DATA_DIR || process.env.RAILWAY_VOLUME_MOUNT_PATH);
}

export function storageStatus() {
  const dataDir = getDataDir();
  const persistent = isPersistentStorage();
  const onRailway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
  return {
    dataDir,
    uploadsDir: uploadsDir(),
    persistent,
    onRailway,
    /** Production risk: Railway without a volume loses uploads on every deploy */
    uploadsAtRisk: onRailway && !persistent,
  };
}

export async function ensureDataDir() {
  await fs.mkdir(getDataDir(), { recursive: true });
}

export async function ensureUploadsDir() {
  await fs.mkdir(uploadsDir(), { recursive: true });
}

/**
 * Copy bundled seed-uploads into the runtime uploads folder when missing.
 * Keeps CMS image URLs (`/uploads/...`) working after redeploy even if the
 * volume was empty or files were lost — seed files ship in the Docker image.
 */
export async function ensureSeedUploads() {
  const seedDir = seedUploadsDir();
  let names: string[];
  try {
    names = await fs.readdir(seedDir);
  } catch {
    return { copied: 0, skipped: 0 };
  }

  await ensureUploadsDir();
  const destDir = uploadsDir();
  let copied = 0;
  let skipped = 0;

  for (const name of names) {
    if (name.startsWith(".")) continue;
    const src = path.join(seedDir, name);
    const dest = path.join(destDir, name);
    try {
      const st = await fs.stat(src);
      if (!st.isFile()) continue;
      try {
        await fs.access(dest);
        skipped += 1;
        continue;
      } catch {
        // missing — copy
      }
      await fs.copyFile(src, dest);
      copied += 1;
    } catch {
      // ignore individual file errors
    }
  }

  return { copied, skipped };
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

/** Resolve a safe absolute path under a root directory; returns null if traversal. */
function resolveUnderRoot(root: string, relativeParts: string[]) {
  const base = path.resolve(root);
  const target = path.resolve(base, ...relativeParts);
  if (target !== base && !target.startsWith(base + path.sep)) {
    return null;
  }
  return target;
}

/** Resolve a safe absolute path under runtime uploads/; returns null if traversal. */
export function resolveUploadPath(relativeParts: string[]) {
  return resolveUnderRoot(uploadsDir(), relativeParts);
}

/** Runtime uploads first, then image-bundled seed-uploads (deploy-safe fallback). */
export function resolveUploadPathWithFallback(relativeParts: string[]) {
  const runtime = resolveUploadPath(relativeParts);
  const seed = resolveUnderRoot(seedUploadsDir(), relativeParts);
  return { runtime, seed };
}
