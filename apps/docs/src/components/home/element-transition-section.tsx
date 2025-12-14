"use client";

import { useState } from "react";
import { transition } from "@ssgoi/react";
import {
  fade,
  scale,
  slide,
  rotate,
  blur,
  bounce,
} from "@ssgoi/react/transitions";
import { CodeBlock } from "@/components/ui/code-block";
import { useTranslations } from "@/i18n/use-translations";

type TransitionType = "fade" | "scale" | "slide" | "rotate" | "blur" | "bounce";

const codeExamples: Record<TransitionType, string> = {
  fade: `<div ref={transition({
  in: () => ({
    css: (p) => ({
      opacity: p
    })
  }),
  out: () => ({
    css: (p) => ({
      opacity: p
    })
  }),
})}>
  Content
</div>`,
  scale: `<div ref={transition({
  in: () => ({
    css: (p) => ({
      opacity: p,
      transform: \`scale(\${p})\`
    })
  }),
  out: () => ({
    css: (p) => ({
      opacity: p,
      transform: \`scale(\${p})\`
    })
  }),
})}>
  Content
</div>`,
  slide: `<div ref={transition({
  in: () => ({
    css: (p) => ({
      opacity: p,
      transform: \`translateY(\${(1 - p) * 20}px)\`
    })
  }),
  out: () => ({
    css: (p) => ({
      opacity: p,
      transform: \`translateY(\${(1 - p) * 20}px)\`
    })
  }),
})}>
  Content
</div>`,
  rotate: `<div ref={transition({
  in: () => ({
    css: (p) => ({
      opacity: p,
      transform: \`rotate(\${(1 - p) * 90}deg)\`
    })
  }),
  out: () => ({
    css: (p) => ({
      opacity: p,
      transform: \`rotate(\${(1 - p) * 90}deg)\`
    })
  }),
})}>
  Content
</div>`,
  blur: `<div ref={transition({
  in: () => ({
    css: (p) => ({
      opacity: p,
      filter: \`blur(\${(1 - p) * 10}px)\`
    })
  }),
  out: () => ({
    css: (p) => ({
      opacity: p,
      filter: \`blur(\${(1 - p) * 10}px)\`
    })
  }),
})}>
  Content
</div>`,
  bounce: `<div ref={transition({
  in: () => ({
    css: (p) => ({
      opacity: p,
      transform: \`translateY(\${Math.sin((1-p) * Math.PI) * -20}px)\`
    })
  }),
  out: () => ({
    css: (p) => ({
      opacity: p,
      transform: \`translateY(\${Math.sin((1-p) * Math.PI) * -20}px)\`
    })
  }),
})}>
  Content
</div>`,
};

export function ElementTransitionSection() {
  const [show, setShow] = useState(true);
  const [activeCode, setActiveCode] = useState<TransitionType>("scale");
  const t = useTranslations("home");

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
          <div className="w-10 h-10 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-fade", ...fade() })}
                className="w-10 h-10 bg-white rounded-lg"
              />
            )}
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-scale", ...scale() })}
                className="w-10 h-10 bg-emerald-500 rounded-lg"
              />
            )}
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            {show && (
              <div
                ref={transition({
                  key: "demo-slide",
                  ...slide({ direction: "up" }),
                })}
                className="w-10 h-10 bg-blue-500 rounded-lg"
              />
            )}
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-rotate", ...rotate() })}
                className="w-10 h-10 bg-amber-500 rounded-lg"
              />
            )}
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-blur", ...blur() })}
                className="w-10 h-10 bg-purple-500 rounded-lg"
              />
            )}
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            {show && (
              <div
                ref={transition({ key: "demo-bounce", ...bounce() })}
                className="w-10 h-10 bg-pink-500 rounded-lg"
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

        {/* Code selector */}
        <div className="flex justify-center gap-2 mb-4">
          {(
            ["fade", "scale", "slide", "rotate", "blur", "bounce"] as const
          ).map((type) => (
            <button
              key={type}
              onClick={() => setActiveCode(type)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                activeCode === type
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-neutral-500 border border-transparent hover:text-neutral-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Code */}
        <CodeBlock language="tsx" code={codeExamples[activeCode]} />
      </div>
    </section>
  );
}
