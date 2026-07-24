"use client";

import { type ElementType, type Key, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export type BoundaryScope = (pathname: string) => Key;

const pathnameScope: BoundaryScope = (pathname) => pathname;

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
  scope = pathnameScope,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /**
   * Maps the real pathname to the React key for this boundary.
   * Return the same key to keep the layout mounted across those routes.
   */
  scope?: BoundaryScope;
}) {
  const pathname = usePathname();
  const Component = as ?? "div";
  const boundaryKey = scope(pathname);

  return (
    <Component
      key={boundaryKey}
      data-ssgoi-transition={pathname}
      className={className}
    >
      {children}
    </Component>
  );
}
