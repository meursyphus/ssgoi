import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LANGUAGES } from "@/i18n/supported-languages";
import { getPreferredLanguage } from "@/i18n/get-preferred-language";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  console.log("Middleware running for path:", pathname);

  if (
    SUPPORTED_LANGUAGES.some(
      (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
    )
  ) {
    return NextResponse.next();
  }

  const lang = getPreferredLanguage(request);
  const newUrl = new URL(`/${lang}${pathname}`, request.url);

  const redirectResponse = NextResponse.redirect(newUrl);

  return redirectResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
