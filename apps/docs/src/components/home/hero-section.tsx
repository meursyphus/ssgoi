import Link from "next/link";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";
import IPhone3D from "@/components/home/iphone";
import Demo from "@/components/demo";
import { getServerTranslations } from "@/i18n";

interface HeroSectionProps {
  lang: string;
}

export async function HeroSection({ lang }: HeroSectionProps) {
  const t = await getServerTranslations("home", lang);
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-vivid-orange/20 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-vivid-purple/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* 왼쪽: 텍스트 */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-vivid-green/30 bg-vivid-green/10 px-4 py-2">
              <CheckCircle className="h-4 w-4 text-vivid-green" />
              <span className="text-sm font-medium text-vivid-green">
                {t("badge.text")}
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">{t("heroTitle.line1")}</span>
              <span className="gradient-orange">{t("heroTitle.line2")}</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground sm:text-2xl">
              {t("subtitle")}
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("description")}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href={`${lang}/docs`} className="btn-primary text-lg">
                {t("buttons.getStarted")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={`/${lang}/demo`} className="btn-secondary text-lg">
                <Zap className="h-5 w-5" />
                {t("buttons.demo")}
              </Link>
            </div>

            {/* 빠른 설치 */}
            <div className="mt-12 space-y-3">
              <div className="rounded-lg bg-card/50 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("quickInstall.react")}
                </p>
                <code className="font-mono text-sm text-white">
                  npm install @ssgoi/react
                </code>
              </div>
              <div className="rounded-lg bg-card/50 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("quickInstall.svelte")}
                </p>
                <code className="font-mono text-sm text-white">
                  npm install @ssgoi/svelte
                </code>
              </div>
              <div className="rounded-lg bg-card/50 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("quickInstall.vue")}
                </p>
                <code className="font-mono text-sm text-white">
                  npm install @ssgoi/vue
                </code>
              </div>
              <div className="rounded-lg bg-card/50 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("quickInstall.angular")}
                </p>
                <code className="font-mono text-sm text-white">
                  npm install @ssgoi/angular
                </code>
              </div>
              {/* SolidJS - 추가 예정 */}
              <div className="rounded-lg bg-card/50 p-4 opacity-50">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("quickInstall.solidjs")}
                </p>
                <code className="font-mono text-sm text-white/50">
                  npm install @ssgoi/solid
                </code>
              </div>
              {/* Qwik - 추가 예정 */}
              <div className="rounded-lg bg-card/50 p-4 opacity-50">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("quickInstall.qwik")}
                </p>
                <code className="font-mono text-sm text-white/50">
                  npm install @ssgoi/qwik
                </code>
              </div>
            </div>
          </div>

          {/* 오른쪽: 앱 데모 */}
          <div className="relative">
            <div className="relative mx-auto z-0 w-full max-w-[400px] md:max-w-[700px] aspect-[5/7]">
              {/* 3D iPhone Component */}
              <IPhone3D color="blue">
                <Demo autoPlay />
              </IPhone3D>
            </div>
            {/* 플로팅 배지 - 아이폰 근처에 배치 */}
            <div className="absolute left-0 md:left-8 top-1/3 md:top-1/4 animate-float rounded-lg bg-vivid-orange px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base font-medium text-white shadow-lg">
              {t("floatingBadges.performance")}
            </div>
            <div
              className="absolute right-0 z-1 md:right-8 bottom-1/3 md:bottom-1/4 animate-float rounded-lg bg-vivid-purple px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base font-medium text-white shadow-lg"
              style={{ animationDelay: "1s" }}
            >
              {t("floatingBadges.stateMemory")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
