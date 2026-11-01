// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

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

/** Maps the deprecated `resolve` / `routeKey` props onto `boundary`. */
export function toBoundary<Location extends RouteLocation>(
  resolve: ((location: Location) => RouteBoundaryState) | undefined,
  routeKey: string | number | undefined,
) {
  return (route: Location) => {
    const boundary = resolve?.(route) ?? { id: route.pathname };
    return { id: boundary.id, key: routeKey ?? boundary.key ?? boundary.id };
  };
}
