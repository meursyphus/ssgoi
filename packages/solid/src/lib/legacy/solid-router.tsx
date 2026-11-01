// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import { useLocation } from "@solidjs/router";
import { splitProps, type JSX } from "solid-js";
import { RouteBoundary } from "../layout-boundary";

/** @deprecated Will be removed in 8.0.0. Use the object form of `SsgoiLayoutBoundary`'s `boundary` prop from "@ssgoi/solid" instead. */
export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

/** @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundaryProps` from "@ssgoi/solid" instead. */
export type SsgoiRouteBoundaryProps = JSX.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  routeKey?: string | number;
  resolve?: (location: { pathname: string }) => RouteBoundaryState;
};

/**
 * @experimental Solid Router integration, including SolidStart. The API may change.
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/solid" with `<Ssgoi framework={{ getRoute: () => ({ pathname: location.pathname }) }}>` (`useLocation` from "@solidjs/router") instead.
 */
export function SsgoiRouteBoundary(props: SsgoiRouteBoundaryProps) {
  const location = useLocation();
  const [local, rest] = splitProps(props, ["resolve", "routeKey"]);
  const framework = { getRoute: () => ({ pathname: location.pathname }) };
  const boundary = (route: { pathname: string }) => {
    const state = local.resolve?.(route) ?? { id: route.pathname };
    return { id: state.id, key: local.routeKey ?? state.key ?? state.id };
  };
  return (
    <RouteBoundary {...rest} framework={() => framework} boundary={boundary} />
  );
}
