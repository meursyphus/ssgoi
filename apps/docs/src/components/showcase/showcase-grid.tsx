"use client";

import { useState } from "react";
import { ShowcaseCard } from "./showcase-card";
import { ShowcaseModal } from "./showcase-modal";
import { showcaseData, type ShowcaseItem } from "./showcase-data";
import { GitPullRequest, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/i18n/use-translations";

export function ShowcaseGrid() {
  const t = useTranslations("showcase");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const featuredItems = showcaseData.filter((item) => item.featured);
  const regularItems = showcaseData.filter((item) => !item.featured);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedIndex(null);
  };

  const handleNavigate = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-neutral-500" />
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
            Showcase
          </p>
        </div>
        <h1 className="text-3xl font-light tracking-tight mb-3">
          {t("title")}
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl">{t("subtitle")}</p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-light">{showcaseData.length}</span>
          <span className="text-xs text-neutral-500">{t("projects")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-light">{featuredItems.length}</span>
          <span className="text-xs text-neutral-500">{t("featured")}</span>
        </div>
      </div>

      {showcaseData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
          <p className="mb-2 text-base font-medium text-neutral-300">
            {t("noSitesYet")}
          </p>
          <p className="text-sm text-neutral-500">{t("beTheFirst")}</p>
        </div>
      ) : (
        <>
          {/* Featured Section */}
          {featuredItems.length > 0 && (
            <div className="mb-12">
              <h2 className="text-[10px] text-neutral-500 uppercase tracking-wider mb-4">
                {t("featured")}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredItems.map((item: ShowcaseItem) => {
                  const globalIndex = showcaseData.findIndex(
                    (i) => i.id === item.id,
                  );
                  return (
                    <ShowcaseCard
                      key={item.id}
                      item={item}
                      index={globalIndex}
                      onClick={() => handleCardClick(globalIndex)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* All Projects */}
          {regularItems.length > 0 && (
            <div className="mb-12">
              <h2 className="text-[10px] text-neutral-500 uppercase tracking-wider mb-4">
                {t("allProjects")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {regularItems.map((item: ShowcaseItem) => {
                  const globalIndex = showcaseData.findIndex(
                    (i) => i.id === item.id,
                  );
                  return (
                    <ShowcaseCard
                      key={item.id}
                      item={item}
                      index={globalIndex}
                      onClick={() => handleCardClick(globalIndex)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Submit CTA */}
      <div className="mt-16 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GitPullRequest className="h-5 w-5 text-neutral-400" />
              <h3 className="text-lg font-medium text-white">
                {t("addYourSite")}
              </h3>
            </div>
            <p className="text-sm text-neutral-500 max-w-md">
              {t("addYourSiteDescription")}
            </p>
          </div>
          <Link
            href="https://github.com/meursyphus/ssgoi/blob/main/apps/docs/src/components/showcase/showcase-data.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium bg-white text-black hover:bg-neutral-200 transition-colors shrink-0"
          >
            {t("submitViaPR")}
          </Link>
        </div>
      </div>

      {/* Modal */}
      {selectedIndex !== null && showcaseData[selectedIndex] && (
        <ShowcaseModal
          item={showcaseData[selectedIndex]}
          items={showcaseData}
          currentIndex={selectedIndex}
          onClose={handleCloseModal}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
