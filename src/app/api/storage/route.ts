import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { ensureSeedUploads, storageStatus } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const seed = await ensureSeedUploads();
  return NextResponse.json({
    ...storageStatus(),
    seedUploads: seed,
  });
}
