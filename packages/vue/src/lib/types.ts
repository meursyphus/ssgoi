export * from "@ssgoi/core/types";

/**
 * Router bridge for `<Ssgoi :framework>`. `getRoute` must be a reactive
 * getter, e.g. `() => ({ pathname: router.currentRoute.value.path })`.
 * `renderedPath`, when given, is the path the page content shows.
 */
export interface SsgoiFramework {
  getRoute: () => { pathname: string; renderedPath?: string };
}
