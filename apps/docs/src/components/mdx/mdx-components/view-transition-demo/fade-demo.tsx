"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { fade } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Image data
const images = {
  mountain: "/images/john-towner-JgOeRuGD_Y4-unsplash.jpg",
  ocean: "/images/jeremy-bishop-8xznAGy4HcY-unsplash.jpg",
  storm: "/images/stormseeker-rX12B5uX7QM-unsplash.jpg",
  golden: "/images/rosie-sun-1L71sPT5XKc-unsplash.jpg",
  forest: "/images/clay-banks-u27Rrbs9Dwc-unsplash.jpg",
  road: "/images/karsten-wurth-7BjhtdogU3A-unsplash.jpg",
};

// Page 1: Hero with mountain
function HeroPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/fade" className="relative h-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0">
        <Image
          src={images.mountain}
          alt="Mountain landscape"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content - centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-4">
            Explore the world
          </p>
          <h1
            className={cn(
              "font-light text-white leading-[0.9] tracking-tight",
              isMobile ? "text-4xl" : "text-6xl",
            )}
          >
            Into the
            <br />
            <span className="font-semibold">Wild</span>
          </h1>
          <p
            className={cn(
              "text-white/70 mt-6 max-w-md mx-auto leading-relaxed",
              isMobile ? "text-sm" : "text-base",
            )}
          >
            Discover breathtaking landscapes and unforgettable adventures.
          </p>
        </div>
      </div>
    </DemoPage>
  );
}

// Page 2: Ocean waves
function OceanPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/fade/ocean" className="relative h-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0">
        <Image
          src={images.ocean}
          alt="Ocean waves"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Content - centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-4">
            Feel the rhythm
          </p>
          <h1
            className={cn(
              "font-light text-white leading-[0.9] tracking-tight",
              isMobile ? "text-4xl" : "text-6xl",
            )}
          >
            Endless
            <br />
            <span className="font-semibold">Ocean</span>
          </h1>
          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                Depth
              </p>
              <p className="text-white text-2xl font-light">3.7km</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                Temperature
              </p>
              <p className="text-white text-2xl font-light">18°C</p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Page 3: Forest path
function ForestPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/fade/forest" className="relative h-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0">
        <Image
          src={images.forest}
          alt="Forest path"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content - centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-4">
            Find your path
          </p>
          <h1
            className={cn(
              "font-light text-white leading-[0.9] tracking-tight",
              isMobile ? "text-4xl" : "text-6xl",
            )}
          >
            Through
            <br />
            <span className="font-semibold">Nature</span>
          </h1>
          <p className="text-white/50 text-sm mt-8">Click to explore</p>
        </div>
      </div>
    </DemoPage>
  );
}

// Page 4: Road trip
function RoadPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/fade/road" className="relative h-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0">
        <Image
          src={images.road}
          alt="Open road"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - center */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="p-6">
          <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-4">
            The journey begins
          </p>
          <h1
            className={cn(
              "font-light text-white leading-[0.9] tracking-tight",
              isMobile ? "text-4xl" : "text-7xl",
            )}
          >
            Open
            <br />
            <span className="font-semibold">Road</span>
          </h1>
          <p
            className={cn(
              "text-white/60 mt-8 max-w-sm mx-auto",
              isMobile ? "text-sm" : "text-base",
            )}
          >
            Every mile tells a story. Every horizon holds a promise.
          </p>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const fadeRoutes: RouteConfig[] = [
  { path: "/fade", component: HeroPage, label: "Mountain" },
  { path: "/fade/ocean", component: OceanPage, label: "Ocean" },
  { path: "/fade/forest", component: ForestPage, label: "Forest" },
  { path: "/fade/road", component: RoadPage, label: "Road" },
];

// Transparent text-only header - NOT absolute, flows with content
const MinimalLayout = memo(({ children }: { children: React.ReactNode }) => {
  const context = React.useContext(BrowserContext);
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!context) return <>{children}</>;

  const { currentPath, navigate, routes } = context;

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header - in flow, not absolute */}
      <header
        className={cn(
          "flex-shrink-0 relative z-20",
          isMobile ? "px-3 py-2" : "px-6 py-4",
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <span
            className={cn(
              "text-white/90 font-medium tracking-[0.2em] uppercase",
              isMobile ? "text-[10px]" : "text-xs",
            )}
          >
            Voyage
          </span>

          {/* Text Navigation - hidden on mobile */}
          {!isMobile && (
            <nav className="flex items-center gap-6">
              {routes.map((route) => (
                <button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  className={cn(
                    "text-xs tracking-wide transition-all duration-300",
                    currentPath === route.path
                      ? "text-white"
                      : "text-white/40 hover:text-white/70",
                  )}
                >
                  {route.label}
                </button>
              ))}
            </nav>
          )}

          {/* Mobile: dot navigation */}
          {isMobile && (
            <div className="flex items-center gap-1.5">
              {routes.map((route) => (
                <button
                  key={route.path}
                  onClick={() => handleNavigate(route.path)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    currentPath === route.path ? "bg-white" : "bg-white/30",
                  )}
                />
              ))}
            </div>
          )}

          {/* Menu icon */}
          <button
            onClick={() => isMobile && setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/50 hover:text-white/80 transition-colors"
          >
            <svg
              className={cn(isMobile ? "w-3.5 h-3.5" : "w-4 h-4")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobile && mobileMenuOpen && (
          <nav className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 py-2">
            {routes.map((route) => (
              <button
                key={route.path}
                onClick={() => handleNavigate(route.path)}
                className={cn(
                  "w-full text-left px-4 py-2 text-xs transition-colors",
                  currentPath === route.path
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5",
                )}
              >
                {route.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative z-0">{children}</main>
    </div>
  );
});

MinimalLayout.displayName = "MinimalLayout";

export function FadeDemo() {
  const config = {
    defaultTransition: fade({ duration: 800 }),
  };

  return (
    <BrowserMockup
      routes={fadeRoutes}
      config={config}
      layout={MinimalLayout}
      initialPath="/fade"
    />
  );
}
