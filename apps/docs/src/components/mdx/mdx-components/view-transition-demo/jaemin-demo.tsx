"use client";

import React, { memo } from "react";
import { jaemin } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Home Page - Jaemin's Creative Space
function HomePage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/jaemin"
      className="bg-gray-900 min-h-full relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div
        className={cn(
          "mx-auto relative z-10",
          isMobile ? "px-3 py-6" : "max-w-7xl px-4 py-16 sm:py-24",
        )}
      >
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-600/20 rounded-full">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
            <span className="text-purple-400 text-xs font-bold tracking-wider uppercase">
              Created by Jaemin
            </span>
          </div>

          <div className="space-y-4">
            <h1
              className={cn(
                "font-black text-white tracking-tighter",
                isMobile ? "text-4xl" : "text-6xl sm:text-8xl",
              )}
            >
              <span className="block text-gray-400 text-lg sm:text-2xl font-light tracking-[0.2em] uppercase mb-4">
                SSGOI Presents
              </span>
              <span className="inline-block bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                JAEMIN
              </span>
            </h1>
            <p
              className={cn(
                "text-gray-400 max-w-2xl mx-auto font-light tracking-wide",
                isMobile ? "text-sm" : "text-lg",
              )}
            >
              회전과 스케일의 조화로운 전환 효과
              <span className="block mt-2 text-gray-500 italic">
                "작은 점에서 시작해 화면을 가득 채우는 마법"
              </span>
            </p>
            <div className="mt-4">
              <a
                href="https://github.com/elrion018"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="text-sm">@elrion018</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold uppercase tracking-wider overflow-hidden transition-all hover:scale-105 rounded-lg">
              <span className="relative z-10">Experience Magic</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="px-8 py-4 border border-gray-700 text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-all rounded-lg">
              View Source
            </button>
          </div>
        </div>

        {/* Animation Showcase Grid */}
        <div className="mb-24">
          <h2 className="text-gray-400 font-light tracking-[0.3em] uppercase text-sm mb-8 text-center">
            Motion Characteristics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-purple-900/30 to-purple-700/30 rounded-lg p-8 border border-purple-600/20 hover:border-purple-500/40 transition-all">
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 rounded-full border-2 border-purple-500/50 flex items-center justify-center">
                  <span className="text-purple-400 text-lg">45°</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Rotation</h3>
              <p className="text-gray-400 text-sm">
                45도 회전으로 시작하여 자연스럽게 정위치로
              </p>
              <div className="mt-4 flex gap-2">
                <div className="px-2 py-1 bg-purple-600/20 rounded text-xs text-purple-300">
                  초기: 45°
                </div>
                <div className="px-2 py-1 bg-purple-600/20 rounded text-xs text-purple-300">
                  최종: 0°
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-900/30 to-blue-700/30 rounded-lg p-8 border border-blue-600/20 hover:border-blue-500/40 transition-all">
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 rounded-full border-2 border-blue-500/50 flex items-center justify-center">
                  <span className="text-blue-400 text-xs">0.01x</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Scale</h3>
              <p className="text-gray-400 text-sm">
                작은 점에서 화면 전체로 확장되는 드라마틱한 변화
              </p>
              <div className="mt-4 flex gap-2">
                <div className="px-2 py-1 bg-blue-600/20 rounded text-xs text-blue-300">
                  시작: 0.01
                </div>
                <div className="px-2 py-1 bg-blue-600/20 rounded text-xs text-blue-300">
                  완료: 1.0
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-pink-900/30 to-pink-700/30 rounded-lg p-8 border border-pink-600/20 hover:border-pink-500/40 transition-all">
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 rounded-full border-2 border-pink-500/50 flex items-center justify-center">
                  <span className="text-pink-400 text-lg">⚡</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Timing</h3>
              <p className="text-gray-400 text-sm">
                Nonic 이징으로 극적인 가속도 변화
              </p>
              <div className="mt-4 flex gap-2">
                <div className="px-2 py-1 bg-pink-600/20 rounded text-xs text-pink-300">
                  Entry: 5%
                </div>
                <div className="px-2 py-1 bg-pink-600/20 rounded text-xs text-pink-300">
                  Finale: 20%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Excellence */}
        <div className="text-center border-t border-gray-800 pt-16">
          <h3 className="text-xl font-bold text-white mb-8">Performance Optimized</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">60fps</div>
              <div className="text-xs uppercase tracking-wider">
                Smooth Animation
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">GPU</div>
              <div className="text-xs uppercase tracking-wider">
                Hardware Accelerated
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">0ms</div>
              <div className="text-xs uppercase tracking-wider">
                Layout Reflow
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Features Page - Technical Deep Dive
function FeaturesPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/jaemin/features" className="bg-gray-900 min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-16",
        )}
      >
        <div className="mb-12">
          <h1
            className={cn(
              "font-black text-white tracking-tight mb-4",
              isMobile ? "text-3xl" : "text-5xl",
            )}
          >
            Technical Details
          </h1>
          <p className="text-gray-400 text-lg">
            재민 전환의 기술적 구현과 최적화 기법
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Animation Phases */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-600/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Animation Phases</h3>
                <p className="text-gray-500 text-sm">
                  3단계 타이밍 시스템
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">Entry Phase (0-5%)</div>
                  <div className="text-gray-400 text-sm">
                    극소 크기로 진입, 회전 상태 유지
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">
                    Growth Phase (5-80%)
                  </div>
                  <div className="text-gray-400 text-sm">
                    Nonic 이징으로 점진적 확대, 회전 유지
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">Finale Phase (80-100%)</div>
                  <div className="text-gray-400 text-sm">
                    급속 확대, 회전 복귀, 모서리 변형
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Features */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Performance Optimizations
                </h3>
                <p className="text-gray-500 text-sm">
                  부드러운 60fps 보장
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">GPU Acceleration</div>
                  <div className="text-gray-400 text-sm">
                    translateZ(0), will-change 최적화
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">
                    CSS Variables
                  </div>
                  <div className="text-gray-400 text-sm">
                    동적 계산 최소화, CSS 변수 활용
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">Fixed Viewport</div>
                  <div className="text-gray-400 text-sm">
                    레이아웃 리플로우 방지
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            Configuration Options
          </h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Spring Physics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-purple-400 font-mono text-sm mb-2">stiffness</div>
                  <div className="text-gray-400 text-sm mb-3">
                    스프링 강도 (기본값: 50)
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      25 = 매우 느림
                    </span>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      100 = 빠름
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-purple-400 font-mono text-sm mb-2">damping</div>
                  <div className="text-gray-400 text-sm mb-3">
                    감쇠 계수 (기본값: 30)
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      10 = 바운스
                    </span>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      50 = 부드러움
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Transform Options</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-blue-400 font-mono text-sm mb-2">initialRotation</div>
                  <div className="text-gray-400 text-sm">
                    초기 회전 각도 (기본값: 45도)
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 font-mono text-sm mb-2">initialScale</div>
                  <div className="text-gray-400 text-sm">
                    초기 스케일 값 (기본값: 0.01)
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 font-mono text-sm mb-2">rotationTriggerPoint</div>
                  <div className="text-gray-400 text-sm">
                    회전 시작 지점 (기본값: 0.8 = 80%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-8 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">
            Implementation Example
          </h3>
          <div className="bg-black/50 p-6 rounded-lg border border-gray-600">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-500 text-xs ml-2">jaemin.config.ts</span>
            </div>
            <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
              <code>{`import { jaemin } from '@ssgoi/react/view-transitions';

const customJaemin = jaemin({
  spring: {
    stiffness: 60,  // 약간 빠른 애니메이션
    damping: 25     // 부드러운 감속
  },
  initialRotation: 30,      // 덜 극적인 회전
  initialScale: 0.05,       // 좀 더 큰 시작
  rotationTriggerPoint: 0.7 // 더 일찍 회전 시작
});

export default customJaemin;`}</code>
            </pre>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Examples Page - Use Cases
function ExamplesPage() {
  const isMobile = useMobile();

  const examples = [
    {
      title: "Dashboard Entry",
      description: "로그인 후 대시보드 진입",
      color: "purple",
      icon: "📊",
      code: `jaemin({
  spring: { stiffness: 60 }
})`,
    },
    {
      title: "Profile View",
      description: "사용자 프로필 상세",
      color: "blue",
      icon: "👤",
      code: `jaemin({
  initialRotation: 30
})`,
    },
    {
      title: "Premium Feature",
      description: "프리미엄 기능 진입",
      color: "pink",
      icon: "✨",
      code: `jaemin({
  initialScale: 0.02
})`,
    },
    {
      title: "Onboarding Complete",
      description: "튜토리얼 완료 후",
      color: "green",
      icon: "🎉",
      code: `jaemin({
  rotationTriggerPoint: 0.9
})`,
    },
  ];

  return (
    <DemoPage path="/jaemin/examples" className="bg-gray-900 min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-7xl px-4 py-16",
        )}
      >
        <div className="mb-12">
          <h1
            className={cn(
              "font-black text-white tracking-tight mb-4",
              isMobile ? "text-3xl" : "text-5xl",
            )}
          >
            Use Cases
          </h1>
          <p className="text-gray-400 text-lg">
            재민 전환을 활용한 다양한 사용 예시
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {examples.map((example, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-500"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{example.icon}</div>
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      example.color === "purple" &&
                        "bg-purple-600/20 text-purple-400 border border-purple-600/30",
                      example.color === "blue" &&
                        "bg-blue-600/20 text-blue-400 border border-blue-600/30",
                      example.color === "pink" &&
                        "bg-pink-600/20 text-pink-400 border border-pink-600/30",
                      example.color === "green" &&
                        "bg-green-600/20 text-green-400 border border-green-600/30",
                    )}
                  >
                    Example
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {example.title}
                </h3>
                <p className="text-gray-400 mb-6">{example.description}</p>
                <div className="bg-black/50 p-4 rounded border border-gray-700">
                  <pre className="text-gray-300 font-mono text-xs">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </div>
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                  example.color === "purple" &&
                    "bg-gradient-to-t from-purple-600/20 to-transparent",
                  example.color === "blue" &&
                    "bg-gradient-to-t from-blue-600/20 to-transparent",
                  example.color === "pink" &&
                    "bg-gradient-to-t from-pink-600/20 to-transparent",
                  example.color === "green" &&
                    "bg-gradient-to-t from-green-600/20 to-transparent",
                )}
              />
            </div>
          ))}
        </div>

        {/* Comparison with Other Transitions */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            다른 전환과의 비교
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-400 font-normal py-3 px-4">
                    Transition
                  </th>
                  <th className="text-left text-gray-400 font-normal py-3 px-4">
                    특징
                  </th>
                  <th className="text-left text-gray-400 font-normal py-3 px-4">
                    사용 시점
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">
                    <span className="text-purple-400 font-mono">jaemin()</span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    회전 + 스케일 + 둥근 모서리
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    특별한 화면, 중요한 전환
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">
                    <span className="text-gray-400 font-mono">fade()</span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">단순 투명도 변화</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    일반적인 화면 전환
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">
                    <span className="text-gray-400 font-mono">film()</span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    필름 프레임 효과
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    시네마틱한 전환
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="text-gray-400 font-mono">hero()</span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    공유 요소 확대
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    리스트 → 상세
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Getting Started Page - Implementation Guide
function GettingStartedPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/jaemin/start" className="bg-gray-900 min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-5xl px-4 py-16",
        )}
      >
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-2 bg-purple-600/10 border border-purple-600/20 rounded-full mb-6">
            <span className="text-purple-400 text-xs font-bold tracking-wider uppercase">
              Implementation Guide
            </span>
          </div>
          <h1
            className={cn(
              "font-black text-white tracking-tight mb-4",
              isMobile ? "text-3xl" : "text-5xl",
            )}
          >
            Getting Started
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            재민 전환을 프로젝트에 적용하는 방법
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold text-purple-500">STEP 1</div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  Installation
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                SSGOI 패키지 설치
              </p>
              <div className="bg-black/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500 text-xs ml-2">terminal</span>
                </div>
                <pre className="text-green-400 font-mono text-sm">
                  <code>{`$ npm install @ssgoi/react
# 또는
$ yarn add @ssgoi/react
# 또는
$ pnpm add @ssgoi/react`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-pink-600" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold text-blue-500">
                  STEP 2
                </div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  Basic Setup
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                앱에 재민 전환 적용
              </p>
              <div className="bg-black/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500 text-xs ml-2">App.tsx</span>
                </div>
                <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                  <code>{`import { Ssgoi } from '@ssgoi/react';
import { jaemin } from '@ssgoi/react/view-transitions';

export default function App() {
  return (
    <Ssgoi
      config={{
        defaultTransition: jaemin()
      }}
    >
      {/* Your app content */}
    </Ssgoi>
  );
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-600 to-purple-600" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold text-pink-500">STEP 3</div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  Page Wrapping
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                각 페이지를 SsgoiTransition으로 감싸기
              </p>
              <div className="bg-black/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500 text-xs ml-2">
                    DashboardPage.tsx
                  </span>
                </div>
                <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                  <code>{`import { SsgoiTransition } from '@ssgoi/react';

export default function DashboardPage() {
  return (
    <SsgoiTransition id="/dashboard">
      <div className="dashboard">
        {/* Your dashboard content */}
      </div>
    </SsgoiTransition>
  );
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Advanced Configuration */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  ADVANCED
                </div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  Custom Config
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                세부 설정으로 나만의 효과 만들기
              </p>
              <div className="bg-black/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500 text-xs ml-2">
                    transitions.config.ts
                  </span>
                </div>
                <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                  <code>{`const config = {
  transitions: [
    {
      from: '/login',
      to: '/dashboard',
      transition: jaemin({
        spring: { stiffness: 70, damping: 28 },
        initialRotation: 60,     // 더 극적인 회전
        initialScale: 0.001,      // 더 작은 시작
        rotationTriggerPoint: 0.85 // 늦은 회전 시작
      })
    },
    {
      from: '/dashboard',
      to: '/profile/*',
      transition: jaemin({
        initialRotation: 30,      // 부드러운 전환
        initialScale: 0.05
      })
    }
  ]
};`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="relative bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-8 rounded-lg border border-purple-600/30">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                준비 완료!
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                이제 여러분의 애플리케이션에 재민 전환이 적용되었습니다.
                작은 점에서 시작해 화면을 가득 채우는 마법같은 전환 효과를 경험해보세요.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <a
                  href="https://github.com/elrion018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-black/50 rounded-lg border border-gray-700 text-white hover:bg-black/70 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span className="text-sm">Created by @elrion018</span>
                  </div>
                </a>
                <div className="px-4 py-2 bg-black/50 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Performance
                  </div>
                  <div className="text-white font-bold">60 FPS</div>
                </div>
                <div className="px-4 py-2 bg-black/50 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Compatibility
                  </div>
                  <div className="text-white font-bold">100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const jaeminRoutes: RouteConfig[] = [
  { path: "/jaemin", component: HomePage, label: "Home" },
  { path: "/jaemin/features", component: FeaturesPage, label: "Features" },
  { path: "/jaemin/examples", component: ExamplesPage, label: "Examples" },
  { path: "/jaemin/start", component: GettingStartedPage, label: "Guide" },
];

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <a
        href="https://github.com/elrion018"
        className="text-gray-300 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </a>
      <a
        href="https://www.npmjs.com/package/@ssgoi/react"
        className="text-gray-300 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
        </svg>
      </a>
    </>
  );
}

// Add CSS for gradient animation
const gradientStyle = `
  @keyframes gradient {
    0%, 100% {
      background-size: 200% 200%;
      background-position: left center;
    }
    50% {
      background-size: 200% 200%;
      background-position: right center;
    }
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
  }
`;

export function JaeminDemo() {
  const config = {
    defaultTransition: jaemin(),
  };

  // Custom layout with Jaemin branding
  function SSGOILayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: gradientStyle }} />
        <DemoLayout
          logo="✨"
          title="Jaemin Transition"
          headerActions={<HeaderActions />}
        >
          {children}
        </DemoLayout>
      </>
    );
  }

  return (
    <BrowserMockup routes={jaeminRoutes} config={config} layout={SSGOILayout} />
  );
}

