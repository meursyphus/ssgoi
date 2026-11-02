export * from "@ssgoi/core/types";

/**
 * Router bridge for `<Ssgoi framework>`. `getRoute` must be reactive, e.g.
 * `() => ({ pathname: location.pathname })` with `useLocation()` from Solid
 * Router. `renderedPath`, when given, is the path the page content shows.
 */
export interface SsgoiFramework {
  getRoute: () => { pathname: string; renderedPath?: string };
}
