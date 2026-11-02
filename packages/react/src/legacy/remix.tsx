// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
"use client";

import type { ElementType } from "react";
import { useLocation } from "@remix-run/react";
import {
  RouteBoundary,
  type UseRoute,
  type RouteBoundaryProps,
  type RouteBoundaryState as RootRouteBoundaryState,
} from "./route-boundary";

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type RemixRouteLocation = ReturnType<typeof useLocation>;
/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<RemixRouteLocation, T>;

const useRoute: UseRoute = () => useLocation();

/**
 * @experimental Remix 2 integration. The API may change.
 *
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export function SsgoiRouteBoundary<T extends ElementType = "div">(
  props: SsgoiRouteBoundaryProps<T>,
) {
  return <RouteBoundary {...props} useRoute={useRoute} />;
}

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type RouteBoundaryState = RootRouteBoundaryState;