// Default Demo Layout Component
interface DemoLayoutProps {
  children: React.ReactNode;
  logo?: string;
  title?: string;
  headerActions?: React.ReactNode;
}

const DemoLayout = memo(
  ({
    children,
    logo = "✨",
    title = "Jaemin Demo",
    headerActions,
  }: DemoLayoutProps) => {
    const context = React.useContext(BrowserContext);
    const isMobile = useMobile();

    if (!context) return <>{children}</>;

    const { currentPath, navigate, routes } = context;

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className={cn("mx-auto", isMobile ? "px-3" : "max-w-6xl px-4")}>
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-4">
                <h1
                  className={cn(
                    "font-bold text-white flex items-center gap-2",
                    isMobile ? "text-base" : "text-xl",
                  )}
                >
                  <span>{logo}</span>
                  <span>{title}</span>
                </h1>
                <nav className="flex items-center gap-1">
                  {routes.map((route) => (
                    <button
                      key={route.path}
                      onClick={() => navigate(route.path)}
                      className={cn(
                        "rounded-md font-medium transition-all",
                        isMobile ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm",
                        currentPath === route.path
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      )}
                    >
                      {route.label}
                    </button>
                  ))}
                </nav>
              </div>
              {!isMobile && headerActions && (
                <div className="flex items-center gap-4">{headerActions}</div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative z-0">{children}</main>
      </div>
    );
  },
);

DemoLayout.displayName = "DemoLayout";