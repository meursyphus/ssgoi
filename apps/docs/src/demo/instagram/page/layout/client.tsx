"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/instagram";

const config: SsgoiConfig = {
  transitions: [
    ...zoom({
      paths: [`${BASE}/profile/*`, `${BASE}/feed/*`],
      type: "static",
    }),
  ],
};

export function InstagramLayoutClient({ children }: { children: ReactNode }) {
  return <MobileShowcaseShell config={config}>{children}</MobileShowcaseShell>;
}
