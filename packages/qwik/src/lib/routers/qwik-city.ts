import { useComputed$, type Signal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export interface RouteBoundaryState {
  id: string;
  key: string | number;
}

/**
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
