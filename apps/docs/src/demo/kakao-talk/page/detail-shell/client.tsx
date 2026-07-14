"use client";

import type { ReactNode } from "react";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";

/**
 * Fullscreen detail group (chat room, profile sheet) — no bottom tab bar by
 * construction: these routes live outside `(tabs)`, so the tab shell (bar
 * included) unmounts on entry and the outer drill/sheet pairs this boundary
 * with the shell's.
 */
export function KakaoTalkDetailShell({ children }: { children: ReactNode }) {
  return (
    <SsgoiTransitionBoundary className="h-full min-h-full bg-white">
      {children}
    </SsgoiTransitionBoundary>
  );
}
