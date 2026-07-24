"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/air-bnb";

const config: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    {
      from: BASE,
      to: `${BASE}/listings/:id`,
      transition: zoom({ type: "blur", variant: "fade" }),
    },
    {
      from: `${BASE}/listings/:id`,
      to: `${BASE}/listings/:id/checkout/*`,
      transition: sheet({ type: "static" }),
    },
  ],
};

export function AirBnbLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell config={config} contentClassName="bg-white">
      {children}
    </MobileShowcaseShell>
  );
}
