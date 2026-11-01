// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import { useMemo } from "react";
import { StackRouter, unstable_integrateWithRouter } from "expo-router";
import {
  integrateExpoBoundary,
  type SsgoiFramework,
  type SsgoiLayoutBoundaryProps,
} from "../layout-boundary.js";
import type { ExpoRouteLocation as RootExpoRouteLocation } from "../navigator.js";
import type { RouteBoundaryState as RootRouteBoundaryState } from "../types.js";

// Keep the alpha Expo API confined to this optional entry point.
const framework: SsgoiFramework = { StackRouter, unstable_integrateWithRouter };
const ExpoBoundary = integrateExpoBoundary(framework, "the expo-router entry");

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/react-native" with `<Ssgoi framework={{ StackRouter, unstable_integrateWithRouter }}>` instead.
 */
export interface SsgoiRouteBoundaryProps
  extends Omit<SsgoiLayoutBoundaryProps, "boundary"> {
  /** Evaluated against each screen's own route, including retained screens. */
  resolve?: (location: RootExpoRouteLocation) => RootRouteBoundaryState;
  /** Scoped by the native route key; never merges distinct pushed screen instances. */
  routeKey?: string | number;
}
/**
 * @experimental Expo Router integration. The API may change.
 * Place in app/_layout.tsx. Expo discovers page files; no manual Screen list is required.
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/react-native" with `<Ssgoi framework={{ StackRouter, unstable_integrateWithRouter }}>` instead.
 */
export function SsgoiRouteBoundary({
  resolve,
  routeKey,
  ...props
}: SsgoiRouteBoundaryProps) {
  // Memoized so an unchanged resolve/routeKey does not reconcile the stack on every render.
  const boundary = useMemo<SsgoiLayoutBoundaryProps["boundary"]>(
    () => (location) => {
      const resolved = resolve?.(location) ?? { id: location.pathname };
      return { id: resolved.id, key: routeKey ?? resolved.key };
    },
    [resolve, routeKey],
  );
  return <ExpoBoundary {...props} boundary={boundary} />;
}
/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/react-native" with `<Ssgoi framework={{ StackRouter, unstable_integrateWithRouter }}>` instead.
 */
export type ExpoRouteLocation = RootExpoRouteLocation;
/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/react-native" with `<Ssgoi framework={{ StackRouter, unstable_integrateWithRouter }}>` instead.
 */
export type RouteBoundaryState = RootRouteBoundaryState;
