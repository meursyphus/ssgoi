// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

/** @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/svelte" with `<Ssgoi framework={...}>` instead. */
export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

/** @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/svelte" with `<Ssgoi framework={...}>` instead. */
export interface SveltekitRouteLocation {
  pathname: string;
  url: URL;
}

/** @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundaryProps` from "@ssgoi/svelte" with `<Ssgoi framework={...}>` instead. */
export interface SsgoiRouteBoundaryProps extends HTMLAttributes<HTMLElement> {
  children: Snippet;
  as?: keyof HTMLElementTagNameMap;
  routeKey?: string | number;
  resolve?: (location: SveltekitRouteLocation) => RouteBoundaryState;
}
