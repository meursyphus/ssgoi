"use client";

import type { ReactNode } from "react";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";

/**
 * Fullscreen detail group (pin detail, search results) — no bottom nav by
 * construction: these routes live outside `(tabs)`, so the tab shell (nav
 * included) unmounts on entry and the outer zoom/drill pairs this boundary
 * with the shell's.
 */
export function PinterestDetailShell({ children }: { children: ReactNode }) {
  return (
    <SsgoiTransitionBoundary className="h-full min-h-full bg-white">
      {children}
    </SsgoiTransitionBoundary>
  );
}
