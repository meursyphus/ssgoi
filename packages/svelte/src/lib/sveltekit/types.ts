import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

export interface SveltekitRouteLocation {
  pathname: string;
  url: URL;
}

export interface SsgoiRouteBoundaryProps extends HTMLAttributes<HTMLElement> {
  children: Snippet;
  as?: keyof HTMLElementTagNameMap;
  routeKey?: string | number;
  resolve?: (location: SveltekitRouteLocation) => RouteBoundaryState;
}
