"use client";

import { useState } from "react";

export function TransitionDemoSection() {
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
