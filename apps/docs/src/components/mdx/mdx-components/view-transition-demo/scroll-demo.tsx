"use client";

import React from "react";
import { scroll } from "@ssgoi/react/view-transitions";
import { BrowserMockup, DemoPage, DemoLink } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Intro Section Page
function IntroPage() {
  return (
    <DemoPage path="/intro" title="소개">
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-6 text-4xl">📝</div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          스크롤 전환 소개
        </h1>

        <p className="mb-6 text-lg text-gray-600">
          페이지가 위아래로 자연스럽게 스크롤되며 전환되는 효과입니다.
        </p>

        <div className="space-y-3">
          {[
            "부드러운 스크롤 애니메이션",
            "모바일 앱과 유사한 UX",
            "직관적인 페이지 이동",
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-500 p-2">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">시작하기</p>
              <p className="text-sm text-gray-600">
                왼쪽 메뉴를 클릭하여 다른 섹션으로 이동하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Features Section Page
function FeaturesPage() {
  return (
    <DemoPage path="/features" title="기능">
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-6 text-4xl">✨</div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">주요 기능</h1>

        <p className="mb-6 text-lg text-gray-600">
          스크롤 전환이 제공하는 다양한 기능들을 확인해보세요.
        </p>

        <div className="space-y-3">
          {[
            "방향 설정 (up/down)",
            "스프링 애니메이션 커스터마이징",
            "GPU 가속 지원",
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-500 p-2">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">더 알아보기</p>
              <p className="text-sm text-gray-600">
                왼쪽 메뉴를 클릭하여 다른 섹션으로 이동하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Usage Section Page
function UsagePage() {
  return (
    <DemoPage path="/usage" title="사용법">
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-6 text-4xl">🚀</div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">사용 방법</h1>

        <p className="mb-6 text-lg text-gray-600">
          간단한 설정으로 스크롤 전환을 적용할 수 있습니다.
        </p>

        <div className="space-y-3">
          {[
            "defaultTransition 설정",
            "경로별 커스터마이징",
            "symmetric 옵션 활용",
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-500 p-2">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">바로 적용하기</p>
              <p className="text-sm text-gray-600">
                왼쪽 메뉴를 클릭하여 다른 섹션으로 이동하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Examples Section Page
function ExamplesPage() {
  return (
    <DemoPage path="/examples" title="예시">
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-6 text-4xl">💡</div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          실제 사용 예시
        </h1>

        <p className="mb-6 text-lg text-gray-600">
          다양한 상황에서 스크롤 전환을 활용하는 방법입니다.
        </p>

        <div className="space-y-3">
          {[
            "목록 → 상세 페이지",
            "계층 구조 네비게이션",
            "모달 및 오버레이",
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-500 p-2">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">참고 자료</p>
              <p className="text-sm text-gray-600">
                왼쪽 메뉴를 클릭하여 다른 섹션으로 이동하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration with sidebar navigation
const scrollRoutes: RouteConfig[] = [
  { path: "/intro", component: IntroPage, label: "📝 소개" },
  { path: "/features", component: FeaturesPage, label: "✨ 기능" },
  { path: "/usage", component: UsagePage, label: "🚀 사용법" },
  { path: "/examples", component: ExamplesPage, label: "💡 예시" },
];

// Custom layout with sidebar navigation
function ScrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[500px] bg-white">
      {/* Left Navigation */}
      <nav className="w-48 border-r border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-500">목차</h3>
        <ul className="space-y-1">
          {scrollRoutes.map((route) => (
            <li key={route.path}>
              <DemoLink
                to={route.path}
                className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors block
                  text-gray-700 hover:bg-gray-100 underline-none
                  data-[active=true]:bg-blue-500 data-[active=true]:text-white"
              >
                {route.label}
              </DemoLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative z-0">{children}</div>
    </div>
  );
}

export function ScrollDemo() {
  // Create middleware to determine scroll direction based on route order
  const createScrollMiddleware = () => {
    const routeOrder = scrollRoutes.map((r) => r.path);

    return (from: string, to: string) => {
      const fromIndex = routeOrder.indexOf(from);
      const toIndex = routeOrder.indexOf(to);

      if (fromIndex !== -1 && toIndex !== -1) {
        if (fromIndex < toIndex) {
          // Going forward (down the list)
          return { from: "/nav/previous", to: "/nav/next" };
        } else {
          // Going backward (up the list)
          return { from: "/nav/next", to: "/nav/previous" };
        }
      }

      return { from, to };
    };
  };

  const config = {
    transitions: [
      {
        from: "/nav/previous",
        to: "/nav/next",
        transition: scroll({
          direction: "up",
        }),
      },
      {
        from: "/nav/next",
        to: "/nav/previous",
        transition: scroll({
          direction: "down",
        }),
      },
    ],
    middleware: createScrollMiddleware(),
  };

  return (
    <BrowserMockup
      routes={scrollRoutes}
      config={config}
      layout={ScrollLayout}
    />
  );
}
