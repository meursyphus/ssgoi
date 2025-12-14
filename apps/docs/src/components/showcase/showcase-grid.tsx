"use client";

import { ShowcaseCard } from "./showcase-card";
import { showcaseData, type ShowcaseItem } from "./showcase-data";
import { GitPullRequest } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/i18n/use-translations";

export function ShowcaseGrid() {
  const t = useTranslations("showcase");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12">
        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
          Showcase
        </p>
        <h1 className="text-xl font-light tracking-tight mb-2">{t("title")}</h1>
        <p className="text-xs text-neutral-500 mb-8">{t("subtitle")}</p>

        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-2">
            <GitPullRequest className="h-4 w-4 text-neutral-400" />
            <h3 className="text-sm font-medium text-white">
              {t("addYourSite")}
            </h3>
          </div>
          <p className="mb-4 text-xs text-neutral-500">
            {t("addYourSiteDescription")}
          </p>
          <Link
            href="https://github.com/meursyphus/ssgoi/blob/main/apps/docs/src/components/showcase/showcase-data.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded px-4 py-2 text-xs font-medium bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            {t("submitViaPR")}
          </Link>
        </div>
      </div>

      {showcaseData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="mb-2 text-sm font-medium text-neutral-300">
            {t("noSitesYet")}
          </p>
          <p className="text-xs text-neutral-500">{t("beTheFirst")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseData.map((item: ShowcaseItem) => (
            <ShowcaseCard
              key={item.id}
              title={item.title}
              description={item.description}
              url={item.url}
              thumbnail={item.thumbnail}
              tags={item.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
