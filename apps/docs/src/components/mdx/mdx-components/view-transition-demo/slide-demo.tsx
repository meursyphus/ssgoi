"use client";

import React from "react";
import { slide } from "@ssgoi/react/view-transitions";
import { motion } from "framer-motion";
import {
  BrowserMockup,
  DemoPage,
  useBrowserNavigation,
} from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Tab content pages
function ForYouPage() {
  return (
    <DemoPage path="/slide/foryou">
      <div className="h-full bg-[#0a0a0a] p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 flex gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-neutral-100 text-sm font-medium">
                Recommended #{i}
              </p>
              <p className="text-neutral-500 text-xs mt-1 line-clamp-2">
                Content curated just for you based on your interests
              </p>
            </div>
          </div>
        ))}
      </div>
    </DemoPage>
  );
}

function TrendingPage() {
  return (
    <DemoPage path="/slide/trending">
      <div className="h-full bg-[#0a0a0a] p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm flex-shrink-0">
              #{i}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-neutral-100 text-sm font-medium">
                Trending Topic {i}
              </p>
              <p className="text-neutral-500 text-xs mt-1">12.{i}K posts</p>
            </div>
          </div>
        ))}
      </div>
    </DemoPage>
  );
}

function FollowingPage() {
  return (
    <DemoPage path="/slide/following">
      <div className="h-full bg-[#0a0a0a] p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-neutral-100 text-sm font-medium">User {i}</p>
              <p className="text-neutral-500 text-xs mt-1 line-clamp-2">
                Latest update from someone you follow
              </p>
            </div>
          </div>
        ))}
      </div>
    </DemoPage>
  );
}

// Tab navigation layout
function TabLayout({ children }: { children: React.ReactNode }) {
  const { currentPath, navigate } = useBrowserNavigation();

  const tabs = [
    { path: "/slide/foryou", label: "For You" },
    { path: "/slide/trending", label: "Trending" },
    { path: "/slide/following", label: "Following" },
  ];

  return (
    <div className="h-full bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-neutral-100 text-lg font-semibold text-center">
          Feed
        </h1>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-white/10">
        <nav className="flex">
          {tabs.map((tab) => {
            const isActive = currentPath === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex-1 relative py-3"
              >
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-neutral-100" : "text-neutral-500"
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-white rounded-full"
                    layoutId="slideTabIndicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </div>
  );
}

// Routes
const slideRoutes: RouteConfig[] = [
  { path: "/slide/foryou", component: ForYouPage, label: "For You" },
  { path: "/slide/trending", component: TrendingPage, label: "Trending" },
  { path: "/slide/following", component: FollowingPage, label: "Following" },
];

export function SlideDemo() {
  const routeOrder = slideRoutes.map((r) => r.path);

  const middleware = (from: string, to: string) => {
    const fromIndex = routeOrder.indexOf(from);
    const toIndex = routeOrder.indexOf(to);

    if (fromIndex !== -1 && toIndex !== -1) {
      if (fromIndex < toIndex) {
        return { from: "/nav/left", to: "/nav/right" };
      } else {
        return { from: "/nav/right", to: "/nav/left" };
      }
    }
    return { from, to };
  };

  const config = {
    transitions: [
      {
        from: "/nav/left",
        to: "/nav/right",
        transition: slide({ direction: "left" }),
      },
      {
        from: "/nav/right",
        to: "/nav/left",
        transition: slide({ direction: "right" }),
      },
    ],
    middleware,
  };

  return (
    <BrowserMockup
      routes={slideRoutes}
      config={config}
      layout={TabLayout}
      deviceType="mobile"
    />
  );
}
