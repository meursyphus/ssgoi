"use client";

import React, { memo } from "react";
import { jaemin } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Home Page - Tunnel Portal
function HomePage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/jaemin"
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
              TUNNEL EMERGENCE
            </span>
          </div>
          <h1
            className={cn(
              "font-bold text-white",
              isMobile ? "text-2xl" : "text-4xl sm:text-6xl",
            )}
          >
            Welcome to the{" "}
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Portal
            </span>
          </h1>
          <p
            className={cn(
              "text-gray-300 max-w-2xl mx-auto",
              isMobile ? "text-base" : "text-xl sm:text-2xl",
            )}
          >
            Experience dramatic tunnel emergence animation. Pages appear from a
            single point with 45° rotation and scaling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              Enter Portal
            </button>
            <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              View Animation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          <div className="bg-purple-800/30 p-6 rounded-lg backdrop-blur border border-purple-500/20">
            <div className="text-3xl mb-3">🌀</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              45° Rotation
            </h3>
            <p className="text-gray-400 text-sm">
              Optimized angle for maximum visual impact
            </p>
          </div>
          <div className="bg-purple-800/30 p-6 rounded-lg backdrop-blur border border-purple-500/20">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              3-Phase Timing
            </h3>
            <p className="text-gray-400 text-sm">
              Entry, Trans, and Emergence phases
            </p>
          </div>
          <div className="bg-purple-800/30 p-6 rounded-lg backdrop-blur border border-purple-500/20">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              100x Scale
            </h3>
            <p className="text-gray-400 text-sm">
              From 0.01 to 1.0 for dramatic effect
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Tech Page - Animation Details
function TechPage() {
  const isMobile = useMobile();

  const phases = [
    {
      name: "Entry Phase",
      range: "0-5%",
      icon: "🚀",
      description: "Page emerges from tiny dot with full rotation",
      color: "from-red-500 to-orange-500",
    },
    {
      name: "Trans Phase",
      range: "5-80%",
      icon: "📈",
      description: "Ultra-slow scaling with nonic easing curve",
      color: "from-orange-500 to-yellow-500",
    },
    {
      name: "Emergence Phase",
      range: "80-100%",
      icon: "✨",
      description: "Final expansion with rotation completion",
      color: "from-yellow-500 to-green-500",
    },
  ];

  return (
    <DemoPage
      path="/jaemin/tech"
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
            iMobile ? "text-2xl" : "text-4xl",
          )}
        >
          Animation Phases
        </h1>

        <div className="space-y-6">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{phase.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-white">
                      {phase.name}
                    </h2>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium">
                      {phase.range}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{phase.description}</p>
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${phase.color}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            🔧 Technical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded">
              <div className="text-sm text-gray-400 mb-1">Spring Physics</div>
              <div className="text-white font-mono">
                stiffness: 50, damping: 30
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded">
              <div className="text-sm text-gray-400 mb-1">Rotation Angle</div>
              <div className="text-white font-mono">45 degrees</div>
            </div>
            <div className="bg-gray-900 p-4 rounded">
              <div className="text-sm text-gray-400 mb-1">Scale Range</div>
              <div className="text-white font-mono">0.01 → 1.0</div>
            </div>
            <div className="bg-gray-900 p-4 rounded">
              <div className="text-sm text-gray-400 mb-1">Performance</div>
              <div className="text-white font-mono">60fps GPU accelerated</div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Performance Page - Complex Layout Test
function PerformancePage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/jaemin/performance"
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
          Performance Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-700"
            >
              <div
                className="h-32 flex items-center justify-center text-4xl"
                style={{
                  background: `linear-gradient(135deg, hsl(${i * 40 + 200}, 70%, 60%), hsl(${i * 40 + 260}, 70%, 60%))`,
                }}
              >
                🌌
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Complex Element {i + 1}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Testing transition performance with gradients, transforms, and
                  multiple visual effects.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {["CSS", "Transform", "Gradient", "Blur"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <div className="text-3xl mb-2">✅</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Performance Test Complete
            </h2>
            <p className="text-gray-300">
              Jaemin transition maintains 60fps even with complex layouts and
              multiple DOM elements.
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Usage Page - Code Examples
function UsagePage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/jaemin/usage"
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
          Usage Examples
        </h1>

        <div className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Basic Setup
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`import { jaemin } from '@ssgoi/react/view-transitions';

const config = {
  transitions: [
    {
      from: '/',
      to: '/portal',
      transition: jaemin(),
      symmetric: true  // Auto-reverse
    }
  ]
};`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Custom Spring Physics
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`import { jaemin } from '@ssgoi/react/view-transitions';

const config = {
  defaultTransition: jaemin({
    spring: {
      stiffness: 80,   // Faster transition
      damping: 25      // More bounce
    }
  })
};`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Best Use Cases
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✅</span>
                <div>
                  <div className="text-white font-medium">Onboarding flows</div>
                  <div className="text-gray-400 text-sm">
                    Create dramatic "stepping into" experience
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✅</span>
                <div>
                  <div className="text-white font-medium">Feature reveals</div>
                  <div className="text-gray-400 text-sm">
                    Unveil new sections with tunnel effect
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✅</span>
                <div>
                  <div className="text-white font-medium">
                    Portal-like navigation
                  </div>
                  <div className="text-gray-400 text-sm">
                    Transport users to different spaces
                  </div>
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
  { path: "/jaemin", component: HomePage, label: "Portal" },
  { path: "/jaemin/tech", component: TechPage, label: "Tech" },
  {
    path: "/jaemin/performance",
    component: PerformancePage,
    label: "Performance",
  },
  { path: "/jaemin/usage", component: UsagePage, label: "Usage" },
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
    </>
  );
}

export function JaeminDemo() {
  const config = {
    defaultTransition: jaemin(),
  };

  // Custom layout with Jaemin branding
  function JaeminLayout({ children }: { children: React.ReactNode }) {
    return (
      <DemoLayout
        logo="🌀"
        title="Jaemin Portal"
        headerActions={<HeaderActions />}
      >
        {children}
      </DemoLayout>
    );
  }

  return (
    <BrowserMockup
      routes={jaeminRoutes}
      config={config}
      layout={JaeminLayout}
    />
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
    logo = "🌀",
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
                          ? "bg-purple-600 text-white"
                          : "text-gray-300 hover:bg-purple-700 hover:text-white",
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
