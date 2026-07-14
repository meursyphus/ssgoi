"use client";

import type { ReactNode } from "react";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";

/**
 * Fullscreen detail group — no bottom nav by construction: detail routes live
 * outside the `(tabs)` group, so the tab shell (and its nav) unmounts on entry
 * and ssgoi drills them out together. Each detail screen gets a plain
 * pathname boundary the outer provider pairs with the tab shell's boundary.
 */
export function GooglePhotosDetailShell({ children }: { children: ReactNode }) {
  return (
    <SsgoiTransitionBoundary className="h-full min-h-full bg-white">
      {children}
    </SsgoiTransitionBoundary>
  );
}
