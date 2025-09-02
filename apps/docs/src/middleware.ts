import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LANGUAGES } from "@/i18n/supported-languages";
import { getPreferredLanguage } from "@/i18n/get-preferred-language";

// Check if the request is for a static file
function isStaticFile(pathname: string): boolean {
  const staticFileExtensions =
    /\.(svg|png|jpg|jpeg|gif|ico|webp|txt|xml|pdf|json|csv)$/i;
  return staticFileExtensions.test(pathname);
}

// Check if the pathname already has a valid language prefix
function hasLanguagePrefix(pathname: string): boolean {
  return SUPPORTED_LANGUAGES.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`,
  );
}

// Handle docs-specific redirects
function handleDocsRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Check if this is a docs index page that needs redirect
  const docsIndexPattern = /^\/([^\/]+)\/docs\/?$/;
  const match = pathname.match(docsIndexPattern);

  if (match) {
    const lang = match[1];
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      const newUrl = new URL(
        `/${lang}/docs/getting-started/introduction`,
        request.url,
      );
      return NextResponse.redirect(newUrl);
    }
  }

  return null;
}

// Add language prefix to paths without one
function addLanguagePrefix(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const lang = getPreferredLanguage(request);
  const newUrl = new URL(`/${lang}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Sequential filtering approach

  // 1. Skip static files
  if (isStaticFile(pathname)) {
    return NextResponse.next();
  }

  // 2. If path already has language prefix, check for docs redirects
  if (hasLanguagePrefix(pathname)) {
    const docsRedirect = handleDocsRedirect(request);
    if (docsRedirect) {
      return docsRedirect;
    }
    return NextResponse.next();
  }

  // 3. Add language prefix for paths without one
  return addLanguagePrefix(request);
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
