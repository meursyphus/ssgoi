// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import { useLocation } from "@solidjs/router";
import { createMemo, splitProps, type JSX } from "solid-js";
import { RouteBoundary } from "../layout-boundary";

/** @deprecated Will be removed in 8.0.0. Declare layout scopes in `config.layouts` and use `SsgoiLayoutBoundary` from "@ssgoi/solid" instead. */
export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

/** @deprecated Will be removed in 8.0.0. Declare layout scopes in `config.layouts` and use `SsgoiLayoutBoundary` from "@ssgoi/solid" instead. */
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
  const state = createMemo(() => {
    const current = local.resolve?.({ pathname: location.pathname }) ?? {
      id: location.pathname,
    };
    return { id: current.id, key: local.routeKey ?? current.key ?? current.id };
  });
  return <RouteBoundary {...rest} state={state} />;
}
