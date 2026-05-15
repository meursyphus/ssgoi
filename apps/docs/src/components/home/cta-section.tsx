"use client";

import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { messages } from "@/messages";

export function CTASection() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-light tracking-tight mb-4">
          {messages.home.newHome.cta.title}
        </h2>
        <p className="text-sm text-neutral-400 mb-8 max-w-md mx-auto">
          {messages.home.newHome.cta.description}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/docs`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            {messages.home.newHome.cta.viewDocs}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://github.com/meursyphus/ssgoi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs text-neutral-300 border border-white/10 rounded-lg hover:bg-white/[0.02] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
