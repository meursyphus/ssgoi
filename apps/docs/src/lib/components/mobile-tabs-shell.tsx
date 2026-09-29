"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Persistent tab shell with two nested SSGOI boundaries.
 *
 * - Outer (shell): mounted once per `(tabs)` layout, so it survives tab
 *   changes. When the route group exits (a detail opens), it leaves as a
 *   whole and SSGOI promotes it: top bar, content and nav leave together.
 * - Inner (content): keyed by pathname, so only the content animates between
 *   tabs while the nav stays still.
 *
 * Both are plain elements carrying `key` + `data-ssgoi-transition`, the
 * boundary contract from the React guide, instead of `SsgoiRouteBoundary`,
 * which wraps itself in a `<Suspense>`. A tab page whose chunk is not loaded
 * yet (a detail opened directly, then back to its tab) suspends on first
 * mount. With a Suspense inside the shell, React committed around it: the
 * shell arrived empty and SSGOI paired it before the page existed, so
 * zoom/hero found no exit key and the swap was instant (or, with the Suspense
 * on the outer boundary, the leaving page vanished until the chunk arrived).
 * Without one, the suspension reaches the demo layout's already-visible
 * `<Suspense>`, so the navigation keeps the old page on screen and commits
 * the shell together with its content.
 */
export function MobileTabsShell({
  children,
  nav,
  topBar,
  className,
  contentClassName,
}: {
  children: ReactNode;
  /** Bottom nav, outside the inner boundary but inside the stable shell. */
  nav: ReactNode;
  /** Optional chrome above the tab content (e.g. a sticky top app bar). */
  topBar?: ReactNode;
  /** Extra classes for the shell boundary (the flex column). */
  className?: string;
  /**
   * Extra classes for the tab-content boundary. It is a flex column that
   * fills the space between `topBar` and `nav`, so a page root with `flex-1`
   * covers the whole screen even when its content is short.
   */
  contentClassName?: string;
}) {
  const pathname = usePathname();
  return (
    <div
      data-ssgoi-transition={pathname}
      className={cn("relative flex min-h-full flex-col bg-white", className)}
    >
      {topBar}
      <div className="relative z-0 flex flex-1 flex-col">
        <div
          key={pathname}
          data-ssgoi-transition={pathname}
          className={cn("flex flex-1 flex-col bg-white", contentClassName)}
        >
          {children}
        </div>
      </div>
      {nav}
    </div>
  );
}
