"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { zoom, drill, fade, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/pinterest";

// Rules are ranked by priority, then specificity, then declaration order.
const config: SsgoiConfig = {
  transitions: [
    // Bottom-nav tabs: the nav stays put while the tab content fades.
    {
      ordered: [BASE, `${BASE}/search`, `${BASE}/profile`],
      transition: fade(),
    },
    // Grid → pin close-up: zoom EXPAND (the headline interaction). Kept
    // bidirectional so a fresh push from a pin back to its grid zooms out.
    {
      from: [BASE, `${BASE}/profile`],
      to: `${BASE}/feed/*`,
      transition: zoom({ type: "expand" }),
    },
    // Inbox thumbnails are tiny: expand would blow the list up ~8x, so the
    // list stays put and the pin grows out of its thumbnail instead.
    {
      from: `${BASE}/inbox`,
      to: `${BASE}/feed/*`,
      transition: zoom({ type: "static" }),
    },
    // Related-pin detail -> detail: equal patterns defer to history direction.
    // A normal link pushes forward; Back (history) returns to the prior pin.
    {
      from: `${BASE}/feed/*`,
      to: `${BASE}/feed/*`,
      transition: zoom({ type: "expand" }),
    },
    // Search results → pin. One-way on purpose: the pin's visual-search
    // button pushes into /search/* again, which must drill forward (below)
    // instead of zooming backward. Back still replays the recorded zoom.
    {
      from: `${BASE}/search/*`,
      to: `${BASE}/feed/*`,
      bidirectional: false,
      transition: zoom({ type: "expand" }),
    },
    // search ↔ search result drill (and result → refined result)
    {
      on: `${BASE}/search/**`,
      except: `${BASE}/search`,
      transition: drill({ type: "slide" }),
    },
    // Home header → inbox. A pair, not `on`, so links out of the inbox keep
    // their own rules.
    {
      from: BASE,
      to: `${BASE}/inbox`,
      transition: drill({ type: "slide" }),
    },
    // Create menu and share sheet rise over the page that opened them.
    {
      on: [`${BASE}/create`, `${BASE}/feed/*/share`],
      transition: sheet(),
    },
  ],
};

export function PinterestLayoutClient({ children }: { children: ReactNode }) {
  return (
    // The (tabs)/(detail) route-group layouts own their boundaries.
    <MobileShowcaseShell config={config} withTransitionBoundary={false}>
      {children}
    </MobileShowcaseShell>
  );
}
