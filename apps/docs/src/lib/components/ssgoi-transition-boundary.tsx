"use client";

import { type ElementType, type Key, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export type BoundaryScope = (pathname: string) => Key;

const pathnameScope: BoundaryScope = (pathname) => pathname;

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
  id,
  scope = pathnameScope,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  /**
   * Maps the current pathname to this boundary's React key. Returning the same
   * key keeps a persistent layout mounted while its transition id continues
   * to track the real route.
   */
  scope?: BoundaryScope;
}) {
  const pathname = usePathname();
  const transitionId = id ?? pathname;
  const Component = as ?? "div";

  return (
    <Component
      key={scope(pathname)}
      data-ssgoi-transition={transitionId}
      className={className}
    >
      {children}
    </Component>
  );
}
