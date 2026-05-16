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
    ...drill({ enter: `${BASE}/products/*`, exit: BASE }),
    // home ↔ orders list (drill)
    ...drill({ enter: `${BASE}/orders`, exit: BASE }),
    // orders list ↔ order detail (drill)
    ...drill({ enter: `${BASE}/orders/*`, exit: `${BASE}/orders` }),
    // order detail ↔ review write (sheet)
    ...sheet({ enter: `${BASE}/review/*`, exit: `${BASE}/orders/*` }),
    // home ↔ review write (sheet) — FAB 진입
    ...sheet({ enter: `${BASE}/review/*`, exit: BASE }),
  ],
};

export function GamjaMarketLayoutClient({ children }: { children: ReactNode }) {
  return <MobileShowcaseShell config={config}>{children}</MobileShowcaseShell>;
}
