"use client";

import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface RouteBoundaryState {
  id: string;
  /** Defaults to id. Keep this stable while a nested layout owns navigation. */
  key?: string | number;
}

export interface RouteLocation {
  pathname: string;
}

export type RouteBoundaryProps<
  Location extends RouteLocation = RouteLocation,
  T extends ElementType = "div",
> = {
  children?: ReactNode;
  as?: T;
  /** A stable lifetime for a boundary inside a persistent route layout. */
  routeKey?: string | number;
  /** Resolve the logical route and its lifetime together during render. */
  resolve?: (location: Location) => RouteBoundaryState;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "children" | "resolve" | "routeKey"
>;

export function RouteBoundary({
  boundary,
  routeKey,
  as,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  routeKey?: string | number;
  boundary: RouteBoundaryState;
}) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      {...rest}
      key={routeKey ?? boundary.key ?? boundary.id}
      data-ssgoi-transition={boundary.id}
    >
      {children}
    </Component>
  );
}
