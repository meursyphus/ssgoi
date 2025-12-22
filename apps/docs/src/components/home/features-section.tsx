"use client";

import { Zap, Globe, Layers, Smartphone } from "lucide-react";
import { useTranslations } from "@/i18n/use-translations";

export function FeaturesSection() {
  const t = useTranslations("home");

  const features = [
    {
      icon: Zap,
      titleKey: "newHome.features.zeroConfig.title" as const,
      descriptionKey: "newHome.features.zeroConfig.description" as const,
    },
    {
      icon: Globe,
      titleKey: "newHome.features.allBrowsers.title" as const,
      descriptionKey: "newHome.features.allBrowsers.description" as const,
    },
    {
      icon: Layers,
      titleKey: "newHome.features.ssrSupport.title" as const,
      descriptionKey: "newHome.features.ssrSupport.description" as const,
    },
    {
      icon: Smartphone,
      titleKey: "newHome.features.smoothPerformance.title" as const,
      descriptionKey: "newHome.features.smoothPerformance.description" as const,
    },
  ];

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-3">
            {t("newHome.features.sectionLabel")}
          </p>
          <h2 className="text-xl font-light tracking-tight">
            {t("newHome.features.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {features.map((feature, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
