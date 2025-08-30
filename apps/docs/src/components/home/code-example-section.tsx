import { CodeExample } from "@/components/code-example";
import { getServerTranslations } from "@/i18n";

interface CodeExampleSectionProps {
  lang: string;
}

export async function CodeExampleSection({ lang }: CodeExampleSectionProps) {
  const t = await getServerTranslations("home", lang);
  return (
    <section className="border-t border-border bg-card/30 px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("codeExample.title")}
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            {t("codeExample.subtitle")}
          </p>
        </div>

        <CodeExample />
      </div>
    </section>
  );
}