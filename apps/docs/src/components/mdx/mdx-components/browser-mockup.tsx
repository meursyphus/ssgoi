"use client";

import React, { ReactNode, useState, useEffect, useRef, memo } from "react";
import { cn } from "../../../lib/utils";
import { Ssgoi } from "@ssgoi/react";
import type { SsgoiConfig } from "@ssgoi/react";

// Route configuration
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  label?: string;
  props?: Record<string, any>;
}

// Browser mockup props
export interface BrowserMockupProps {
  routes: RouteConfig[];
  config: SsgoiConfig;
  initialPath?: string;
  className?: string;
  showNavigation?: boolean;
  navigationPosition?: "top" | "bottom";
  onNavigate?: (path: string) => void;
}

// Browser context for nested components
interface BrowserContext {
  currentPath: string;
  navigate: (path: string) => void;
  routes: RouteConfig[];
}

const BrowserContext = React.createContext<BrowserContext | null>(null);

export function useBrowserNavigation() {
  const context = React.useContext(BrowserContext);
  if (!context) {
    throw new Error("useBrowserNavigation must be used within BrowserMockup");
  }
  return context;
}

// Navigation button component
interface NavigationButtonProps {
  route: RouteConfig;
}

const NavigationButton = memo(({ route }: NavigationButtonProps) => {
  const { currentPath, navigate } = useBrowserNavigation();
  const isActive = currentPath === route.path;

  return (
    <button
      onClick={() => navigate(route.path)}
      disabled={isActive}
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
        isActive
          ? "bg-blue-500 text-white"
          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
      )}
    >
      {route.label || route.path}
    </button>
  );
});

NavigationButton.displayName = "NavigationButton";

// Navigation component
const Navigation = memo(() => {
  const { routes } = useBrowserNavigation();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {routes.map((route) => (
        <NavigationButton key={route.path} route={route} />
      ))}
    </div>
  );
});

Navigation.displayName = "Navigation";

// Browser header component
const BrowserHeader = memo(() => {
  const { currentPath } = useBrowserNavigation();

  return (
    <div className="browser-header bg-gray-200 dark:bg-gray-800 px-4 py-3 flex items-center gap-3">
      {/* Traffic lights */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>

      {/* Address bar */}
      <div className="flex-1 flex items-center">
        <div className="flex-1 max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-gray-500 dark:text-gray-400">
              localhost:3000
            </span>
            <span className="text-gray-700 dark:text-gray-200">
              {currentPath}
            </span>
          </div>
        </div>
      </div>

      {/* Browser actions */}
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded">
          <svg
            className="w-4 h-4 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});

BrowserHeader.displayName = "BrowserHeader";

// Route content component
interface RouteContentProps {
  route: RouteConfig | undefined;
}

const RouteContent = memo(({ route }: RouteContentProps) => {
  if (!route) return null;
  const Component = route.component;
  return <Component {...(route.props || {})} />;
});

RouteContent.displayName = "RouteContent";

export function BrowserMockup({
  routes,
  config,
  initialPath,
  className,
  showNavigation = true,
  navigationPosition = "bottom",
  onNavigate,
}: BrowserMockupProps) {
  const [currentPath, setCurrentPath] = useState(
    initialPath || routes[0]?.path || "/"
  );

  const contentRef = useRef<HTMLDivElement>(null);

  // Handle navigation
  const navigate = (path: string) => {
    if (path === currentPath) return;

    setCurrentPath(path);
    onNavigate?.(path);
  };

  // Find current route
  const currentRoute =
    routes.find((route) => route.path === currentPath) || routes[0];

  return (
    <BrowserContext.Provider value={{ currentPath, navigate, routes }}>
      <div
        className={cn(
          "browser-mockup w-full rounded-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700",
          "aspect-[9/16] sm:aspect-[16/10]", // Mobile: 9:16, Desktop: 16:10
          className
        )}
      >
        {/* Browser Header */}
        <BrowserHeader />

        {/* Top navigation */}
        {showNavigation && navigationPosition === "top" && <Navigation />}

        {/* Browser Content */}
        <div
          ref={contentRef}
          className="browser-content relative z-0 bg-white dark:bg-gray-900 flex-1 overflow-auto h-full"
        >
          <Ssgoi config={config}>
            <RouteContent route={currentRoute} />
          </Ssgoi>
        </div>

        {/* Bottom navigation */}
        {showNavigation && navigationPosition === "bottom" && <Navigation />}
      </div>
    </BrowserContext.Provider>
  );
}

// Helper component for creating simple demo pages
export interface DemoPageProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const DemoPage = memo(({ title, children, className }: DemoPageProps) => {
  return (
    <div className={cn("min-h-full p-8", className)}>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {children}
    </div>
  );
});

DemoPage.displayName = "DemoPage";

// Helper component for navigation links within demo pages
export interface DemoLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  [key: string]: any; // For data-* attributes
}

export const DemoLink = memo(({ to, children, className, ...props }: DemoLinkProps) => {
  const { navigate } = useBrowserNavigation();

  return (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "text-blue-500 hover:text-blue-600 underline cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

DemoLink.displayName = "DemoLink";

// Helper component for demo cards
export interface DemoCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: any; // For data-* attributes
}

export const DemoCard = memo(({
  children,
  onClick,
  className,
  ...props
}: DemoCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border border-gray-200 dark:border-gray-700 rounded-lg",
        "hover:shadow-lg transition-shadow cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

DemoCard.displayName = "DemoCard";
