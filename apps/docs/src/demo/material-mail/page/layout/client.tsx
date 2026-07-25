"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/material-mail";

// Material Mail — only the sheet/scale path is wired. The Inbox → Mail Detail
// drill and Mail Detail → Reply axis/z transitions are intentionally mocked
// (cards are non-navigating) so the focus stays on the compose sheet.
//
// TODO axis/z: when the Mail Detail / Reply screens land, the second entry
// below should be uncommented. Today the underlying axis({ type: "z" })
// provider exists in core but is not UX-verified for this app yet.
const config: SsgoiConfig = {
  transitions: [
    // FAB ✏️ → Compose (the main showcase of sheet/scale)
    { on: `${BASE}/compose`, transition: sheet({ type: "scale" }) },
    // {
    //   from: `${BASE}/m/*`,
    //   to: `${BASE}/m/*/reply`,
    //   transition: axis({ type: "z" }),
    // },
  ],
};

export function MaterialMailLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MobileShowcaseShell config={config} contentClassName="bg-[#FAFAFE]">
      {children}
    </MobileShowcaseShell>
  );
}
