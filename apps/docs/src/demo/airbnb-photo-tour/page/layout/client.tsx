"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { hero } from "@ssgoi/react/view-transitions";
import { SsgoiWithHost } from "@/lib/components/demo-shell";
import { WebShowcaseShell } from "@/lib/components/web-showcase-shell";

const BASE = "/demo/airbnb-photo-tour";

// Airbnb-style: both pages share a white background and a similar header
// silhouette, so we use hero's default static type — only the shared image
// morphs, no chrome cross-fade.
const config: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    {
      from: BASE,
      to: `${BASE}/photos/*`,
      transition: hero({ type: "static", variant: "smooth" }),
    },
  ],
};

export function AirbnbPhotoTourLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WebShowcaseShell>
      <SsgoiWithHost
        config={config}
        boundaryClassName="h-full min-h-full bg-white"
      >
        {children}
      </SsgoiWithHost>
    </WebShowcaseShell>
  );
}
