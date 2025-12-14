"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Check, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  lang: string;
}

export function HeroSection({ lang }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install @ssgoi/react");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
              View Transitions API 불필요
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight leading-tight mb-6">
            웹에서 느끼는
            <br />
            <span className="text-neutral-500">네이티브 수준의 전환</span>
          </h1>

          {/* Description */}
          <p className="text-sm text-neutral-400 leading-relaxed mb-10 max-w-md">
            페이지 간 전환을 매끄럽게. 모든 브라우저에서 동작하고, 모든
            프레임워크를 지원합니다. 복잡한 설정 없이 몇 줄의 코드로 시작하세요.
          </p>

          {/* Install command */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg">
              <code className="text-xs text-neutral-300 font-mono">
                npm install @ssgoi/react
              </code>
              <button
                onClick={handleCopy}
                className="text-neutral-500 hover:text-white transition-colors"
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
              시작하기
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/${lang}/demo`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              데모 보기
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
