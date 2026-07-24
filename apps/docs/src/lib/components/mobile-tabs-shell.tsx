"use client";

import { type ReactNode } from "react";
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";
import { cn } from "@/lib/utils";

/**
 * Persistent tab shell. The outer boundary keeps a stable key while this
 * `(tabs)` layout survives; the inner pathname boundary remounts for tab
 * changes. If the route group exits, both leave together and SSGOI promotes
 * the outer boundary, so the nav leaves with the shell.
 */
export function MobileTabsShell({
  children,
  nav,
  topBar,
  className,
  contentClassName,
}: {
  children: ReactNode;
  /** Bottom nav, outside the inner boundary but inside the stable shell. */
  nav: ReactNode;
  /** Optional chrome above the tab content (e.g. a sticky top app bar). */
  topBar?: ReactNode;
  /** Extra classes for the shell boundary (the flex column). */
  className?: string;
  /** Extra classes for the tab-content boundary. */
  contentClassName?: string;
}) {
  return (
    <SsgoiTransitionBoundary
      scope={() => "mobile-tabs-shell"}
      className={cn("relative flex min-h-full flex-col bg-white", className)}
    >
      {topBar}
      <div className="relative z-0 flex-1">
        <SsgoiTransitionBoundary
          className={cn("min-h-full bg-white", contentClassName)}
        >
          {children}
        </SsgoiTransitionBoundary>
      </div>
      {nav}
    </SsgoiTransitionBoundary>
  );
}
