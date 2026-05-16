"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { zoom, drill } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/pinterest";

const config: SsgoiConfig = {
  transitions: [
    // home ↔ feed detail — zoom EXPAND (the headline interaction)
    ...zoom({
      paths: [BASE, `${BASE}/feed/*`],
      type: "expand",
    }),
    // search ↔ search result drill
    ...drill({
      enter: `${BASE}/search/*`,
      exit: `${BASE}/search`,
    }),
  ],
};

export function PinterestLayoutClient({ children }: { children: ReactNode }) {
  return <MobileShowcaseShell config={config}>{children}</MobileShowcaseShell>;
}
