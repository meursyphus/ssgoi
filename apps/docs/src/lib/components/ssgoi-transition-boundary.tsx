"use client";

import { type ElementType, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
  id,
  stableKey = false,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  /**
   * Pin the React key while `data-ssgoi-transition` keeps tracking the route.
   * For shell boundaries that must survive child-route changes (e.g. a tab
   * shell owning a bottom nav): no remount means the owning provider sees no
   * OUT/IN on tab↔tab, but on a real unmount (tab→detail) ssgoi reads the
   * attribute at that moment, so path-based matching still works.
   */
  stableKey?: boolean;
}) {
  const pathname = usePathname();
  const transitionId = id ?? pathname;
  const Component = as ?? "div";

  return (
    <Component
      key={stableKey ? "ssgoi-stable-boundary" : transitionId}
      data-ssgoi-transition={transitionId}
      className={className}
    >
      {children}
    </Component>
  );
}
