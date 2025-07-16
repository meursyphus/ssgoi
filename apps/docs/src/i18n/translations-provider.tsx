"use server";
import { ClientTranslationsProvider } from "./internal/client-translations-provider";
import { loadTranslations } from "./internal/load-translations";

export default async function TranslationsProvider({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const messages = await loadTranslations(lang);
  return (
    <ClientTranslationsProvider messages={messages} lang={lang}>
      {children}
    </ClientTranslationsProvider>
  );
}
