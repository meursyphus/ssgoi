import type { Messages } from "../messages/types";
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  DEFAULT_LANGUAGE,
} from "../supported-languages";

export async function loadTranslations(lang: string): Promise<Messages> {
  let messages: Messages;

  // 언어 코드 검증
  const isSupported = SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
  const languageToLoad = isSupported ? lang : DEFAULT_LANGUAGE; // 지원되지 않는 언어의 경우 기본 언어로 폴백

  try {
    messages = await import(`../messages/${languageToLoad}`).then(
      (module) => module.default,
    );
  } catch (error) {
    console.error(
      `Failed to load messages for language: ${languageToLoad}`,
      error,
    );
    // 메시지 로드 실패 시 기본 언어로 폴백
    if (languageToLoad !== DEFAULT_LANGUAGE) {
      messages = await import(`../messages/${DEFAULT_LANGUAGE}`).then(
        (module) => module.default,
      );
    } else {
      throw new Error("Failed to load default language messages.");
    }
  }

  return messages;
}
