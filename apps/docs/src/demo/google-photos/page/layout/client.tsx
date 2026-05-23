"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { drill, hero } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/google-photos";

const config: SsgoiConfig = {
  // Always preserve scroll inside the mobile-frame.
  preserveScroll: true,
  transitions: [
    // Photo grid ↔ photo detail — shared-element hero (the tapped thumbnail
    // grows into the fullscreen image).
    ...hero({ paths: [BASE, `${BASE}/p/*`] }),

    // Collections grid ↔ collection detail — drill (push/pop stack feel).
    ...drill({ enter: `${BASE}/c/*`, exit: `${BASE}/collections` }),

    // TODO(fade-variant): once `hero({ variant: "fade" })` is exposed, pair
    // collection detail ↔ photo detail with the same hero so a thumbnail tapped
    // inside a collection also grows into the fullscreen photo. The collection
    // detail has its own chrome (back button) so the surrounding chrome needs
    // the "fade" variant to cross-fade cleanly. The variant isn't in the public
    // HeroVariant type yet, so it's commented out.
    // ...hero({ paths: [`${BASE}/c/*`, `${BASE}/p/*`], variant: "fade" }),
  ],
};

export function GooglePhotosLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell config={config} contentClassName="bg-white">
      {children}
    </MobileShowcaseShell>
  );
}
