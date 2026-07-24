"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { drill, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/gamja-market";

const config: SsgoiConfig = {
  // 모바일 데모 — 데스크탑 viewport에서도 mobile-frame 안에서는 항상 스크롤 보존
  preserveScroll: true,
  transitions: [
    // home ↔ product detail (drill)
    { on: `${BASE}/products/*`, transition: drill() },
    // home ↔ orders list (drill)
    // orders is one nested drill stack, including its detail pages
    {
      on: `${BASE}/orders/**`,
      transition: drill(),
    },
    // review write is a sheet regardless of whether it opens from home or an order
    {
      on: `${BASE}/review/*`,
      transition: sheet({ type: "static" }),
    },
  ],
};

export function GamjaMarketLayoutClient({ children }: { children: ReactNode }) {
  return <MobileShowcaseShell config={config}>{children}</MobileShowcaseShell>;
}
