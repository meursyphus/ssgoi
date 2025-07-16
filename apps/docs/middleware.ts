import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LANGUAGES } from "@/i18n/supported-languages";
import { getPreferredLanguage } from "@/i18n/get-preferred-language";

export function middleware(
  request: NextRequest,
  _response?: NextResponse,
): NextResponse {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (
    SUPPORTED_LANGUAGES.some(
      (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`,
    )
  ) {
    return response;
  }

  const lang = getPreferredLanguage(request);
  const newUrl = new URL(`/${lang}${pathname}`, request.url);

  const redirectResponse = NextResponse.redirect(newUrl);

  return redirectResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|bmp|tiff|css|js|map|json|txt|xml|woff|woff2|eot|ttf|otf|txt)$).*)",
  ],
};