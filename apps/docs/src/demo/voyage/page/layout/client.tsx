"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { drill, fade, sheet, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";
import { BASE } from "../shared/routes";

const TABS = [BASE, `${BASE}/saved`, `${BASE}/trips`, `${BASE}/profile`];
const STORY = `${BASE}/story/*`;
const ACTIVITY = `${BASE}/notifications`;

// Rules are ranked by priority, then specificity, then declaration order.
const config: SsgoiConfig = {
  transitions: [
    // Bottom-nav tabs: the nav stays put while the tab content fades.
    { ordered: TABS, transition: fade() },
    // Voyage showcases the `sheet` "blur" tone: tapping "New story" raises
    // the compose sheet while the feed underneath blurs and recedes — a modal
    // pushing the page out of focus, the way Gmail's compose floats over the
    // inbox. Close and Publish leave the scope, so the sheet drops back.
    { on: `${BASE}/compose`, transition: sheet({ type: "blur" }) },
    // A story cover grows into the reader, like a travel-magazine card; the
    // fade variant softens the rest of the page for reading. A pair, so a
    // push from a story back to a tab zooms back into its card.
    {
      from: TABS,
      to: STORY,
      transition: zoom({ type: "expand", variant: "fade" }),
    },
    // "More stories" → story: equal patterns defer to history direction.
    // A link pushes forward; Back returns to the previous story.
    {
      from: STORY,
      to: STORY,
      transition: zoom({ type: "expand", variant: "fade" }),
    },
    // Bell → Activity list, the standard push into a list.
    { on: ACTIVITY, transition: drill() },
    // Activity row → story keeps drilling forward. Without this pair the
    // navigation would only match the `on` rule above as a leave (backward).
    { from: ACTIVITY, to: STORY, transition: drill() },
  ],
};

export function VoyageLayoutClient({ children }: { children: ReactNode }) {
  return (
    // The (tabs)/(detail) route-group layouts own their boundaries.
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
