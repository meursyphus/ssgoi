import { getServerTranslations } from "./get-server-translations";
import { useTranslations } from "./use-translations";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./supported-languages";
import { useCurrentLanguage } from "./use-current-language";
import { ClientTranslationsProvider } from "./internal/client-translations-provider";
import TranslationsProvider from "./translations-provider";
import { getPreferredLanguage } from "./get-preferred-language";
import { getServerCurrentLanguage } from "./get-server-current-language";
import { generateStaticParams } from "./generate-static-params";

export {
  useTranslations,
  getServerTranslations,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  useCurrentLanguage,
  ClientTranslationsProvider,
  TranslationsProvider,
  getPreferredLanguage,
  getServerCurrentLanguage,
  generateStaticParams,
};
