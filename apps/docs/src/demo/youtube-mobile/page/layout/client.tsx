"use client";

import type { ReactNode } from "react";
import type { SsgoiConfig } from "@ssgoi/react";
import { axis, drill, fade, sheet, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/youtube-mobile";
const WATCH = `${BASE}/watch/*`;
const CHANNEL = `${BASE}/channel/*`;

const config: SsgoiConfig = {
  transitions: [
    {
      ordered: [
        BASE,
        `${BASE}/shorts`,
        `${BASE}/subscriptions`,
        `${BASE}/profile`,
      ],
      transition: axis({ type: "y", variant: "non-directional" }),
    },
    { on: `${BASE}/create`, transition: sheet() },
    // Search appears in place over whatever screen opened it.
    { on: `${BASE}/search`, transition: fade() },
    // Channel pages and notifications push in from the right. They share one
    // scope, so notifications → channel is a forward push (history decides).
    {
      on: [CHANNEL, `${BASE}/notifications`],
      transition: drill(),
    },
    // Search → channel drills too; one-way, so channel → search stays a fade.
    {
      from: `${BASE}/search`,
      to: CHANNEL,
      bidirectional: false,
      transition: drill(),
    },
    // A tapped thumbnail grows into the player. Lists with a fixed place
    // reverse on a push back (showcase clip exit legs); the pair outranks the
    // search/notifications scopes above.
    {
      from: [
        BASE,
        `${BASE}/subscriptions`,
        `${BASE}/profile`,
        `${BASE}/search`,
        `${BASE}/notifications`,
      ],
      to: WATCH,
      transition: zoom({ type: "expand" }),
    },
    // One-way so watch → channel stays a forward drill.
    {
      from: CHANNEL,
      to: WATCH,
      bidirectional: false,
      transition: zoom({ type: "expand" }),
    },
    // Up next: equal patterns, so history gives the direction.
    { from: WATCH, to: WATCH, transition: zoom({ type: "expand" }) },
    // Shorts shelf card → full-screen player.
    {
      from: [BASE, `${BASE}/subscriptions`],
      to: `${BASE}/shorts/*`,
      transition: zoom({ type: "expand" }),
    },
  ],
};

export function YouTubeMobileLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
