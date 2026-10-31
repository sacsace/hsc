import { NextResponse } from "next/server";
import { isLocale } from "@/lib/locale-detect";
import { localeCookieOptions, localeManualCookieOptions } from "@/lib/locale-cookie";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const locale = typeof body.locale === "string" ? body.locale : "";
  const manual = body.manual === true;

  if (!isLocale(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, locale, manual });
  response.cookies.set(localeCookieOptions(locale));
  response.cookies.set(localeManualCookieOptions(manual));
  return response;
}
