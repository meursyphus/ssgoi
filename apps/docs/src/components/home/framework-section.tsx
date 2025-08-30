import Image from "next/image";
import { getServerTranslations } from "@/i18n";

interface FrameworkSectionProps {
  lang: string;
}

export async function FrameworkSection({ lang }: FrameworkSectionProps) {
  const t = await getServerTranslations("home", lang);
  return (
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

          {/* Vue */}
          <div className="group flex flex-col items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 p-4 transition-all group-hover:bg-white/20 group-hover:scale-110">
              <Image
                src="/icons/vue.svg"
                alt="Vue"
                width={48}
                height={48}
                className="h-12 w-12"
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {t("quickInstall.vue")}
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
              <span className="block text-xs">
                {t("frameworks.comingSoon")}
              </span>
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
              <span className="block text-xs">
                {t("frameworks.comingSoon")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}