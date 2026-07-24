import { type ElementType, type Key, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

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
  scope?: BoundaryScope;
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
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
