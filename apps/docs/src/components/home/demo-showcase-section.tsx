"use client";

import { lazy, Suspense, useState } from "react";
import { useTranslations } from "@/i18n/use-translations";

// Lazy load demos for performance
const FadeDemo = lazy(() =>
  import("@/components/mdx/mdx-components/view-transition-demo/fade-demo").then(
    (m) => ({ default: m.FadeDemo }),
  ),
);
const RotateDemo = lazy(() =>
  import(
    "@/components/mdx/mdx-components/view-transition-demo/rotate-demo"
  ).then((m) => ({ default: m.RotateDemo })),
);
const StripDemo = lazy(() =>
  import(
    "@/components/mdx/mdx-components/view-transition-demo/strip-demo"
  ).then((m) => ({ default: m.StripDemo })),
);
const BlindDemo = lazy(() =>
  import(
    "@/components/mdx/mdx-components/view-transition-demo/blind-demo"
  ).then((m) => ({ default: m.BlindDemo })),
);

type DemoType = "fade" | "rotate" | "strip" | "blind";

const demoKeys: DemoType[] = ["fade", "rotate", "strip", "blind"];

function DemoLoading() {
  return (
    <div className="flex items-center justify-center h-full bg-neutral-900 rounded-lg">
      <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}

export function DemoShowcaseSection() {
  const [activeDemo, setActiveDemo] = useState<DemoType>("fade");
  const t = useTranslations("home");

  const renderDemo = () => {
    switch (activeDemo) {
      case "fade":
        return <FadeDemo />;
      case "rotate":
        return <RotateDemo />;
      case "strip":
        return <StripDemo />;
      case "blind":
        return <BlindDemo />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
            {t("newHome.demoShowcase.sectionLabel")}
          </p>
          <h2 className="text-xl font-light tracking-tight mb-2">
            {t("newHome.demoShowcase.title")}
          </h2>
          <p className="text-xs text-neutral-500">
            {t("newHome.demoShowcase.description")}
          </p>
        </div>

        {/* Demo Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {demoKeys.map((demoType) => (
            <button
              key={demoType}
              onClick={() => setActiveDemo(demoType)}
              className={`flex-shrink-0 px-4 py-2 text-xs rounded-lg transition-all ${
                activeDemo === demoType
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-neutral-500 border border-transparent hover:text-neutral-300 hover:bg-white/5"
              }`}
            >
              {t(`newHome.demoShowcase.demos.${demoType}.label`)}
            </button>
          ))}
        </div>

        {/* Demo Container */}
        <div className="relative">
          {/* Main demo - responsive aspect ratio: mobile (9:16) / desktop (16:10) */}
          <div className="aspect-[9/16] md:aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
            <Suspense fallback={<DemoLoading />}>{renderDemo()}</Suspense>
          </div>

          {/* Description */}
          <p className="mt-4 text-xs text-neutral-500 text-center">
            {t(`newHome.demoShowcase.demos.${activeDemo}.description`)}
          </p>
        </div>
      </div>
    </section>
  );
}
