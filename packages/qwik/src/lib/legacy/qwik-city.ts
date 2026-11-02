// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import { useComputed$, type Signal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

/**
 * @deprecated Will be removed in 8.0.0. Use the state returned by
 * `useSsgoiLayoutBoundary` from "@ssgoi/qwik" instead.
 */
export interface RouteBoundaryState {
  id: string;
  key: string | number;
}

/**
 * @deprecated Will be removed in 8.0.0. Use `useSsgoiLayoutBoundary` from
 * "@ssgoi/qwik" with `<Ssgoi framework={{ location: useLocation() }}>` instead.
 *
 * @experimental Qwik City route boundary helper. The API may change.
 * Apply id and key to the page's own DOM root. Keeping Slot ownership in the
 * route avoids moving projected content between outgoing and incoming pages.
 */
export function useSsgoiRouteBoundary(
  routeKey?: string | number,
): Signal<RouteBoundaryState> {
  const location = useLocation();
  return useComputed$(() => ({
    id: location.url.pathname,
    key: routeKey ?? location.url.pathname,
  }));
}
