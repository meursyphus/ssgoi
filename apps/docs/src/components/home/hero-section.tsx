"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Check, ChevronRight, Sparkles } from "lucide-react";
import Demo from "@/components/demo";
import { messages } from "@/messages";

const LLMS_URL = "ssgoi.dev/llms.txt";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${LLMS_URL}`);
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
                {messages.home.newHome.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight leading-tight mb-6">
              {messages.home.newHome.hero.title.line1}
              <br />
              <span className="text-neutral-400">
                {messages.home.newHome.hero.title.line2}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm text-neutral-300 leading-relaxed mb-8 max-w-md">
              {messages.home.newHome.hero.description}
            </p>

            {/* AI / llms.txt card */}
            <div className="mb-10 max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider text-emerald-400">
                  {messages.home.newHome.hero.llms.label}
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg">
                <code className="text-xs text-neutral-300 font-mono flex-1 truncate">
                  {LLMS_URL}
                </code>
                <button
                  onClick={handleCopy}
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label="Copy URL"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed mt-2">
                {messages.home.newHome.hero.llms.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <Link
                href={`/docs`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
              >
                {messages.home.newHome.hero.getStarted}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/demo`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs text-neutral-300 hover:text-white transition-colors"
              >
                {messages.home.newHome.hero.viewDemo}
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
