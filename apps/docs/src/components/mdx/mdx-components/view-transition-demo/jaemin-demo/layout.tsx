"use client";

import React, { memo } from "react";
import { cn } from "../../../../../lib/utils";
import { useMobile } from "../../../../../lib/use-mobile";
import { useBrowserNavigation } from "../../browser-mockup";
import { content } from "./content";

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <a
        href="https://github.com/elrion018"
        className="text-gray-300 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        title="Jaemin Cheon GitHub"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </a>
      <a
        href="https://github.com/elrion018"
        className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
        target="_blank"
        rel="noopener noreferrer"
        title="Jaemin Cheon GitHub"
      >
        {content.layout.creator}
      </a>
    </>
  );
}

// Demo Layout Component
interface DemoLayoutProps {
  children: React.ReactNode;
}

export const DemoLayout = memo(({ children }: DemoLayoutProps) => {
  const context = useBrowserNavigation();
  const isMobile = useMobile();

  const { currentPath, navigate, routes } = context;

  return (
    <div className="relative min-h-full">
      {/* Floating Header - Fixed, centered, doesn't take up space */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999]">
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1.5",
            "bg-neutral-900/80 backdrop-blur-md",
            "border border-white/10 rounded-full",
            "shadow-lg shadow-black/20",
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              "font-medium text-neutral-200 flex items-center gap-1.5 px-2",
              isMobile ? "text-xs" : "text-sm",
            )}
          >
            <span>⭐</span>
            <span>Stellar</span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-white/10" />

          {/* Navigation */}
          <nav className="flex items-center gap-0.5">
            {routes.map((route) => (
              <button
                key={route.path}
                onClick={() => navigate(route.path)}
                className={cn(
                  "rounded-full transition-all",
                  isMobile ? "px-2.5 py-1 text-xs" : "px-3 py-1 text-xs",
                  currentPath === route.path
                    ? "bg-white/10 text-neutral-100"
                    : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200",
                )}
              >
                {content.layout[route.label as keyof typeof content.layout] ||
                  route.label}
              </button>
            ))}
          </nav>

          {/* Header Actions - Desktop only */}
          {!isMobile && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 px-1">
                <HeaderActions />
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
});

DemoLayout.displayName = "JaeminDemoLayout";
