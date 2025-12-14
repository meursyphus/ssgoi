"use client";

import React, { memo } from "react";
import { strip } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Page 1 - Bold Typography
function SpeakingPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/strip" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto flex flex-col justify-center min-h-full",
          isMobile ? "px-6 py-12" : "max-w-6xl px-8 py-20",
        )}
      >
        <div className="space-y-6">
          <h1
            className={cn(
              "font-light leading-none",
              isMobile ? "text-5xl" : "text-[8rem]",
              "text-neutral-100 tracking-tight",
            )}
          >
            SPEAKING
          </h1>
          <p
            className={cn(
              "text-neutral-400",
              isMobile ? "text-sm max-w-sm" : "text-base max-w-2xl",
            )}
          >
            Transform your ideas into powerful narratives that captivate and
            inspire.
          </p>
          <div className="flex gap-3 pt-4">
            <button className="px-5 py-2.5 bg-white text-neutral-900 text-sm rounded-full hover:bg-neutral-200 transition-colors">
              Start Now
            </button>
            <button className="px-5 py-2.5 bg-white/5 text-neutral-300 text-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Page 2 - Creative Layout
function CreatingPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/strip/creating" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto flex items-center justify-center min-h-full",
          isMobile ? "px-6 py-12" : "px-8 py-20",
        )}
      >
        <div className="text-center space-y-10">
          <div className="relative">
            <h1
              className={cn(
                "font-light",
                isMobile ? "text-5xl" : "text-[8rem]",
                "text-neutral-100",
                "tracking-tight leading-none",
              )}
            >
              CREATING
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-neutral-400 text-xs">Innovate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-neutral-400 text-xs">Execute</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <p className="text-neutral-400 text-xs">Launch</p>
            </div>
          </div>

          <p
            className={cn(
              "text-neutral-400 max-w-xl mx-auto",
              isMobile ? "text-sm" : "text-base",
            )}
          >
            Where imagination meets execution. Build something extraordinary
            today.
          </p>
        </div>
      </div>
    </DemoPage>
  );
}

// Page 3 - Minimal Impact
function ImpactPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/strip/impact" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto flex flex-col justify-center min-h-full relative",
          isMobile ? "px-6 py-12" : "px-8 py-20",
        )}
      >
        <div className="space-y-12">
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-4">
              Make a Difference
            </p>
            <h1
              className={cn(
                "font-light",
                isMobile ? "text-5xl" : "text-[7rem]",
                "text-neutral-100 leading-none tracking-tight",
              )}
            >
              IMPACT
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l border-white/20 pl-5">
              <h3 className="text-neutral-100 font-medium text-xl mb-1">
                100M+
              </h3>
              <p className="text-neutral-500 text-xs">Lives Changed</p>
            </div>
            <div className="border-l border-white/20 pl-5">
              <h3 className="text-neutral-100 font-medium text-xl mb-1">50+</h3>
              <p className="text-neutral-500 text-xs">Countries Reached</p>
            </div>
            <div className="border-l border-white/20 pl-5">
              <h3 className="text-neutral-100 font-medium text-xl mb-1">∞</h3>
              <p className="text-neutral-500 text-xs">Possibilities</p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const stripRoutes: RouteConfig[] = [
  { path: "/strip", component: SpeakingPage, label: "Speaking" },
  { path: "/strip/creating", component: CreatingPage, label: "Creating" },
  { path: "/strip/impact", component: ImpactPage, label: "Impact" },
];

// Custom Layout Component
const StripLayout = memo(({ children }: { children: React.ReactNode }) => {
  const context = React.useContext(BrowserContext);
  const isMobile = useMobile();

  if (!context) return <>{children}</>;

  const { currentPath, navigate, routes } = context;

  return (
    <div className="flex flex-col h-full relative bg-[#121212]">
      {/* Fixed Header */}
      <header className="sticky top-0 z-30 bg-[#121212]/90 backdrop-blur-sm border-b border-white/5">
        <div className={cn("mx-auto", isMobile ? "px-4" : "max-w-7xl px-8")}>
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <button
                onClick={() => navigate(routes[0].path)}
                className="font-medium text-base text-neutral-200 hover:text-white transition-colors"
              >
                CYD
              </button>

              {/* Navigation */}
              {!isMobile && (
                <nav className="flex items-center gap-4">
                  {routes.map((route) => {
                    const isActive = currentPath === route.path;
                    return (
                      <button
                        key={route.path}
                        onClick={() => navigate(route.path)}
                        className={cn(
                          "text-xs uppercase tracking-wider transition-all",
                          isActive
                            ? "text-neutral-100"
                            : "text-neutral-500 hover:text-neutral-300",
                        )}
                      >
                        {route.label}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Mobile menu button */}
            {isMobile && (
              <button className="text-neutral-400 hover:text-neutral-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-scroll overflow-x-hidden relative z-0">
        {children}
      </main>
    </div>
  );
});

StripLayout.displayName = "StripLayout";

export function StripDemo() {
  const config = {
    defaultTransition: strip(),
  };

  return (
    <BrowserMockup routes={stripRoutes} config={config} layout={StripLayout} />
  );
}
