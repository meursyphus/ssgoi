"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CodeSection() {
  const [activeTab, setActiveTab] = useState<"setup" | "config">("setup");

  const setupCode = `import { Ssgoi, SsgoiTransition } from '@ssgoi/react';
import { fade } from '@ssgoi/react/view-transitions';

// 앱을 Ssgoi로 감싸세요
<Ssgoi config={{ defaultTransition: fade() }}>
  <App />
</Ssgoi>

// 각 페이지를 SsgoiTransition으로 감싸세요
<SsgoiTransition id={pathname}>
  <PageContent />
</SsgoiTransition>`;

  const configCode = `const config = {
  defaultTransition: fade(),
  transitions: [
    {
      from: '/products',
      to: '/products/*',
      transition: hero(),
      symmetric: true
    },
    {
      from: '/feed',
      to: '/feed/*',
      transition: scroll({ direction: 'up' })
    }
  ]
};`;

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
            Code
          </p>
          <h2 className="text-xl font-light tracking-tight mb-2">
            간단한 시작
          </h2>
          <p className="text-xs text-neutral-500">
            몇 줄의 코드로 페이지 전환을 구현하세요.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("setup")}
            className={`text-xs pb-2 border-b-2 transition-colors ${
              activeTab === "setup"
                ? "text-white border-white"
                : "text-neutral-500 border-transparent hover:text-neutral-300"
            }`}
          >
            기본 설정
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`text-xs pb-2 border-b-2 transition-colors ${
              activeTab === "config"
                ? "text-white border-white"
                : "text-neutral-500 border-transparent hover:text-neutral-300"
            }`}
          >
            라우트 설정
          </button>
        </div>

        {/* Code block */}
        <div className="bg-[#111] rounded-lg border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <span className="text-[10px] text-neutral-500">
              {activeTab === "setup" ? "app.tsx" : "config.ts"}
            </span>
            <CopyButton text={activeTab === "setup" ? setupCode : configCode} />
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre">
              {activeTab === "setup" ? setupCode : configCode}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
  );
}
