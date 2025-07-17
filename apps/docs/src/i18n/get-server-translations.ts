import { Messages } from "./messages/types";
import { loadTranslations } from "./internal/load-translations";
import { interpolate } from "./internal/interpolate";

type Variables = { [key: string]: string | number };

export async function getServerTranslations(
  namespace: keyof Messages,
  lang: string
) {
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
