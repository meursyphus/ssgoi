// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
"use client";

import type { ElementType } from "react";
import { useLocation, type Location } from "react-router";
import { FrameworkBoundary, type SsgoiFramework } from "../layout-boundary";
import {
  toBoundary,
  type RouteBoundaryProps,
  type RouteBoundaryState as RootRouteBoundaryState,
} from "./route-boundary";

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<Location, T>;

const framework: SsgoiFramework = { useRoute: () => useLocation() };

/**
 * @experimental React Router integration. The API may change.
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
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type RouteBoundaryState = RootRouteBoundaryState;
