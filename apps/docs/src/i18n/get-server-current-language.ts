// i18n/get-current-language.ts

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./supported-languages";

import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage.external";

export function getServerCurrentLanguage(): string {
  let lang = DEFAULT_LANGUAGE; // 기본 언어 설정

  if (typeof window === "undefined") {
    const store = staticGenerationAsyncStorage.getStore();
    const pathname = store?.urlPathname;

    if (pathname) {
      // 경로명에서 언어 코드 추출 (예: /ko/...)
      const segments = pathname.split("/");
      if (segments.length > 1 && segments[1]) {
        const potentialLang = segments[1];
        if (SUPPORTED_LANGUAGES.includes(potentialLang as any)) {
          lang = potentialLang;
        }
      }
    }
  }

  return lang;
}
