import { NextResponse } from "next/server";
import { isLocale } from "@/lib/locale-detect";
import { localeCookieOptions } from "@/lib/locale-cookie";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const locale = typeof body.locale === "string" ? body.locale : "";

  if (!isLocale(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(localeCookieOptions(locale));
  return response;
}
