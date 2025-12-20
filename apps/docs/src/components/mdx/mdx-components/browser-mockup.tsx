/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useState, useRef, memo } from "react";
import { cn } from "../../../lib/utils";
import { Ssgoi, SsgoiTransition } from "@ssgoi/react";
import type { SsgoiConfig } from "@ssgoi/react";
import { SandpackBrowserMockup } from "./sandpack-browser-mockup";

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
  deviceType?: "desktop" | "mobile";
  /** Enable Sandpack mode for true iframe isolation */
  useSandpack?: boolean;
  /** Files to pass to Sandpack (required if useSandpack is true) */
  sandpackFiles?: Record<string, string>;
  /** Additional Sandpack dependencies */
  sandpackDependencies?: Record<string, string>;
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

// Mobile header component - iPhone style with dynamic island
const MobileHeader = memo(() => {
  const { currentPath } = useBrowserNavigation();

  return (
    <div className="mobile-header bg-neutral-900/95 relative">
      {/* Dynamic Island / Notch */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-28 h-7 bg-black rounded-full border border-white/10 flex items-center justify-center gap-3 px-3">
          {/* Camera */}
          <div className="w-2 h-2 rounded-full bg-neutral-800 ring-1 ring-white/20" />
          {/* Spacer */}
          <div className="flex-1" />
          {/* Face ID dots */}
          <div className="flex gap-0.5">
            <div className="w-0.5 h-0.5 rounded-full bg-red-500/60" />
            <div className="w-0.5 h-0.5 rounded-full bg-red-500/40" />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1">
        {/* Time */}
        <div className="text-[11px] font-medium text-white/90">9:41</div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          {/* Signal */}
          <div className="flex items-end gap-[1px]">
            <div className="w-0.5 h-1.5 bg-white/90 rounded-full" />
            <div className="w-0.5 h-2 bg-white/90 rounded-full" />
            <div className="w-0.5 h-2.5 bg-white/90 rounded-full" />
            <div className="w-0.5 h-3 bg-white/90 rounded-full" />
          </div>
          {/* WiFi */}
          <svg
            className="w-3.5 h-3.5 text-white/90"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-4c1.66 0 3.16.64 4.29 1.68l1.42-1.42C16.08 12.63 14.13 12 12 12s-4.08.63-5.71 2.26l1.42 1.42C8.84 14.64 10.34 14 12 14zm0-4c2.76 0 5.26 1.12 7.07 2.93l1.42-1.42C18.28 9.3 15.26 8 12 8s-6.28 1.3-8.49 3.51l1.42 1.42C6.74 11.12 9.24 10 12 10z" />
          </svg>
          {/* Battery */}
          <div className="flex items-center gap-0.5">
            <div className="w-5 h-2.5 border border-white/90 rounded-sm relative">
              <div className="absolute inset-0.5 bg-white/90 rounded-[1px]" />
            </div>
            <div className="w-0.5 h-1.5 bg-white/90 rounded-r-sm" />
          </div>
        </div>
      </div>

      {/* Address bar */}
      <div className="px-3 pb-2">
        <div className="bg-neutral-800/80 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-neutral-400 flex items-center gap-2">
          <svg
            className="w-3 h-3 text-neutral-500 flex-shrink-0"
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
          <span className="truncate flex-1">
            <span className="text-neutral-500">ssgoi.dev</span>
            <span className="text-neutral-300">{currentPath}</span>
          </span>
          <svg
            className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0"
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
        </div>
      </div>
    </div>
  );
});

MobileHeader.displayName = "MobileHeader";

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
  deviceType = "desktop",
  useSandpack = false,
  sandpackFiles,
  sandpackDependencies,
}: BrowserMockupProps) {
  // If Sandpack mode is enabled, delegate to SandpackBrowserMockup
  if (useSandpack && sandpackFiles) {
    return (
      <SandpackBrowserMockup
        files={sandpackFiles}
        dependencies={sandpackDependencies}
        deviceType={deviceType}
        initialPath={initialPath || routes[0]?.path || "/"}
        className={className}
      />
    );
  }

  // Original implementation for non-Sandpack mode
  return (
    <BrowserMockupOriginal
      routes={routes}
      config={config}
      initialPath={initialPath}
      className={className}
      onNavigate={onNavigate}
      layout={Layout}
      deviceType={deviceType}
    />
  );
}

// Original BrowserMockup implementation (without Sandpack)
function BrowserMockupOriginal({
  routes,
  config,
  initialPath,
  className,
  onNavigate,
  layout: Layout,
  deviceType = "desktop",
}: Omit<
  BrowserMockupProps,
  "useSandpack" | "sandpackFiles" | "sandpackDependencies"
>) {
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

  const isMobile = deviceType === "mobile";

  return (
    <BrowserContext.Provider value={{ currentPath, navigate, routes }}>
      <div
        className={cn(
          "browser-mockup overflow-hidden bg-white/[0.02] relative flex flex-col",
          isMobile
            ? "w-[375px] mx-auto rounded-[3rem] border-[14px] border-neutral-900 h-[667px] shadow-2xl shadow-black/50"
            : "w-full rounded-xl border border-white/10 h-[500px] md:h-[800px]",
          className,
        )}
      >
        {/* Header - Desktop or Mobile */}
        {isMobile ? <MobileHeader /> : <BrowserHeader />}

        {/* Browser Content */}
        <div
          ref={contentRef}
          className="browser-content z-0 relative bg-[#121212] flex-1 overflow-auto custom-scrollbar"
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

        {/* iPhone Home Indicator */}
        {isMobile && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
        )}
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
