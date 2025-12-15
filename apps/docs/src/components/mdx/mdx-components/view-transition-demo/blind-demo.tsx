"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { blind } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Image data - cinematic theme
const images = {
  theater: "/images/john-towner-JgOeRuGD_Y4-unsplash.jpg",
  drama: "/images/jeremy-bishop-8xznAGy4HcY-unsplash.jpg",
  mystery: "/images/stormseeker-rX12B5uX7QM-unsplash.jpg",
  finale: "/images/rosie-sun-1L71sPT5XKc-unsplash.jpg",
};

// Opening Scene
function OpeningPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/blind" className="relative h-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0">
        <Image
          src={images.theater}
          alt="Theater scene"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
      </div>

      {/* Content - centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-4">
            The curtain rises
          </p>
          <h1
            className={cn(
              "font-light text-white leading-[0.9] tracking-tight",
              isMobile ? "text-4xl" : "text-6xl",
            )}
          >
            Blind
            <br />
            <span className="font-semibold">Transition</span>
          </h1>
          <p
            className={cn(
              "text-white/60 mt-6 max-w-md mx-auto leading-relaxed",
              isMobile ? "text-sm" : "text-base",
            )}
          >
            Like theater blinds revealing a new scene
          </p>
        </div>
      </div>
    </DemoPage>
  );
}

// Act I - The Drama
function Act1Page() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/blind/act1" className="relative h-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0">
        <Image
          src={images.drama}
          alt="Dramatic scene"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
      </div>

      {/* Content - centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-4">
            Act I
          </p>
          <h1
            className={cn(
              "font-light text-white leading-[0.9] tracking-tight",
              isMobile ? "text-4xl" : "text-6xl",
            )}
          >
            The
            <br />
            <span className="font-semibold">Drama</span>
          </h1>
          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                Strips
              </p>
              <p className="text-white text-2xl font-light">10</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                Direction
              </p>
              <p className="text-white text-2xl font-light">Horizontal</p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Act II - The Mystery
function Act2Page() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/blind/act2" className="relative h-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0">
        <Image
          src={images.mystery}
          alt="Mysterious scene"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content - centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-4">
            Act II
          </p>
          <h1
            className={cn(
              "font-light text-white leading-[0.9] tracking-tight",
              isMobile ? "text-4xl" : "text-6xl",
            )}
          >
            The
            <br />
            <span className="font-semibold">Mystery</span>
          </h1>
          <p className="text-white/50 text-sm mt-8">
            Tension builds with each strip
          </p>
        </div>
      </div>
    </DemoPage>
  );
}

// Finale
function FinalePage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/blind/finale" className="relative h-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0">
        <Image
          src={images.finale}
          alt="Grand finale"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content - center */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="p-6">
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-4">
            The grand finale
          </p>
          <h1
            className={cn(
              "font-light text-white leading-[0.9] tracking-tight",
              isMobile ? "text-4xl" : "text-7xl",
            )}
          >
            Standing
            <br />
            <span className="font-semibold">Ovation</span>
          </h1>
          <p
            className={cn(
              "text-white/60 mt-8 max-w-sm mx-auto",
              isMobile ? "text-sm" : "text-base",
            )}
          >
            Every transition tells a story. Every reveal holds magic.
          </p>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const blindRoutes: RouteConfig[] = [
  { path: "/blind", component: OpeningPage, label: "Opening" },
  { path: "/blind/act1", component: Act1Page, label: "Act I" },
  { path: "/blind/act2", component: Act2Page, label: "Act II" },
  { path: "/blind/finale", component: FinalePage, label: "Finale" },
];

// Transparent text-only header - NOT absolute, flows with content
const TheaterLayout = memo(({ children }: { children: React.ReactNode }) => {
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
            Theater
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

TheaterLayout.displayName = "TheaterLayout";

export function BlindDemo() {
  const config = {
    defaultTransition: blind({
      blindCount: 10,
      inSpring: { stiffness: 200, damping: 20 },
      outSpring: { stiffness: 200, damping: 20 },
      direction: "horizontal",
      blindColor: "#000",
    }),
  };

  return (
    <BrowserMockup
      routes={blindRoutes}
      config={config}
      layout={TheaterLayout}
      initialPath="/blind"
    />
  );
}
