"use client";

import { useTranslations } from "@/i18n/use-translations";

export function FrameworksSection() {
  const t = useTranslations("home");

  const frameworks = [
    { name: "React", status: "available" },
    { name: "Svelte", status: "available" },
    { name: "Vue", status: "available" },
    { name: "Angular", status: "available" },
    { name: "SolidJS", status: "available" },
    { name: "Qwik", status: "soon" },
  ];

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
            {t("newHome.frameworks.sectionLabel")}
          </p>
          <h2 className="text-xl font-light tracking-tight mb-2">
            {t("newHome.frameworks.title")}
          </h2>
          <p className="text-xs text-neutral-500">
            {t("newHome.frameworks.description")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {frameworks.map((fw) => (
            <div
              key={fw.name}
              className={`px-4 py-2 rounded border text-xs ${
                fw.status === "available"
                  ? "bg-white/[0.02] border-white/10 text-neutral-300"
                  : "border-white/5 text-neutral-600"
              }`}
            >
              {fw.name}
              {fw.status === "soon" && (
                <span className="ml-2 text-[10px] text-neutral-600">
                  {t("newHome.frameworks.soon")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
