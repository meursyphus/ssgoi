"use client";

import { useState, useMemo } from "react";
import { transition } from "@ssgoi/react";
import {
  fade,
  scale,
  slide,
  rotate,
  blur,
  bounce,
} from "@ssgoi/react/transitions";
import { useTranslations } from "@/i18n/use-translations";
import { SpringGraphPanel, DEFAULT_SPRING } from "./spring-graph";
import type { GraphConfig } from "./spring-graph";
import type { SpringConfig } from "@ssgoi/core/types";

export function ElementTransitionSection() {
  const [show, setShow] = useState(true);
  const [graphConfig, setGraphConfig] = useState<GraphConfig>({
    leader: { ...DEFAULT_SPRING },
    follower: null,
  });
  const t = useTranslations("home");

  // Convert graph config to spring config for transitions
  const spring: SpringConfig = useMemo(() => {
    if (graphConfig.follower) {
      return {
        stiffness: graphConfig.leader.stiffness,
        damping: graphConfig.leader.damping,
        doubleSpring: {
          stiffness: graphConfig.follower.stiffness,
          damping: graphConfig.follower.damping,
        },
      };
    }
    return {
      stiffness: graphConfig.leader.stiffness,
      damping: graphConfig.leader.damping,
    };
  }, [graphConfig]);

  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
            {t("newHome.elementTransition.sectionLabel")}
          </p>
          <h2 className="text-xl font-light tracking-tight mb-2">
            {t("newHome.elementTransition.title")}
          </h2>
          <p className="text-xs text-neutral-500">
            {t("newHome.elementTransition.description")}
          </p>
        </div>

        {/* Demo area - multiple elements with reserved positions */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-fade", ...fade({ spring }) })}
                className="w-12 h-12 bg-white rounded-lg"
              />
            )}
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-scale", ...scale({ spring }) })}
                className="w-12 h-12 bg-emerald-500 rounded-lg"
              />
            )}
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            {show && (
              <div
                ref={transition({
                  key: "demo-slide",
                  ...slide({ direction: "up", spring }),
                })}
                className="w-12 h-12 bg-blue-500 rounded-lg"
              />
            )}
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-rotate", ...rotate({ spring }) })}
                className="w-12 h-12 bg-amber-500 rounded-lg"
              />
            )}
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-blur", ...blur({ spring }) })}
                className="w-12 h-12 bg-purple-500 rounded-lg"
              />
            )}
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-bounce", ...bounce({ spring }) })}
                className="w-12 h-12 bg-pink-500 rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShow(!show)}
            className="px-4 py-1.5 text-xs text-neutral-400 border border-white/10 rounded-md hover:border-white/20 hover:text-white transition-all"
          >
            {show
              ? t("newHome.elementTransition.toggleHide")
              : t("newHome.elementTransition.toggleShow")}
          </button>
        </div>

        {/* Spring Graph Panel */}
        <SpringGraphPanel config={graphConfig} onChange={setGraphConfig} />
      </div>
    </section>
  );
}
