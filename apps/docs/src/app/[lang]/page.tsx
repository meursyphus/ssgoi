import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, CheckCircle, Code2, Globe } from "lucide-react";
import Demo from "@/components/demo";
import { CodeExample } from "@/components/code-example";
import { getServerTranslations } from "@/i18n";

export default async function Home({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const t = await getServerTranslations("home", lang);

  return (
    <div className="relative">
      {/* Hero Section - 좌우 분할 */}
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
                <a
                  href="https://github.com/meursyphus/ssgoi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-lg"
                >
                  <Code2 className="h-5 w-5" />
                  {t("buttons.github")}
                </a>
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
                {/* Vue - 추가 예정 */}
                <div className="rounded-lg bg-card/50 p-4 opacity-50">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {t("quickInstall.vue")}
                  </p>
                  <code className="font-mono text-sm text-white/50">
                    npm install @ssgoi/vue
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
              <div className="relative mx-auto max-w-sm">
                {/* 모바일 프레임 */}
                <div className="relative overflow-hidden rounded-[3rem] border-8 border-white/10 bg-black shadow-2xl">
                  <div className="absolute left-1/2 top-4 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

                  {/* Demo Component */}
                  <div className="aspect-[9/19.5]">
                    <Demo />
                  </div>
                </div>

                {/* 플로팅 배지 */}
                <div className="absolute -left-4 top-1/4 animate-float rounded-lg bg-vivid-orange px-3 py-2 text-sm font-medium text-white shadow-lg">
                  {t("floatingBadges.performance")}
                </div>
                <div
                  className="absolute -right-4 bottom-1/4 animate-float rounded-lg bg-vivid-purple px-3 py-2 text-sm font-medium text-white shadow-lg"
                  style={{ animationDelay: "1s" }}
                >
                  {t("floatingBadges.stateMemory")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 프레임워크 지원 섹션 */}
      <section className="border-y border-border bg-card/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("frameworks.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("frameworks.subtitle")}
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {/* JavaScript */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 p-4 transition-all group-hover:bg-white/20 group-hover:scale-110">
                <Image
                  src="/icons/javascript.svg"
                  alt="JavaScript"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                JavaScript
              </span>
            </div>

            {/* React */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 p-4 transition-all group-hover:bg-white/20 group-hover:scale-110">
                <Image
                  src="/icons/react.svg"
                  alt="React"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {t("quickInstall.react")}
              </span>
            </div>

            {/* Svelte */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 p-4 transition-all group-hover:bg-white/20 group-hover:scale-110">
                <Image
                  src="/icons/svelte.svg"
                  alt="Svelte"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {t("quickInstall.svelte")}
              </span>
            </div>

            {/* Vue - 지원 예정 */}
            <div className="group flex flex-col items-center gap-3 opacity-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 p-4">
                <Image
                  src="/icons/vue.svg"
                  alt="Vue"
                  width={48}
                  height={48}
                  className="h-12 w-12 opacity-50"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Vue
                <span className="block text-xs">{t("frameworks.comingSoon")}</span>
              </span>
            </div>

            {/* SolidJS - 지원 예정 */}
            <div className="group flex flex-col items-center gap-3 opacity-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 p-4">
                <Image
                  src="/icons/solidjs.svg"
                  alt="SolidJS"
                  width={48}
                  height={48}
                  className="h-12 w-12 opacity-50"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                SolidJS
                <span className="block text-xs">{t("frameworks.comingSoon")}</span>
              </span>
            </div>

            {/* Qwik - 지원 예정 */}
            <div className="group flex flex-col items-center gap-3 opacity-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 p-4">
                <Image
                  src="/icons/qwik.svg"
                  alt="Qwik"
                  width={48}
                  height={48}
                  className="h-12 w-12 opacity-50"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Qwik
                <span className="block text-xs">{t("frameworks.comingSoon")}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

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
              <h3 className="mb-4 text-2xl font-bold">{t("whySSGOI.features.ssr.title")}</h3>
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
              <h3 className="mb-4 text-2xl font-bold">{t("whySSGOI.features.browserCompat.title")}</h3>
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
              <h3 className="mb-4 text-2xl font-bold">{t("whySSGOI.features.zeroConfig.title")}</h3>
              <p className="text-lg text-muted-foreground">
                {t("whySSGOI.features.zeroConfig.description")}
              </p>
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-vivid-purple/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* 간단한 코드 예제 */}
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

      {/* CTA Section */}
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
                  <a
                    href="https://github.com/meursyphus/ssgoi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-lg"
                  >
                    <Code2 className="h-5 w-5" />
                    {t("cta.buttons.github")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
