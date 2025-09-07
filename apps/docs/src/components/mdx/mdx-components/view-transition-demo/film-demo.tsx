"use client";

import React, { memo } from "react";
import { film } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Home Page - Film Introduction
function HomePage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/film"
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12 sm:py-20",
        )}
      >
        <div className="text-center space-y-6">
          <div className="inline-block p-3 bg-purple-500/10 rounded-full mb-4">
            <span className="text-purple-400 text-sm font-semibold">
              CINEMATIC TRANSITIONS
            </span>
          </div>
          <h1
            className={cn(
              "font-bold text-white",
              isMobile ? "text-2xl" : "text-4xl sm:text-6xl",
            )}
          >
            Film{" "}
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transition
            </span>
          </h1>
          <p
            className={cn(
              "text-gray-300 max-w-2xl mx-auto",
              isMobile ? "text-base" : "text-xl sm:text-2xl",
            )}
          >
            영화 필름처럼 회전하는 전환 효과로 페이지 간 이동에 입체감을 더합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              시작하기
            </button>
            <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              문서 보기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              시네마틱 효과
            </h3>
            <p className="text-gray-400 text-sm">
              3D 회전으로 영화적인 전환 경험 제공
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-white mb-2">부드러운 애니메이션</h3>
            <p className="text-gray-400 text-sm">
              스프링 기반 물리 엔진으로 자연스러운 움직임
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              커스터마이징
            </h3>
            <p className="text-gray-400 text-sm">
              다양한 옵션으로 원하는 효과 구현
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Features Page
function FeaturesPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/film/features"
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-4 py-6" : "max-w-6xl px-4 py-12 sm:py-20",
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-12 pb-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">SSGOI Film</h2>
          <nav className="flex gap-6">
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              홈
            </span>
            <span className="text-white font-semibold">특징</span>
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              문서
            </span>
          </nav>
        </header>

        {/* Content */}
        <div className="space-y-12">
          <div>
            <h1
              className={cn(
                "font-bold text-white mb-6",
                isMobile ? "text-2xl" : "text-4xl",
              )}
            >
              Film 전환의 특징
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Film 전환은 페이지가 3D 공간에서 회전하며 전환되는 효과입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">
                🎬 3D 회전 효과
              </h3>
              <p className="text-gray-300 mb-4">
                Y축을 기준으로 회전하는 페이지 전환으로 깊이감 있는 네비게이션을 제공합니다.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• 부드러운 3D 변환</li>
                <li>• 자연스러운 페이드 효과</li>
                <li>• 최적화된 렌더링</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">
                ⚡ 고성능 애니메이션
              </h3>
              <p className="text-gray-300 mb-4">
                GPU 가속을 활용한 부드러운 60fps 애니메이션을 제공합니다.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• CSS Transform 활용</li>
                <li>• 하드웨어 가속</li>
                <li>• 낮은 CPU 사용률</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">
                🎨 커스터마이징 가능
              </h3>
              <p className="text-gray-300 mb-4">
                스프링 설정을 통해 원하는 느낌의 애니메이션을 구현할 수 있습니다.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Stiffness 조절</li>
                <li>• Damping 설정</li>
                <li>• 타이밍 커스터마이징</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">
                📱 크로스 플랫폼
              </h3>
              <p className="text-gray-300 mb-4">
                모든 최신 브라우저와 디바이스에서 동일한 경험을 제공합니다.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• 모바일 최적화</li>
                <li>• 터치 제스처 지원</li>
                <li>• 반응형 디자인</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Documentation Page
function DocsPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/film/docs"
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-4 py-6" : "max-w-6xl px-4 py-12 sm:py-20",
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-12 pb-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">SSGOI Film</h2>
          <nav className="flex gap-6">
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              홈
            </span>
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              특징
            </span>
            <span className="text-white font-semibold">문서</span>
          </nav>
        </header>

        {/* Content */}
        <div className="space-y-8">
          <div>
            <h1
              className={cn(
                "font-bold text-white mb-6",
                isMobile ? "text-2xl" : "text-4xl",
              )}
            >
              Film 전환 사용법
            </h1>
            <p className="text-gray-300 text-lg">
              Film 전환을 프로젝트에 적용하는 방법을 알아봅니다.
            </p>
          </div>

          {/* Installation */}
          <section className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">설치</h2>
            <div className="bg-gray-900 p-4 rounded-md">
              <code className="text-green-400">npm install @ssgoi/react</code>
            </div>
          </section>

          {/* Basic Usage */}
          <section className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">기본 사용법</h2>
            <div className="bg-gray-900 p-4 rounded-md overflow-x-auto">
              <pre className="text-gray-300 text-sm">
                <code>{`import { Ssgoi } from '@ssgoi/react';
import { film } from '@ssgoi/react/view-transitions';

const config = {
  defaultTransition: film()
};

export default function App() {
  return (
    <Ssgoi config={config}>
      {/* 앱 내용 */}
    </Ssgoi>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Configuration */}
          <section className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">설정 옵션</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Spring 설정
                </h3>
                <p className="text-gray-400">
                  애니메이션의 물리적 특성을 조절할 수 있습니다.
                </p>
                <div className="bg-gray-900 p-4 rounded-md mt-2">
                  <code className="text-gray-300 text-sm">
                    {`film({
  inSpring: { stiffness: 200, damping: 20 },
  outSpring: { stiffness: 200, damping: 20 }
})`}
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Examples */}
          <section className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">예제</h2>
            <div className="grid gap-4">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  특정 경로에만 적용
                </h3>
                <p className="text-gray-400 text-sm">
                  특정 경로 간 이동에만 Film 전환을 적용할 수 있습니다.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  커스텀 타이밍
                </h3>
                <p className="text-gray-400 text-sm">
                  Spring 값을 조절하여 원하는 속도와 느낌을 구현할 수 있습니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DemoPage>
  );
}

const routes: RouteConfig[] = [
  { path: "/film", label: "홈" },
  { path: "/film/features", label: "특징" },
  { path: "/film/docs", label: "문서" },
];

const FilmDemoComponent = () => {
  return (
    <BrowserMockup
      ssgoiConfig={{
        defaultTransition: film(),
      }}
      initialPath="/film"
      routes={routes}
    >
      <HomePage />
      <FeaturesPage />
      <DocsPage />
    </BrowserMockup>
  );
};

export const FilmDemo = memo(FilmDemoComponent);