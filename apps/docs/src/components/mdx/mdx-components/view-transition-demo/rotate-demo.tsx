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
            "absolute z-[60] flex items-center rounded-full",
            "backdrop-blur-xl bg-black/40 border border-yellow-600/30",
            "text-yellow-600/80 hover:text-yellow-500 hover:border-yellow-500/50 transition-all",
            "uppercase font-light",
            isMobile
              ? "top-2 right-2 gap-2 px-2.5 py-1.5 text-[10px] tracking-[0.15em]"
              : "top-4 right-4 gap-3 px-4 py-2 text-xs tracking-[0.2em]",
          )}
        >
          <span>{isMenuOpen ? "Close" : "Menu"}</span>
          <span
            className={cn(
              "rounded-full transition-colors",
              isMenuOpen ? "bg-yellow-500" : "bg-yellow-600/60",
              isMobile ? "w-1.5 h-1.5" : "w-2 h-2",
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
            className={cn(
              "absolute inset-0 z-50 flex items-center justify-center pointer-events-none",
              isMobile ? "-top-[50px]" : "-top-[100px]",
            )}
          >
            <nav
              className={cn(
                "flex flex-col pointer-events-auto",
                isMobile ? "gap-1 px-4" : "gap-2 px-12",
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
                      "group flex items-baseline text-left transition-colors",
                      isActive
                        ? "text-yellow-500 cursor-default"
                        : "text-white hover:text-yellow-500 cursor-pointer",
                      isMobile ? "gap-3" : "gap-6",
                    )}
                  >
                    <span
                      className={cn(
                        "font-bold transition-colors",
                        isActive
                          ? "text-yellow-600/70"
                          : "text-white group-hover:text-yellow-600/70",
                        isMobile ? "text-xs" : "text-xl",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-light tracking-tight",
                        isMobile ? "text-3xl" : "text-8xl",
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
