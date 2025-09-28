"use client";

import React, { memo } from "react";
import { dimm } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Page 1 - Bold Typography
function SpeakingPage() {
  const isMobile = useMobile();

  const context = React.useContext(BrowserContext);
  if (!context) return null;

  const { navigate } = context;
  return (
    <DemoPage path="/dimm" className="min-h-full">
      <div
        className={cn(
          "mx-auto flex flex-col justify-center min-h-full",
          isMobile ? "px-6 py-12" : "max-w-6xl px-8 py-20",
        )}
      >
        <div className="space-y-8">
          <h1
            className={cn(
              "font-black leading-none",
              isMobile ? "text-6xl" : "text-[10rem]",
              "text-orange-500 tracking-tight",
            )}
          >
            SPEAKING
          </h1>
          <p
            className={cn(
              "font-medium text-gray-700",
              isMobile ? "text-lg max-w-sm" : "text-2xl max-w-2xl",
            )}
          >
            Transform your ideas into powerful narratives that captivate and
            inspire.
          </p>
          <div className="flex gap-4 pt-4">
            <button
              className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
              onClick={() => navigate("/dimm/creating")}
            >
              Start Now
            </button>
            <button
              className="px-6 py-3 bg-white text-orange-500 border-2 border-orange-500 rounded-full font-semibold hover:bg-orange-50 transition-colors"
              onClick={() => navigate("/dimm/impact")}
            >
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
  const context = React.useContext(BrowserContext);
  if (!context) return null;

  const { navigate } = context;

  return (
    <DemoPage path="/dimm/creating" className="min-h-full">
      <div
        className={cn(
          "mx-auto flex items-center justify-center min-h-full",
          isMobile ? "px-6 py-12" : "px-8 py-20",
        )}
      >
        <div className="text-center space-y-12">
          <div className="relative">
            <h1
              className={cn(
                "font-black",
                isMobile ? "text-5xl" : "text-[8rem]",
                "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600",
                "tracking-tight leading-none",
              )}
            >
              CREATING
            </h1>
            <div
              className={cn(
                "font-black absolute inset-0 blur-3xl opacity-30",
                isMobile ? "text-5xl" : "text-[8rem]",
                "text-purple-600",
                "tracking-tight leading-none",
              )}
            >
              CREATING
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-gray-700 font-medium">Innovate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-gray-700 font-medium">Execute</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <p className="text-gray-700 font-medium">Launch</p>
            </div>
          </div>

          <p
            className={cn(
              "font-medium text-gray-700 max-w-xl mx-auto",
              isMobile ? "text-base" : "text-xl",
            )}
          >
            Where imagination meets execution. Build something extraordinary
            today.
          </p>
          <div className="flex gap-4 pt-4">
            <button
              className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
              onClick={() => navigate("/dimm")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Page 3 - Minimal Impact
function ImpactPage() {
  const isMobile = useMobile();

  const context = React.useContext(BrowserContext);
  if (!context) return null;

  const { navigate } = context;

  return (
    <DemoPage path="/dimm/impact" className="min-h-full">
      <div
        className={cn(
          "mx-auto flex flex-col justify-center min-h-full relative",
          isMobile ? "px-6 py-12" : "px-8 py-20",
        )}
      >
        <div className="space-y-16">
          <div>
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4">
              Make a Difference
            </p>
            <h1
              className={cn(
                "font-black",
                isMobile ? "text-5xl" : "text-[7rem]",
                "text-gray-900 leading-none tracking-tight",
              )}
            >
              IMPACT
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-gray-900 font-bold text-2xl mb-2">100M+</h3>
              <p className="text-gray-600">Lives Changed</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-gray-900 font-bold text-2xl mb-2">50+</h3>
              <p className="text-gray-600">Countries Reached</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-gray-900 font-bold text-2xl mb-2">∞</h3>
              <p className="text-gray-600">Possibilities</p>
            </div>
          </div>

          <div
            className={cn(
              "absolute bottom-8 right-8",
              isMobile ? "hidden" : "block",
            )}
          >
            <div className="w-32 h-32 rounded-full bg-orange-400 opacity-20 blur-3xl"></div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
            onClick={() => navigate("/dimm")}
          >
            Back
          </button>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const dimmRoutes: RouteConfig[] = [
  { path: "/dimm", component: SpeakingPage, label: "Speaking" },
  { path: "/dimm/creating", component: CreatingPage, label: "Creating" },
  { path: "/dimm/impact", component: ImpactPage, label: "Impact" },
];

// Custom Layout Component
const DimmLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full relative bg-gradient-to-br from-orange-50 to-pink-50">
      <main className="flex-1 overflow-y-scroll overflow-x-hidden relative z-0">
        {children}
      </main>
    </div>
  );
};

DimmLayout.displayName = "DimmLayout";

export function DimmDemo() {
  const config = {
    defaultTransition: dimm(),
  };

  return (
    <BrowserMockup routes={dimmRoutes} config={config} layout={DimmLayout} />
  );
}
