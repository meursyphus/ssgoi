"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { slide, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/instagram";

// outer ssgoi — profile 영역(layout 통째) ↔ feed 상세 사이의 zoom static.
const config: SsgoiConfig = {
  transitions: [
    {
      from: `${BASE}/profile/*`,
      to: `${BASE}/feed/*`,
      transition: zoom({ type: "static" }),
    },
    {
      ordered: [
        `${BASE}/profile/:id`,
        `${BASE}/profile/:id/reels`,
        `${BASE}/profile/:id/remix`,
        `${BASE}/profile/:id/tagged`,
      ],
      transition: slide(),
    },
  ],
};

export function InstagramLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell config={config} withTransitionBoundary={false}>
      {children}
    </MobileShowcaseShell>
  );
}
