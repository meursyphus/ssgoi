"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { axis } from "@ssgoi/react/view-transitions";
import { TopAppBar } from "../shared/top-app-bar";
import { FloatingBottomNav } from "../shared/floating-bottom-nav";
const BASE = "/demo/google-photos";
const innerConfig: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    ...axis({
      paths: [BASE, `${BASE}/collections`, `${BASE}/create`],
      type: "y",
      variant: "non-directional",
    }),
  ],
};

// Wrap the whole tabs layout as one Ssgoi page identified by the current
// pathname, so the outer Ssgoi (hero/drill) can pair the tabs area with
// detail routes that live outside the (tabs) group.
//
// The transition boundary is the flex-column wrapper itself (not nested inside one).
// `min-h-full` here only resolves when the *parent's* height is explicit; with
// an extra `block min-h-full` div in between the chain broke (parent had
// min-height but no height), the wrapper collapsed to content height, and
// FloatingBottomNav's `sticky bottom-0` stuck to the short wrapper instead of
// the scroll viewport — making the nav float above the bottom on short pages.
export function GooglePhotosTabsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div
      data-ssgoi-transition={pathname}
      className="relative flex min-h-full flex-col bg-white"
    >
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
