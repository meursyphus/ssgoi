export * from "@ssgoi/core/types";

/**
 * Router bridge for `SsgoiLayoutBoundary`, passed to `<Ssgoi framework>`.
 * `getRoute` must be reactive, e.g. `() => ({ pathname: location.pathname })`
 * with `useLocation()` from Solid Router. Extra fields reach the boundary's
 * `resolve` as returned.
 */
export interface SsgoiFramework {
  getRoute: () => { pathname: string; [key: string]: unknown };
}
