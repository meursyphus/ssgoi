// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
"use client";

import type { RouteBoundaryState as RootRouteBoundaryState } from "../route-boundary";

export { SsgoiRouteBoundary } from "./ssgoi-route-boundary";
export type {
  SsgoiRouteBoundaryProps,
  NextjsRouteLocation,
} from "./ssgoi-route-boundary";
export { selectedSegmentsToPath } from "./selected-segments-to-path";

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type RouteBoundaryState = RootRouteBoundaryState;
