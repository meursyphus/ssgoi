"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { SsgoiWithHost } from "./demo-shell";
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";
import { cn } from "@/lib/utils";

/**
 * Double-boundary tab shell for mobile demos — THE way to do a conditional
 * bottom nav: main (tab) screens carry the nav, detail screens don't, and the
 * nav behaves correctly through every transition.
 *
 * ssgoi animates the `data-ssgoi-transition` boundary element (whole subtree).
 * A bottom nav's requirement splits in two: on tab→detail (drill/sheet/zoom)
 * it must leave **with** the page (nav inside the boundary), on tab↔tab it
 * must stay put (nav outside the boundary). One provider can't do both, so:
 *
 *   shell boundary (stableKey — no remount on tab moves)  ← outer provider owns.
 *     ├ {topBar}                                             drill/sheet/hero/zoom.
 *     ├ nested <Ssgoi> (display:contents)
 *     │   └ tab-content boundary (remounts per tab)       ← nested provider owns.
 *     │                                                      the `config` prop.
 *     └ {nav}  ← outside the nested root, inside the shell.
 *
 * - tab↔tab: the shell never remounts, so the outer provider sees nothing.
 *   Only the content boundary swaps → the nested provider runs `config`'s
 *   transition on the tab body while topBar + nav stand perfectly still.
 * - tab→detail: the whole `(tabs)` layout unmounts. ssgoi reads the shell's
 *   `data-ssgoi-transition` (the actual tab path) as `from` and pairs it with
 *   the detail boundary via the outer config — nav and page leave together.
 *
 * Both boundaries carry the same pathname value on purpose: they belong to
 * different providers (ssgoi scopes boundaries by `closest("[data-ssgoi-root]")`).
 *
 * Wiring checklist (see google-photos / kakao-talk / pinterest):
 * - The demo layout passes `withTransitionBoundary={false}` to
 *   `MobileShowcaseShell` — a layout-level pathname boundary would remount
 *   this shell (nav included) on every tab move.
 * - Tab routes live in a `(tabs)` route group whose layout renders this
 *   shell; detail routes live outside it (e.g. a `(detail)` group rendering
 *   `MobileDetailShell`). Nav visibility is route-group structure, not
 *   runtime pathname checks.
 * - `nav` must be sticky-positioned (inside the scroll container), NOT
 *   `MobileFrame`'s `bottomSlot` — a slotted nav sits outside every
 *   transition and would stay frozen on screen during detail transitions.
 * - `config` must come from a module constant (or useMemo) — `<Ssgoi>`
 *   memoizes its context on the config reference.
 */
export function MobileTabsShell({
  config,
  children,
  nav,
  topBar,
  className,
  contentClassName,
}: {
  /** Nested provider's config — tab↔tab transitions only (axis/fade/slide). */
  config: SsgoiConfig;
  children: ReactNode;
  /** Bottom nav, rendered outside the nested root. Must be sticky-positioned. */
  nav: ReactNode;
  /** Optional chrome above the tab content (e.g. a sticky top app bar). */
  topBar?: ReactNode;
  /** Extra classes for the shell boundary (the flex column). */
  className?: string;
  /** Extra classes for the tab-content boundary. */
  contentClassName?: string;
}) {
  return (
    <SsgoiTransitionBoundary
      stableKey
      className={cn("relative flex min-h-full flex-col bg-white", className)}
    >
      {topBar}
      <SsgoiWithHost config={config} withTransitionBoundary={false}>
        <div className="relative z-0 flex-1">
          <SsgoiTransitionBoundary
            className={cn("min-h-full bg-white", contentClassName)}
          >
            {children}
          </SsgoiTransitionBoundary>
        </div>
      </SsgoiWithHost>
      {nav}
    </SsgoiTransitionBoundary>
  );
}
