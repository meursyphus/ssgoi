export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_LIST = [
  {
    title: "English",
    locale: "en",
  },
  {
    title: "한국어",
    locale: "ko",
  },
  {
    title: "简体中文",
    locale: "cn",
  },
  {
    title: "日本語",
    locale: "ja",
  },
];

export const SUPPORTED_LANGUAGES = LANGUAGE_LIST.map(
  (language) => language.locale,
);
