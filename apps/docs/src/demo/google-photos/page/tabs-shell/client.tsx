"use client";

import { useMemo, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { axis } from "@ssgoi/react/view-transitions";
import { TopAppBar } from "../shared/top-app-bar";
import { FloatingBottomNav } from "../shared/floating-bottom-nav";

const BASE = "/demo/google-photos";

export function GooglePhotosTabsShell({ children }: { children: ReactNode }) {
  // The tabs area needs a different preserveScroll key from the outer Ssgoi
  // so it doesn't collide with the surrounding hero/drill. axis(x) alone
  // handles the left/right swap between the 3 tabs.
  const innerConfig: SsgoiConfig = useMemo(
    () => ({
      preserveScroll: { key: "google-photos-tabs" },
      transitions: [
        ...axis({
          paths: [BASE, `${BASE}/collections`, `${BASE}/create`],
          type: "x",
        }),
      ],
    }),
    [],
  );

  return (
    <div className="relative flex min-h-full flex-col bg-white">
      <div className="sticky top-0 z-30 bg-white">
        <TopAppBar />
      </div>
      <Ssgoi config={innerConfig}>
        <div className="relative z-0 flex-1">{children}</div>
      </Ssgoi>
      <FloatingBottomNav />
    </div>
  );
}
