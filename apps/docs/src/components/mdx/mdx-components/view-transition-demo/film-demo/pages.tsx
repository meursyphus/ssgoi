"use client";

import React, { useState } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { cn } from "../../../../../lib/utils";
import { useMobile } from "../../../../../lib/use-mobile";
import { useBrowserNavigation } from "../../browser-mockup";

// External image URLs from Unsplash
const images = {
  night:
    "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80",
  ocean:
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80",
  golden:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
};

// Route labels for menu
const routeLabels: Record<string, string> = {
  "/film": "COSMOS",
  "/film/scene-2": "DEPTHS",
  "/film/scene-3": "HEIGHTS",
};

// Menu component - inside each page
function FilmMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPath, navigate, routes } = useBrowserNavigation();
  const isMobile = useMobile();

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Menu Button - top left, large */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-50 flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
      >
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 6h16M4 12h16"
          />
        </svg>
      </button>

      {/* Fullscreen Menu Overlay - slide from left */}
      <div
        className={cn(
          "absolute inset-0 z-[100] bg-black flex flex-col items-start justify-center transition-transform duration-500 ease-out",
          isMobile ? "pl-6" : "pl-12",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Close Button - top left */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
        >
          <svg
            className="w-14 h-14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Navigation Links - left aligned, huge text */}
        <nav className="flex flex-col items-start gap-4">
          {routes.map((route) => {
            const isCurrent = route.path === currentPath;
            const label = routeLabels[route.path] || route.label;

            return (
              <button
                key={route.path}
                onClick={() => !isCurrent && handleNavigate(route.path)}
                disabled={isCurrent}
                className={cn(
                  "text-left transition-all duration-300 group",
                  isCurrent ? "cursor-default" : "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "font-bold tracking-tighter leading-none transition-colors duration-300",
                    isMobile ? "text-6xl" : "text-8xl",
                    isCurrent
                      ? "text-yellow-400"
                      : "text-white/40 group-hover:text-yellow-400",
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

// DemoPage wrapper with SsgoiTransition
interface DemoPageProps {
  children: React.ReactNode;
  className?: string;
  path: string;
}

export const DemoPage = React.memo(
  ({ children, className, path }: DemoPageProps) => {
    return (
      <SsgoiTransition
        id={path}
        className={cn("min-h-screen bg-black relative", className)}
      >
        {children}
        <FilmMenu />
      </SsgoiTransition>
    );
  },
);

DemoPage.displayName = "DemoPage";

// Scene 1: Night sky
export function Scene1Page() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/film" className="relative overflow-hidden">
      {/* Image background */}
      <div className="absolute inset-0">
        <img
          src={images.night}
          alt="Night sky"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen w-full flex items-end justify-center pb-16">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <h1
            className={cn(
              "font-extralight text-white tracking-tighter leading-none",
              isMobile ? "text-6xl" : "text-8xl",
            )}
          >
            COSMOS
          </h1>
          <p
            className={cn(
              "text-white/40 mt-4 font-light tracking-widest uppercase",
              isMobile ? "text-xs" : "text-sm",
            )}
          >
            A journey through space
          </p>
        </div>
      </div>
    </DemoPage>
  );
}

// Scene 2: Ocean
export function Scene2Page() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/film/scene-2" className="relative overflow-hidden">
      {/* Image background */}
      <div className="absolute inset-0">
        <img
          src={images.ocean}
          alt="Ocean"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <h1
            className={cn(
              "font-extralight text-white tracking-tighter leading-none",
              isMobile ? "text-6xl" : "text-8xl",
            )}
          >
            DEPTHS
          </h1>
          <p
            className={cn(
              "text-white/40 mt-4 font-light tracking-widest uppercase",
              isMobile ? "text-xs" : "text-sm",
            )}
          >
            Into the endless blue
          </p>

          {/* Minimal stats */}
          <div className="flex justify-center gap-12 mt-12">
            <div className="text-center">
              <p
                className={cn(
                  "text-white font-light",
                  isMobile ? "text-2xl" : "text-4xl",
                )}
              >
                71%
              </p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-1">
                Earth
              </p>
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "text-white font-light",
                  isMobile ? "text-2xl" : "text-4xl",
                )}
              >
                11km
              </p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-1">
                Deep
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Scene 3: Mountains / Golden
export function Scene3Page() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/film/scene-3" className="relative overflow-hidden">
      {/* Image background */}
      <div className="absolute inset-0">
        <img
          src={images.golden}
          alt="Mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen w-full flex items-end justify-center pb-16">
        <div className={cn("text-center", isMobile ? "px-6" : "px-12")}>
          <h1
            className={cn(
              "font-extralight text-white tracking-tighter leading-none",
              isMobile ? "text-6xl" : "text-8xl",
            )}
          >
            HEIGHTS
          </h1>
          <p
            className={cn(
              "text-white/40 mt-4 font-light tracking-widest uppercase",
              isMobile ? "text-xs" : "text-sm",
            )}
          >
            Above the clouds
          </p>
        </div>
      </div>
    </DemoPage>
  );
}
