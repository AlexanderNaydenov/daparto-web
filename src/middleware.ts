import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, isAppLocale, locales, type AppLocale } from "@/i18n/config";

const LOCALE_PREFIX = new RegExp(`^/(${locales.join("|")})(/|$)`);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  if (/\.[a-zA-Z0-9]+$/.test(pathname.split("/").pop() ?? "")) {
    return NextResponse.next();
  }

  const match = pathname.match(LOCALE_PREFIX);
  if (!match) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = match[1] as AppLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
