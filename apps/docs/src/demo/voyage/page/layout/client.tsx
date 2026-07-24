"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/voyage";

// Voyage showcases the `sheet` "blur" tone: tapping "New story" raises the
// compose sheet while the feed underneath blurs and recedes — a modal pushing
// the page out of focus, the way Gmail's compose floats over the inbox.
const config: SsgoiConfig = {
  preserveScroll: true,
  transitions: [{ on: `${BASE}/compose`, transition: sheet({ type: "blur" }) }],
};

export function VoyageLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell config={config} contentClassName="bg-white">
      {children}
    </MobileShowcaseShell>
  );
}
