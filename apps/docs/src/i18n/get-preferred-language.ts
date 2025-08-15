import { NextRequest } from "next/server";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./supported-languages";

const LANGUAGE_COOKIE_NAME = "preferred-language";

export function getPreferredLanguage(request: NextRequest): string {
  // 1. First check for cookie preference
  const cookieValue = request.cookies.get(LANGUAGE_COOKIE_NAME)?.value;
  if (cookieValue && SUPPORTED_LANGUAGES.includes(cookieValue)) {
    return cookieValue;
  }

  // 2. Then check browser's Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const langs = acceptLanguage.split(",").map((lang) => lang.split(";")[0]);
    for (const lang of langs) {
      const shortLang = lang.slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(shortLang)) {
        return shortLang;
      }
    }
  }

  // 3. Finally fallback to default language
  return DEFAULT_LANGUAGE;
}
