// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
"use client";

import type { ElementType } from "react";
import { useRouterState } from "@tanstack/react-router";
import { FrameworkBoundary, type SsgoiFramework } from "../layout-boundary";
import {
  toBoundary,
  type RouteBoundaryProps,
  type RouteBoundaryState as RootRouteBoundaryState,
  type RouteLocation,
} from "./route-boundary";

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<RouteLocation, T>;

const framework: SsgoiFramework = {
  useRoute: () => ({ pathname: useRouterState({ select: renderedPathname }) }),
};

/**
 * @experimental TanStack Router integration. The API may change.
 *
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export function SsgoiRouteBoundary<T extends ElementType = "div">({
  resolve,
  routeKey,
  ...props
}: SsgoiRouteBoundaryProps<T>) {
  return (
    <FrameworkBoundary
      {...props}
      boundary={toBoundary(resolve, routeKey)}
      framework={framework}
    />
  );
}

/**
 * The path of the leaf match the outlet is rendering. TanStack Router moves
 * `location` before pending matches render, so keying by it re-keys the
 * boundary while the outlet still shows the outgoing page: the incoming
 * boundary holds the old screen, and shared-element effects like zoom find
 * no target. Index routes match as "/parent/", so the location's own
 * trailing-slash style wins.
 */
function renderedPathname(state: {
  location: { pathname: string };
  matches?: ReadonlyArray<{ pathname: string }>;
}): string {
  const location = state.location.pathname;
  const leaf = state.matches?.[state.matches.length - 1]?.pathname;
  if (!leaf) return location;
  return leaf.length > 1 && leaf.endsWith("/") && !location.endsWith("/")
    ? leaf.slice(0, -1)
    : leaf;
}

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type RouteBoundaryState = RootRouteBoundaryState;
