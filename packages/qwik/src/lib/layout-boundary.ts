import {
  createContextId,
  useComputed$,
  useContext,
  type Signal,
} from "@builder.io/qwik";

/**
 * Router values `useSsgoiLayoutBoundary` reads. Pass Qwik City's location
 * store as a value: `{ location: useLocation() }`.
 */
export interface SsgoiFramework {
  location: { url: URL };
}

export interface SsgoiLayoutBoundaryState {
  id: string;
  key: string | number;
}

/** A fixed key (string), or a fixed id and/or key. Defaults: id = pathname, key = id. */
type BoundaryInput = string | { id?: string; key?: string | number };

export const SsgoiFrameworkContextId = createContextId<SsgoiFramework | null>(
  "ssgoi.framework",
);

/** @internal Shared by `useSsgoiLayoutBoundary` and the deprecated `useSsgoiRouteBoundary`. */
export const useLocationBoundary = (
  location: SsgoiFramework["location"],
  boundary?: BoundaryInput,
): Signal<SsgoiLayoutBoundaryState> => {
  return useComputed$(() => {
    const result =
      typeof boundary === "string" ? { key: boundary } : (boundary ?? {});
    const id = result.id ?? location.url.pathname;
    return { id, key: result.key ?? id };
  });
};

/**
 * Route boundary for a page or layout root under `<Ssgoi framework>` (or
 * `useSsgoi(root, { framework })`). Apply id and key to the route's own DOM
 * root. Keeping Slot ownership in the route avoids moving projected content
 * between outgoing and incoming pages.
 *
 * `boundary` is a fixed key (e.g. `"products-layout"` for a persistent shell)
 * or `{ id?, key? }`. Defaults: id = pathname, key = id.
 */
export function useSsgoiLayoutBoundary(
  boundary?: BoundaryInput,
): Signal<SsgoiLayoutBoundaryState> {
  const framework = useContext(SsgoiFrameworkContextId, null);
  if (!framework) {
    throw new Error(
      "SSGOI: useSsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ location: useLocation() }}> or useSsgoi(root, { framework: { location: useLocation() } }).",
    );
  }
  return useLocationBoundary(framework.location, boundary);
}
