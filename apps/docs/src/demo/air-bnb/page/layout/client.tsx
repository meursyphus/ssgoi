"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/air-bnb";

const config: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    zoom({
      paths: [BASE, `${BASE}/listings/:id`],
      type: "blur",
      variant: "fade",
    }),
    sheet({
      type: "static",
      enter: `${BASE}/listings/:id/checkout/*`,
      exit: `${BASE}/listings/:id`,
    }),
  ],
};

export function AirBnbLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell config={config} contentClassName="bg-white">
      {children}
    </MobileShowcaseShell>
  );
}
