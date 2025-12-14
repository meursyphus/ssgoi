import { CheckCircle, Globe, Zap } from "lucide-react";
import { getServerTranslations } from "@/i18n";

interface WhySsgoiSectionProps {
  lang: string;
}

export async function WhySsgoiSection({ lang }: WhySsgoiSectionProps) {
  const t = await getServerTranslations("home", lang);
  return (
    <section className="px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("whySSGOI.title")}
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            {t("whySSGOI.subtitle")}
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {/* SSR/SSG 완벽 지원 */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-vivid-green">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-green to-vivid-cyan">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-4 text-2xl font-bold">
              {t("whySSGOI.features.ssr.title")}
            </h3>
            <p className="text-lg text-muted-foreground">
              {t("whySSGOI.features.ssr.description")}
            </p>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-vivid-green/10 blur-2xl" />
          </div>

          {/* 모든 브라우저 호환 */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-vivid-cyan">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-cyan to-vivid-blue">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-4 text-2xl font-bold">
              {t("whySSGOI.features.browserCompat.title")}
            </h3>
            <p className="text-lg text-muted-foreground">
              {t("whySSGOI.features.browserCompat.description")}
            </p>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-vivid-cyan/10 blur-2xl" />
          </div>

          {/* 제로 설정 */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-vivid-purple">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-purple to-vivid-pink">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-4 text-2xl font-bold">
              {t("whySSGOI.features.zeroConfig.title")}
            </h3>
            <p className="text-lg text-muted-foreground">
              {t("whySSGOI.features.zeroConfig.description")}
            </p>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-vivid-purple/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
