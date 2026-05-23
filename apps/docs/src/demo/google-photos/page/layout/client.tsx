"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { drill, hero, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/google-photos";

const config: SsgoiConfig = {
  // Always preserve scroll inside the mobile-frame.
  preserveScroll: true,
  transitions: [
    // Listed before hero so collections↔c/* wins matching (the dispatcher
    // is first-hit; no exact-vs-wildcard priority).
    drill({ enter: `${BASE}/c/*`, exit: `${BASE}/collections` }),
    // Collage maker rises as a sheet over the Create tab.
    ...sheet({ enter: `${BASE}/collage`, exit: `${BASE}/create` }),
    // Every detail screen has its own chrome (back button, meta) that the
    // surrounding tabs don't share, so cross-fade chrome on both pairs.
    // BASE↔c/* pair also gets generated but no UI flow triggers it.
    hero({
      paths: [BASE, `${BASE}/c/*`, `${BASE}/p/*`],
      type: "fade",
    }),
  ],
};

export function GooglePhotosLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell config={config} contentClassName="bg-white">
      {children}
    </MobileShowcaseShell>
  );
}
