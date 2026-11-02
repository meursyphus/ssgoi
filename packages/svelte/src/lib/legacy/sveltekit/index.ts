// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
/**
 * @experimental SvelteKit route boundary.
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/svelte" with `<Ssgoi framework={...}>` instead.
 */
export { default as SsgoiRouteBoundary } from "./ssgoi-route-boundary.svelte";
export type {
  RouteBoundaryState,
  SveltekitRouteLocation,
  SsgoiRouteBoundaryProps,
} from "./types.js";
