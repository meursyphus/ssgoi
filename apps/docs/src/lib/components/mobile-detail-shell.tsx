"use client";

import { type ReactNode } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { cn } from "@/lib/utils";

/**
 * Detail-group counterpart of `MobileTabsShell`: a plain per-route pathname
 * boundary for fullscreen screens without the bottom nav. Render it from a
 * `(detail)` route-group layout — the tab shell (nav included) unmounts on
 * entry, so SSGOI pairs this boundary with the leaving shell boundary and
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
    <SsgoiRouteBoundary className={cn("h-full min-h-full bg-white", className)}>
      {children}
    </SsgoiRouteBoundary>
  );
}
