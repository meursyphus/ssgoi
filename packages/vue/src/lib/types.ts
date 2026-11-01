export * from "@ssgoi/core/types";

/**
 * Router bridge for `SsgoiLayoutBoundary`, passed to `<Ssgoi :framework>`.
 * `getRoute` must be a reactive getter, e.g.
 * `() => ({ pathname: router.currentRoute.value.path })`. Extra fields reach
 * the boundary's `resolve` as returned.
 */
export interface SsgoiFramework {
  getRoute: () => { pathname: string; [key: string]: unknown };
}
