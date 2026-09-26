import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localeFromAcceptLanguage, LOCALE_COOKIE, isLocale } from "@/lib/locale-detect";
import { localeCookieOptions } from "@/lib/locale-cookie";

function applySecurityHeaders(response: NextResponse) {
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  return response;
}

export function middleware(request: NextRequest) {
  // Production HTTP → HTTPS
  if (process.env.NODE_ENV === "production") {
    const proto = request.headers.get("x-forwarded-proto");
    if (proto === "http") {
      const url = request.nextUrl.clone();
      url.protocol = "https:";
      return applySecurityHeaders(NextResponse.redirect(url, 308));
    }
  }

  const response = applySecurityHeaders(NextResponse.next());

  // 브라우저/OS 언어(Accept-Language)로 최초 로케일 쿠키 설정
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (!isLocale(existing)) {
    const locale = localeFromAcceptLanguage(request.headers.get("accept-language"));
    response.cookies.set(localeCookieOptions(locale));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4)$).*)"],
};
