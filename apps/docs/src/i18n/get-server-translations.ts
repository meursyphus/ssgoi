import { Messages } from "./messages/types";
import { loadTranslations } from "./internal/load-translations";
import { interpolate } from "./internal/interpolate";
import { getServerCurrentLanguage } from "./get-server-current-language";

type Variables = { [key: string]: string | number };

export async function getServerTranslations(namespace: keyof Messages) {
  let lang = getServerCurrentLanguage();
  const messages = await loadTranslations(lang);

  function t(key: string, variables?: Variables): string {
    const template = (messages[namespace] as any)?.[key] || "";

    if (variables) {
      return interpolate(template, variables);
    } else {
      return template;
    }
  }

  return t;
}
