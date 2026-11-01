// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
/**
 * @experimental SolidStart integration through Solid Router. The API may change.
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/solid" with `<Ssgoi framework={{ getRoute: () => ({ pathname: location.pathname }) }}>` (`useLocation` from "@solidjs/router") instead.
 */
export { SsgoiRouteBoundary } from "./solid-router";
export type {
  /** @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundaryProps` from "@ssgoi/solid" instead. */
  SsgoiRouteBoundaryProps,
  /** @deprecated Will be removed in 8.0.0. Use the return type of `SsgoiLayoutBoundaryProps["resolve"]` from "@ssgoi/solid" instead. */
  RouteBoundaryState,
} from "./solid-router";
