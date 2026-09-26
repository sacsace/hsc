import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { adminFilePath, ensureDataDir } from "@/lib/storage";

type AdminStore = {
  passwordHash: string;
  salt: string;
  updatedAt: string;
};

function storePath() {
  return adminFilePath();
}

function getEnvPassword() {
  return process.env.ADMIN_PASSWORD || "admin1234";
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

async function readStore(): Promise<AdminStore | null> {
  try {
    const raw = await fs.readFile(storePath(), "utf-8");
    const data = JSON.parse(raw) as AdminStore;
    if (!data.passwordHash || !data.salt) return null;
    return data;
  } catch {
    return null;
  }
}

async function writeStore(password: string): Promise<void> {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  const payload: AdminStore = {
    passwordHash,
    salt,
    updatedAt: new Date().toISOString(),
  };
  await ensureDataDir();
  await fs.mkdir(path.dirname(storePath()), { recursive: true });
  await fs.writeFile(storePath(), JSON.stringify(payload, null, 2), "utf-8");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;

  const store = await readStore();
  if (store) {
    const hashed = hashPassword(password, store.salt);
    try {
      const a = Buffer.from(hashed, "hex");
      const b = Buffer.from(store.passwordHash, "hex");
      if (a.length !== b.length) return false;
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  const expected = getEnvPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await verifyAdminPassword(currentPassword))) {
    return { ok: false, error: "현재 비밀번호가 올바르지 않습니다." };
  }

  if (newPassword.length < 6) {
    return { ok: false, error: "새 비밀번호는 6자 이상이어야 합니다." };
  }

  if (currentPassword === newPassword) {
    return { ok: false, error: "현재 비밀번호와 다른 비밀번호를 입력해 주세요." };
  }

  await writeStore(newPassword);
  return { ok: true };
}

/** @deprecated use verifyAdminPassword */
export function getAdminPassword() {
  return getEnvPassword();
}
