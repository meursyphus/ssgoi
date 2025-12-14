"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Zap,
  Globe,
  Sparkles,
} from "lucide-react";
import { SsgoiTransition } from "@/components/docs/ssgoi";

export default function NewLanding() {
  return (
    <SsgoiTransition id="/" className="min-h-screen">
      <HeroSection />
      <TransitionDemoSection />
      <FeaturesSection />
      <CodeSection />
      <FrameworksSection />
      <CTASection />
      <Footer />
    </SsgoiTransition>
  );
}

function HeroSection() {
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
              href="/ko/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
            >
              시작하기
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/ko/demo"
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

function TransitionDemoSection() {
  const transitions = ["fade", "scroll", "hero", "drill"] as const;
  const [activeTransition, setActiveTransition] =
    useState<(typeof transitions)[number]>("fade");
  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTransitionClick = (type: (typeof transitions)[number]) => {
    if (type === activeTransition) return;
    setActiveTransition(type);
    setCurrentView("list");
  };

  const handleItemClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentView(currentView === "list" ? "detail" : "list");
    setTimeout(() => setIsAnimating(false), 500);
  };

  const transitionLabels = {
    fade: "페이드",
    scroll: "스크롤",
    hero: "히어로",
    drill: "드릴",
  };

  const transitionDescriptions = {
    fade: "부드러운 투명도 전환으로 자연스러운 페이지 이동",
    scroll: "수직 스크롤 애니메이션으로 컨텐츠 탐색",
    hero: "공유 요소가 자연스럽게 확대되는 전환",
    drill: "깊이감 있는 진입/이탈 효과",
  };

  const getAnimationClass = () => {
    const base = "transition-all duration-500 ease-out";
    if (!isAnimating) return base;

    switch (activeTransition) {
      case "scroll":
        return `${base} ${currentView === "detail" ? "animate-slide-up" : "animate-slide-down"}`;
      case "hero":
        return `${base} ${currentView === "detail" ? "animate-scale-up" : "animate-scale-down"}`;
      case "drill":
        return `${base} ${currentView === "detail" ? "animate-drill-in" : "animate-drill-out"}`;
      default:
        return `${base} ${isAnimating ? "animate-fade" : ""}`;
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
            Transitions
          </p>
          <h2 className="text-xl font-light tracking-tight mb-2">
            다양한 전환 효과
          </h2>
          <p className="text-xs text-neutral-500 max-w-md">
            상황에 맞는 트랜지션을 선택하세요. 각 전환은 물리 기반 스프링
            애니메이션으로 자연스럽게 동작합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo preview */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] bg-neutral-900/50 rounded-lg border border-white/5 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="flex-1 mx-4">
                  <div className="w-full max-w-[200px] h-5 bg-white/5 rounded text-[10px] text-neutral-500 flex items-center justify-center">
                    ssgoi.dev
                  </div>
                </div>
              </div>

              {/* Content area */}
              <div
                className="p-6 h-[calc(100%-44px)] cursor-pointer overflow-hidden"
                onClick={handleItemClick}
              >
                <div className={getAnimationClass()}>
                  {currentView === "list" ? <ListView /> : <DetailView />}
                </div>
              </div>

              {/* Click hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-neutral-600">
                클릭하여 전환 확인
              </div>
            </div>
          </div>

          {/* Transition selector */}
          <div className="order-1 lg:order-2 space-y-3">
            {transitions.map((type) => (
              <button
                key={type}
                onClick={() => handleTransitionClick(type)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  activeTransition === type
                    ? "bg-white/[0.03] border-white/10"
                    : "border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium ${
                      activeTransition === type
                        ? "text-white"
                        : "text-neutral-500"
                    }`}
                  >
                    {transitionLabels[type]}
                  </span>
                  <span className="text-[10px] text-neutral-600 font-mono">
                    {type}()
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600">
                  {transitionDescriptions[type]}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ListView() {
  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square rounded bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/5"
          />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2 w-24 bg-white/10 rounded" />
        <div className="h-2 w-32 bg-white/5 rounded" />
      </div>
    </div>
  );
}

function DetailView() {
  return (
    <div className="h-full">
      <div className="aspect-video rounded bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/5 mb-4" />
      <div className="space-y-2">
        <div className="h-2 w-32 bg-white/10 rounded" />
        <div className="h-2 w-full bg-white/5 rounded" />
        <div className="h-2 w-3/4 bg-white/5 rounded" />
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "제로 설정",
      description: "복잡한 설정 없이 바로 시작. 기본값만으로도 충분합니다.",
    },
    {
      icon: Globe,
      title: "모든 브라우저",
      description:
        "Chrome의 View Transitions API에 의존하지 않아 Safari, Firefox에서도 동작합니다.",
    },
    {
      icon: Layers,
      title: "SSR 지원",
      description:
        "Next.js, Nuxt, SvelteKit 등 모든 SSR 프레임워크와 완벽 호환됩니다.",
    },
    {
      icon: Sparkles,
      title: "물리 기반 애니메이션",
      description:
        "스프링 물리학을 사용해 자연스럽고 반응적인 전환을 제공합니다.",
    },
  ];

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-xl font-light tracking-tight">왜 SSGOI인가</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {features.map((feature, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {feature.description}
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

function CodeSection() {
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

function FrameworksSection() {
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
            Frameworks
          </p>
          <h2 className="text-xl font-light tracking-tight mb-2">
            모든 프레임워크 지원
          </h2>
          <p className="text-xs text-neutral-500">
            같은 API, 같은 경험. 프레임워크에 관계없이 일관된 전환 효과.
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
                <span className="ml-2 text-[10px] text-neutral-600">soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-light tracking-tight mb-4">
          지금 시작하세요
        </h2>
        <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto">
          몇 분 안에 네이티브 수준의 페이지 전환을 구현할 수 있습니다.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/ko/docs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            문서 보기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://github.com/meursyphus/ssgoi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs text-neutral-400 border border-white/10 rounded-lg hover:bg-white/[0.02] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-[10px] text-neutral-600">MIT License</span>
        <span className="text-[10px] text-neutral-600">Built with care</span>
      </div>
    </footer>
  );
}
