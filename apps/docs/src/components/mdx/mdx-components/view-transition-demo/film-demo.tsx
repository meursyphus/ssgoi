"use client";

import React, { memo } from "react";
import { film } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Home Page - SSGOI Introduction
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
            Welcome to{" "}
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SSGOI Film
            </span>
          </h1>
          <p
            className={cn(
              "text-gray-300 max-w-2xl mx-auto",
              isMobile ? "text-base" : "text-xl sm:text-2xl",
            )}
          >
            시네마틱한 전환 효과로 웹 페이지에 특별한 경험을 더합니다. 프리미엄
            브랜드 경험을 위한 완벽한 선택입니다.
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
              영화같은 전환으로 특별한 경험 제공
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              부드러운 모션
            </h3>
            <p className="text-gray-400 text-sm">
              스프링 기반 물리 엔진으로 자연스러운 움직임
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              최상위 네비게이션
            </h3>
            <p className="text-gray-400 text-sm">
              헤더나 탭 네비게이션에 최적화
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
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <h1
          className={cn(
            "font-bold text-white mb-8",
            isMobile ? "text-2xl" : "text-4xl",
          )}
        >
          특징
        </h1>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎨 프리미엄 전환 효과
            </h2>
            <p className="text-gray-300 mb-4">
              단순한 페이드보다 더 역동적이고 특별한 전환 효과를 제공합니다.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["fade", "film", "scroll", "hero", "pinterest", "drill"].map(
                (transition) => (
                  <div
                    key={transition}
                    className={cn(
                      "px-3 py-2 rounded text-center text-sm",
                      transition === "film"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300",
                    )}
                  >
                    {transition}()
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              ⚙️ 커스터마이징
            </h2>
            <p className="text-gray-300 mb-4">
              Spring 설정을 통해 원하는 속도와 느낌으로 커스터마이징 가능합니다.
            </p>
            <pre className="bg-gray-900 p-4 rounded text-xs overflow-x-auto">
              <code className="text-gray-300">{`{
  defaultTransition: film({
    spring: {
      stiffness: 150,
      damping: 25
    }
  })
}`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              💾 최상위 네비게이션 최적화
            </h2>
            <p className="text-gray-300">
              관련 없는 콘텐츠 간 이동, 헤더 네비게이션, 메인 탭 전환에 최적화된
              전환 효과입니다.
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Examples Page
function ExamplesPage() {
  const isMobile = useMobile();

  const examples = [
    {
      title: "프리미엄 브랜드",
      description: "럭셔리 브랜드 사이트의 메인 네비게이션",
      icon: "💎",
      transitions: ["film", "fade"],
    },
    {
      title: "포트폴리오",
      description: "작품 카테고리 간 전환",
      icon: "🎨",
      transitions: ["film", "hero"],
    },
    {
      title: "미디어 플랫폼",
      description: "영상/음악 섹션 간 이동",
      icon: "🎬",
      transitions: ["film", "fade"],
    },
    {
      title: "패션 커머스",
      description: "시즌/컬렉션 간 네비게이션",
      icon: "👗",
      transitions: ["film", "pinterest"],
    },
  ];

  return (
    <DemoPage
      path="/film/examples"
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12",
        )}
      >
        <h1
          className={cn(
            "font-bold text-white mb-8",
            isMobile ? "text-2xl" : "text-4xl",
          )}
        >
          활용 예시
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-32 bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center text-5xl">
                {example.icon}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {example.title}
                </h3>
                <p className="text-gray-400 mb-4">{example.description}</p>
                <div className="flex flex-wrap gap-2">
                  {example.transitions.map((transition) => (
                    <span
                      key={transition}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm",
                        transition === "film"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300",
                      )}
                    >
                      {transition}()
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Getting Started Page
function GettingStartedPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/film/start"
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <h1
          className={cn(
            "font-bold text-white mb-8",
            isMobile ? "text-2xl" : "text-4xl",
          )}
        >
          시작하기
        </h1>

        <div className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              1. SSGOI 설치
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`npm install @ssgoi/react`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Film 전환 적용
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`import { Ssgoi } from '@ssgoi/react';
import { film } from '@ssgoi/react/view-transitions';

export default function App() {
  return (
    <Ssgoi config={{ defaultTransition: film() }}>
      {/* 앱 내용 */}
    </Ssgoi>
  );
}`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              3. 페이지 컴포넌트 래핑
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`import { SsgoiTransition } from '@ssgoi/react';

export default function HomePage() {
  return (
    <SsgoiTransition id="/home">
      {/* 페이지 내용 */}
    </SsgoiTransition>
  );
}`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">✨ 완료!</h2>
            <p className="text-gray-300">
              이제 페이지 전환 시 시네마틱한 Film 효과가 적용됩니다. 최상위
              네비게이션이나 독립적인 섹션 간 이동에 사용하세요.
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const filmRoutes: RouteConfig[] = [
  { path: "/film", component: HomePage, label: "홈" },
  { path: "/film/features", component: FeaturesPage, label: "특징" },
  { path: "/film/examples", component: ExamplesPage, label: "예시" },
  { path: "/film/start", component: GettingStartedPage, label: "시작" },
];

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <a
        href="https://github.com/meursyphus/ssgoi"
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

export function FilmDemo() {
  const config = {
    defaultTransition: film(),
  };

  // Custom layout with SSGOI branding
  function SSGOILayout({ children }: { children: React.ReactNode }) {
    return (
      <DemoLayout
        logo="🎬"
        title="SSGOI Film"
        headerActions={<HeaderActions />}
      >
        {children}
      </DemoLayout>
    );
  }

  return (
    <BrowserMockup routes={filmRoutes} config={config} layout={SSGOILayout} />
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
    logo = "🎬",
    title = "Film Demo",
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
