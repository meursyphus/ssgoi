"use client";

import { type ElementType, type Key, type ReactNode } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";

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
  return (
    <SsgoiRouteBoundary
      as={as}
      className={className}
      resolve={({ pathname }) => ({
        id: id ?? pathname,
        key: scope(pathname).toString(),
      })}
    >
      {children}
    </SsgoiRouteBoundary>
  );
}
