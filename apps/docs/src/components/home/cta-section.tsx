import Link from "next/link";
import { Zap } from "lucide-react";
import { getServerTranslations } from "@/i18n";

interface CtaSectionProps {
  lang: string;
}

export async function CtaSection({ lang }: CtaSectionProps) {
  const t = await getServerTranslations("home", lang);
  return (
    <section className="px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vivid-orange via-vivid-pink to-vivid-purple p-1">
          <div className="rounded-[calc(1.5rem-1px)] bg-background p-12 sm:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {t("cta.title")}
              </h2>
              <p className="mt-6 text-xl text-muted-foreground">
                {t("cta.subtitle")}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href={`${lang}/docs`} className="btn-primary text-lg">
                  <Zap className="h-5 w-5" />
                  {t("cta.buttons.viewDocs")}
                </Link>
                <Link
                  href={`/${lang}/demo`}
                  className="btn-secondary text-lg"
                >
                  <Zap className="h-5 w-5" />
                  {t("cta.buttons.demo")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}