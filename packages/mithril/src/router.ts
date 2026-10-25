import m from "mithril";

export interface SsgoiRouteBoundaryAttrs {
  /** Defaults to the pathname of m.route.get(), excluding query and hash. */
  path?: string;
  /** Defaults to path; a stable key is useful for persistent layout boundaries. */
  routeKey?: string | number;
  class?: string;
}

/**
 * Put inside a persistent Ssgoi provider in a RouteResolver.render layout.
 * @experimental Router integration API; verify with your route hierarchy.
 */
export const SsgoiRouteBoundary: m.Component<SsgoiRouteBoundaryAttrs> = {
  view({ attrs, children }) {
    const route = attrs.path ?? m.route.get();
    if (
      typeof route !== "string" ||
      (attrs.path !== undefined && route.length === 0)
    ) {
      throw new Error(
        "SsgoiRouteBoundary requires path outside an active m.route router",
      );
    }
    // At a site's bare URL Mithril resolves the root route but route.get()
    // returns "". parsePathname normalizes that valid router state to "/".
    const path = attrs.path ?? m.parsePathname(route).path;
    // The key belongs to the DOM wrapper, not only the routed component.
    // Parameter-only route changes must retain a distinct outgoing subtree.
    // Mithril compares keys inside sibling lists. A lone component root's
    // key is insufficient, so return a single-child keyed fragment.
    return [
      m(
        "div",
        {
          key: attrs.routeKey ?? path,
          "data-ssgoi-transition": path,
          class: attrs.class,
        },
        children,
      ),
    ];
  },
};
