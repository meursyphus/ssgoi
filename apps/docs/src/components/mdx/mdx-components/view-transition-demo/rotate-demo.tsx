"use client";

import React, { memo, useState } from "react";
import { rotate } from "@ssgoi/react/view-transitions";
import { transition } from "@ssgoi/react";
import { fade, fly } from "@ssgoi/react/transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { useMobile } from "@/lib/use-mobile";
import { cn } from "@/lib/utils";

// Diagonal background component - sized to cover viewport during rotation
// 150% of parent width with 1:1 aspect ratio = square larger than diagonal (√2 ≈ 1.42)
function DiagonalBackground({
  src,
  overlay,
}: {
  src: string;
  overlay?: React.ReactNode;
}) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: "150%",
        aspectRatio: "1/1",
      }}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay}
    </div>
  );
}

// Home Page - Empty road
function HomePage() {
  return (
    <DemoPage path="/rotate" className="h-full relative">
      <DiagonalBackground src="/images/asya-IkiQcIEFObg-unsplash.jpg" />
    </DemoPage>
  );
}

// About Page - Dark building
function AboutPage() {
  return (
    <DemoPage path="/rotate/about" className="h-full relative">
      <DiagonalBackground src="/images/ryan-lum-1ak3Z7ZmtQA-unsplash.jpg" />
    </DemoPage>
  );
}

// Route configuration
const rotateRoutes: RouteConfig[] = [
  { path: "/rotate", component: HomePage, label: "The Beginning" },
  { path: "/rotate/about", component: AboutPage, label: "Into the Void" },
];

// Fullscreen Menu Layout
const FullscreenMenuLayout = memo(
  ({ children }: { children: React.ReactNode }) => {
    const context = React.useContext(BrowserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const isMobile = useMobile();

    if (!context) return <>{children}</>;

    const { currentPath, navigate, routes } = context;

    const handleNavigate = (path: string) => {
      setIsMenuOpen(false);
      // Small delay to let fade out start before navigation
      setTimeout(() => navigate(path), 100);
    };

    return (
      <div className="relative h-full">
        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "absolute top-4 right-4 z-[60] flex items-center gap-3 px-4 py-2",
            "backdrop-blur-xl bg-black/40 border border-yellow-600/30 rounded-full",
            "text-yellow-600/80 hover:text-yellow-500 hover:border-yellow-500/50 transition-all",
            "text-xs tracking-[0.2em] uppercase font-light",
          )}
        >
          <span>{isMenuOpen ? "Close" : "Menu"}</span>
          <span
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              isMenuOpen ? "bg-yellow-500" : "bg-yellow-600/60",
            )}
          />
        </button>

        {/* Fullscreen Menu - Text Only, No Overlay */}
        {isMenuOpen && (
          <div
            ref={transition(
              fly({
                key: "menu",
                spring: { stiffness: 100, damping: 30 },
                y: -30,
              }),
            )}
            className="absolute -top-[100px] inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <nav
              className={cn(
                "flex flex-col gap-2 pointer-events-auto",
                isMobile ? "px-6" : "px-12",
              )}
            >
              {routes.map((route, index) => {
                const isActive = currentPath === route.path;
                return (
                  <button
                    key={route.path}
                    onClick={() => !isActive && handleNavigate(route.path)}
                    disabled={isActive}
                    className={cn(
                      "group flex items-baseline gap-6 text-left transition-colors",
                      isActive
                        ? "text-yellow-500 cursor-default"
                        : "text-white hover:text-yellow-500 cursor-pointer",
                    )}
                  >
                    <span
                      className={cn(
                        "font-bold transition-colors",
                        isActive
                          ? "text-yellow-600/70"
                          : "text-white group-hover:text-yellow-600/70",
                        isMobile ? "text-base" : "text-xl",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-light tracking-tight",
                        isMobile ? "text-6xl" : "text-8xl",
                      )}
                    >
                      {route.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    );
  },
);

FullscreenMenuLayout.displayName = "FullscreenMenuLayout";

export function RotateDemo() {
  const config = {
    defaultTransition: rotate(),
  };

  return (
    <BrowserMockup
      routes={rotateRoutes}
      config={config}
      layout={FullscreenMenuLayout}
    />
  );
}
