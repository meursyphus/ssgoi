"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis } from "@ssgoi/react/view-transitions";
import { SsgoiWithHost } from "@/lib/components/demo-shell";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";
import { TopAppBar } from "../shared/top-app-bar";
import { FloatingBottomNav } from "../shared/floating-bottom-nav";

const BASE = "/demo/google-photos";

const tabsConfig: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    ...axis({
      paths: [BASE, `${BASE}/collections`, `${BASE}/create`],
      type: "y",
      variant: "non-directional",
    }),
  ],
};

/**
 * Double-boundary tab shell — the pattern for a bottom nav that must ignore
 * tab↔tab transitions but ride along on tab→detail.
 *
 * ssgoi animates the `data-ssgoi-transition` boundary element (whole subtree).
 * The requirement splits in two: on tab→detail (drill/hero) the nav should
 * leave **with** the page (nav inside the boundary), on tab↔tab (axis) it must
 * stay put (nav outside the boundary). One provider can't do both, so:
 *
 *   shell boundary (stableKey — no remount on tab moves)  ← outer provider owns.
 *     ├ sticky TopAppBar                                     drill/sheet/hero.
 *     ├ nested <Ssgoi> (display:contents)
 *     │   └ tab-content boundary (remounts per tab)       ← nested provider owns.
 *     │                                                      axis between tabs.
 *     └ <FloatingBottomNav/>  ← outside the nested root, inside the shell.
 *
 * - tab↔tab: the shell never remounts, so the outer provider sees nothing.
 *   Only the content boundary swaps → the nested provider runs `axis` on the
 *   tab body while the app bar + bottom nav stand perfectly still.
 * - tab→detail: the whole `(tabs)` layout unmounts. ssgoi reads the shell's
 *   `data-ssgoi-transition` (the actual tab path) as `from` and pairs it with
 *   the detail boundary via the outer config — nav and page drill out together.
 *
 * Both boundaries carry the same pathname value on purpose: they belong to
 * different providers (ssgoi scopes boundaries by `closest("[data-ssgoi-root]")`).
 *
 * This is intentionally NOT `MobileFrame`'s `bottomSlot` — a slotted nav sits
 * outside every transition and would stay visible (frozen) on detail screens.
 * Here detail routes live outside the `(tabs)` group, so the nav unmounts with
 * the shell and detail screens are genuinely nav-free.
 */
export function GooglePhotosTabsShell({ children }: { children: ReactNode }) {
  return (
    <SsgoiTransitionBoundary
      stableKey
      className="relative flex min-h-full flex-col bg-white"
    >
      <div className="sticky top-0 z-30 bg-white">
        <TopAppBar />
      </div>
      <SsgoiWithHost config={tabsConfig} withTransitionBoundary={false}>
        <div className="relative z-0 flex-1 bg-white">
          <SsgoiTransitionBoundary className="min-h-full bg-white">
            {children}
          </SsgoiTransitionBoundary>
        </div>
      </SsgoiWithHost>
      <FloatingBottomNav />
    </SsgoiTransitionBoundary>
  );
}
