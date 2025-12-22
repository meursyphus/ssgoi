"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Check, ChevronRight } from "lucide-react";
import Demo from "@/components/demo";
import { useTranslations } from "@/i18n/use-translations";

interface HeroSectionProps {
  lang: string;
}

const frameworks = [
  { name: "React", package: "@ssgoi/react" },
  { name: "Svelte", package: "@ssgoi/svelte" },
  { name: "Vue", package: "@ssgoi/vue" },
  { name: "Solid", package: "@ssgoi/solid" },
  { name: "Angular", package: "@ssgoi/angular" },
];

export function HeroSection({ lang }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);
  const [activeFramework, setActiveFramework] = useState(0);
  const t = useTranslations("home");

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `npm install ${frameworks[activeFramework].package}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-neutral-300 uppercase tracking-wider">
                {t("newHome.hero.badge")}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight leading-tight mb-6">
              {t("newHome.hero.title.line1")}
              <br />
              <span className="text-neutral-400">
                {t("newHome.hero.title.line2")}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm text-neutral-300 leading-relaxed mb-8 max-w-md">
              {t("newHome.hero.description")}
            </p>

            {/* Framework tabs */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {frameworks.map((fw, i) => (
                <button
                  key={fw.name}
                  onClick={() => setActiveFramework(i)}
                  className={`px-2.5 py-1 text-[10px] rounded transition-all ${
                    activeFramework === i
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {fw.name}
                </button>
              ))}
            </div>

            {/* Install command */}
            <div className="flex items-center gap-3 mb-10">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg">
                <code className="text-xs text-neutral-300 font-mono">
                  npm install {frameworks[activeFramework].package}
                </code>
                <button
                  onClick={handleCopy}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <Link
                href={`/${lang}/docs`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
              >
                {t("newHome.hero.getStarted")}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/${lang}/demo`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs text-neutral-300 hover:text-white transition-colors"
              >
                {t("newHome.hero.viewDemo")}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Phone mockup with Demo */}
          <div className="flex items-center justify-center">
            <div className="relative w-[300px]">
              {/* Phone frame */}
              <div className="relative bg-neutral-900 rounded-[2.5rem] p-2 shadow-2xl border border-white/10">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />

                {/* Screen */}
                <div className="relative w-full aspect-[9/19.5] bg-[#121212] rounded-[2rem] overflow-hidden">
                  <Demo autoPlay />
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-12 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 blur-3xl -z-10 opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
