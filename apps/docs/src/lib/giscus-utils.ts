import { SupportedLanguage } from '@/i18n/supported-languages'

// Map our supported languages to Giscus language codes
// Giscus supported languages: https://github.com/giscus/giscus/blob/main/lib/i18n.tsx
const GISCUS_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  en: 'en',
  ko: 'ko',
  ja: 'ja',
  zh: 'zh-CN', // Giscus uses zh-CN for Chinese
}

export function getGiscusLanguage(lang: SupportedLanguage): string {
  return GISCUS_LANGUAGE_MAP[lang] || 'en'
}