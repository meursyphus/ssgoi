"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Detail-group counterpart of `MobileTabsShell`: a plain per-route pathname
 * boundary for fullscreen screens without the bottom nav. Render it from a
 * `(detail)` route-group layout — the tab shell (nav included) unmounts on
 * entry, so SSGOI pairs this boundary with the leaving shell boundary and
 * detail screens are nav-free by construction.
 *
 * Like `MobileTabsShell`, this is a plain element carrying `key` +
 * `data-ssgoi-transition`, not `SsgoiRouteBoundary`, which wraps itself in a
 * `<Suspense>`. That Suspense is new on tab → detail, so a detail whose
 * client chunk was not loaded yet committed as its empty fallback: the tab
 * shell was already gone and the frame stayed blank for React's ~300 ms
 * reveal throttle. The scroll container clamped to 0 in that gap and SSGOI
 * recorded it as the tab's position, so the leaving shell was drawn at its
 * top and Back restored 0. Without it, the suspension reaches the demo
 * layout's already-visible `<Suspense>`, the tab shell stays on screen, and
 * both change in one commit.
 */
export function MobileDetailShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div
      key={pathname}
      data-ssgoi-transition={pathname}
      className={cn("h-full min-h-full bg-white", className)}
    >
      {children}
    </div>
  );
}
