"use client";

import { type ReactNode } from "react";
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";
import { cn } from "@/lib/utils";

/**
 * Detail-group counterpart of `MobileTabsShell`: a plain per-route pathname
 * boundary for fullscreen screens without the bottom nav. Render it from a
 * `(detail)` route-group layout — the tab shell (nav included) unmounts on
 * entry, so the outer provider pairs this boundary with the shell's and
 * detail screens are nav-free by construction.
 */
export function MobileDetailShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SsgoiTransitionBoundary
      className={cn("h-full min-h-full bg-white", className)}
    >
      {children}
    </SsgoiTransitionBoundary>
  );
}
