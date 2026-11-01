import {
  createContextId,
  useComputed$,
  useContext,
  useContextProvider,
  type Signal,
} from "@builder.io/qwik";

/**
 * Router values the provider reads. Pass Qwik City's location store as a
 * value: `{ location: useLocation() }`.
 */
export interface SsgoiFramework {
  location: { url: URL };
}

/** The route resolved once at the provider and shared with every boundary. */
export interface SsgoiLayoutRoute {
  routePath: string;
  chain: string[];
}

export const SsgoiRouteContextId =
  createContextId<Signal<SsgoiLayoutRoute> | null>("ssgoi.route");

const SsgoiLayoutDepthContextId = createContextId<{ depth: number }>(
  "ssgoi.layout-depth",
);

/**
 * Keyed boundary for the route or layout that calls it. Apply id and key to
 * that component's own DOM root. A root that wraps `<Slot />` must keep its
 * key while the layout is mounted: Qwik moves projected content into a
 * replacing element, leaving the outgoing one empty.
 *
 * Depth is automatic: a boundary under another one is one level deeper. The
 * key is the depth's scope instance from `config.layouts`, falling back to
 * the route path, so the root stays mounted while navigation stays inside
 * that scope.
 */
export function useSsgoiLayoutBoundary(): Signal<{ id: string; key: string }> {
  const route = useContext(SsgoiRouteContextId, null);
  if (!route) {
    throw new Error(
      "SSGOI: useSsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ location: useLocation() }}> or useSsgoi(root, { framework: { location: useLocation() } }).",
    );
  }
  const parent = useContext(SsgoiLayoutDepthContextId, null);
  const depth = parent ? parent.depth + 1 : 0;
  useContextProvider(SsgoiLayoutDepthContextId, { depth });

  return useComputed$(() => {
    const { routePath, chain } = route.value;
    return { id: routePath, key: chain[depth] ?? routePath };
  });
}
