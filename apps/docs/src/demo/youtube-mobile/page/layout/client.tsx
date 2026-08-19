"use client";

import type { ReactNode } from "react";
import type { SsgoiConfig } from "@ssgoi/react";
import { axis, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/youtube-mobile";

const config: SsgoiConfig = {
  transitions: [
    {
      ordered: [
        BASE,
        `${BASE}/shorts`,
        `${BASE}/subscriptions`,
        `${BASE}/profile`,
      ],
      transition: axis({ type: "y", variant: "non-directional" }),
    },
    { on: `${BASE}/create`, transition: sheet() },
  ],
};

export function YouTubeMobileLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
