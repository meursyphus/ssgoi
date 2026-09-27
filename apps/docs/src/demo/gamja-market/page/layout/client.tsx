"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { drill, fade, sheet, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/gamja-market";

// Rules resolve by priority → specificity → declaration order, not first match.
const config: SsgoiConfig = {
  transitions: [
    // bottom tabs — a quiet fade while the nav stays put (MobileTabsShell)
    {
      ordered: [
        BASE,
        `${BASE}/life`,
        `${BASE}/near`,
        `${BASE}/chats`,
        `${BASE}/my`,
      ],
      transition: fade(),
    },
    // listing photo → full-screen viewer (pair beats the products scope)
    {
      from: `${BASE}/products/*`,
      to: `${BASE}/products/*/photos`,
      transition: zoom({ type: "expand" }),
    },
    // 주문하기 pushes the new order forward. One-way on purpose: the order's
    // "주문 상품" link back to a product must stay a forward drill.
    {
      from: `${BASE}/products/*`,
      to: `${BASE}/orders/*`,
      bidirectional: false,
      transition: drill(),
    },
    // any tab ↔ product detail (drill)
    { on: `${BASE}/products/*`, transition: drill() },
    // any tab ↔ orders list
    // orders is one nested drill stack, including its detail pages
    {
      on: `${BASE}/orders/**`,
      transition: drill(),
    },
    // review write is a sheet regardless of where it opens from
    {
      on: `${BASE}/review/*`,
      transition: sheet({ type: "static" }),
    },
  ],
};

export function GamjaMarketLayoutClient({ children }: { children: ReactNode }) {
  return (
    // The (tabs)/(detail) route-group layouts own their boundaries.
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-[#FAF8F6]"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
