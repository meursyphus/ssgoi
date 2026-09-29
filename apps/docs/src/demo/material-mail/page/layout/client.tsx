"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis, drill, fade, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/material-mail";

const config: SsgoiConfig = {
  transitions: [
    // FAB ✏️ / Reply / Forward → Compose (the main showcase of sheet/scale).
    // The exact path outranks the drill rule, so replying from a
    // conversation still raises the sheet instead of drilling out.
    { on: `${BASE}/compose`, transition: sheet({ type: "scale" }) },
    // Bottom nav destinations: M3 fade-through, the nav itself stays put.
    {
      ordered: [BASE, `${BASE}/meet`, `${BASE}/chat`, `${BASE}/spaces`],
      transition: fade(),
    },
    // Mail row → conversation.
    { on: `${BASE}/m/*`, transition: drill() },
    // Search pill → full-screen search along Material's shared z-axis.
    { on: `${BASE}/search`, transition: axis({ type: "z" }) },
    // Search result → conversation. Without this pair the exact /search rule
    // would win on leave and play axis-z backward.
    { from: `${BASE}/search`, to: `${BASE}/m/*`, transition: drill() },
  ],
};

export function MaterialMailLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // The (tabs)/(detail) route-group layouts own their boundaries.
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-[#FAFAFE]"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
