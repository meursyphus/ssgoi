/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useState, useEffect, useRef, memo } from "react";
import { cn } from "../../../lib/utils";
import { Ssgoi, SsgoiTransition } from "@ssgoi/react";
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
  onNavigate?: (path: string) => void;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
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

export { BrowserContext };

// Browser header component - ultra thin
const BrowserHeader = memo(() => {
  const { currentPath } = useBrowserNavigation();

  return (
    <div className="browser-header bg-neutral-900/80 border-b border-white/5 px-3 py-1.5 flex items-center gap-2">
      {/* Traffic lights - tiny */}
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-white/10" />
        <div className="w-2 h-2 rounded-full bg-white/10" />
        <div className="w-2 h-2 rounded-full bg-white/10" />
      </div>

      {/* Address bar - compact */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/[0.03] border border-white/5 rounded px-2.5 py-0.5 text-[10px] text-neutral-400 flex items-center gap-1.5 max-w-[200px]">
          <svg
            className="w-2.5 h-2.5 text-neutral-500 flex-shrink-0"
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
          <span className="truncate">
            <span className="text-neutral-500">ssgoi.dev</span>
            <span className="text-neutral-300">{currentPath}</span>
          </span>
        </div>
      </div>

      {/* Spacer for balance */}
      <div className="w-[52px]" />
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
  onNavigate,
  layout: Layout,
}: BrowserMockupProps) {
  const [currentPath, setCurrentPath] = useState(
    initialPath || routes[0]?.path || "/",
  );

  const contentRef = useRef<HTMLDivElement>(null);

  // Handle navigation
  const navigate = (path: string) => {
    if (path === currentPath) return;

    setCurrentPath(path);
    onNavigate?.(path);

    // Force scroll to top on navigation
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  // Find current route
  const currentRoute =
    routes.find((route) => route.path === currentPath) || routes[0];

  return (
    <BrowserContext.Provider value={{ currentPath, navigate, routes }}>
      <div
        className={cn(
          "browser-mockup w-full rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]",
          "h-[500px] md:h-[800px]", // Fixed heights for mobile and desktop
          className,
        )}
      >
        {/* Browser Header */}
        <BrowserHeader />

        {/* Browser Content */}
        <div
          ref={contentRef}
          className="browser-content bg-[#121212] flex-1 overflow-auto h-full custom-scrollbar"
        >
          <Ssgoi config={config}>
            {Layout ? (
              <Layout>
                <RouteContent route={currentRoute} />
              </Layout>
            ) : (
              <RouteContent route={currentRoute} />
            )}
          </Ssgoi>
        </div>
      </div>
    </BrowserContext.Provider>
  );
}

// Helper component for creating simple demo pages
export interface DemoPageProps {
  children: ReactNode;
  className?: string;
  path: string;
}

export const DemoPage = memo(({ children, className, path }: DemoPageProps) => {
  return (
    <SsgoiTransition id={path} className={cn("min-h-full", className)}>
      {children}
    </SsgoiTransition>
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

export const DemoLink = memo(
  ({ to, children, className, ...props }: DemoLinkProps) => {
    const { navigate } = useBrowserNavigation();

    return (
      <button
        onClick={() => navigate(to)}
        className={cn(
          "text-neutral-300 hover:text-neutral-100 underline cursor-pointer transition-colors",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

DemoLink.displayName = "DemoLink";

// Helper component for demo cards
export interface DemoCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: any; // For data-* attributes
}

export const DemoCard = memo(
  ({ children, onClick, className, ...props }: DemoCardProps) => {
    return (
      <div
        onClick={onClick}
        className={cn(
          "p-4 border border-white/10 rounded-lg bg-white/[0.02]",
          "hover:bg-white/5 transition-colors cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

DemoCard.displayName = "DemoCard";
