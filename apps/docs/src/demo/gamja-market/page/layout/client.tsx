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
    { from: BASE, to: `${BASE}/products/*`, transition: drill() },
    // home ↔ orders list (drill)
    { from: BASE, to: `${BASE}/orders`, transition: drill() },
    // orders list ↔ order detail (drill)
    {
      from: `${BASE}/orders`,
      to: `${BASE}/orders/*`,
      transition: drill(),
    },
    // order detail ↔ review write (sheet)
    {
      from: `${BASE}/orders/*`,
      to: `${BASE}/review/*`,
      transition: sheet({ type: "static" }),
    },
    // home ↔ review write (sheet) — FAB 진입
    {
      from: BASE,
      to: `${BASE}/review/*`,
      transition: sheet({ type: "static" }),
    },
  ],
};

export function GamjaMarketLayoutClient({ children }: { children: ReactNode }) {
  return <MobileShowcaseShell config={config}>{children}</MobileShowcaseShell>;
}
