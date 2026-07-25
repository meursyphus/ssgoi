"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis, sheet, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/air-bnb";

const config: SsgoiConfig = {
  transitions: [
    {
      from: BASE,
      to: `${BASE}/listings/:id`,
      transition: zoom({ type: "blur", variant: "fade" }),
    },
    {
      on: `${BASE}/listings/:id/checkout/*`,
      transition: sheet({ type: "static" }),
    },
    {
      priority: 10,
      ordered: ["review", "method", "confirm"].map(
        (step) => `${BASE}/listings/:id/checkout/${step}`,
      ),
      transition: axis({ type: "x" }),
    },
  ],
};

export function AirBnbLayoutClient({ children }: { children: ReactNode }) {
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
