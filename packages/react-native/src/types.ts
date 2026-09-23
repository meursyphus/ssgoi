import type {
  PhysicsOptions,
  RouteConfig,
  RouteRule,
  TransitionsResolverArgs,
} from "@ssgoi/core/runtime";

/** Native presets carry data, so no DOM or JS callback crosses into the UI runtime. */
export type NativeTransition = {
  readonly platform: "ssgoi-native";
  readonly kind: "fade" | "slide";
  readonly physics?: PhysicsOptions;
};
/** Mounted native screens retain their own scroll; explicit restoration is not implemented yet. */
export type SsgoiTransitionRule = RouteRule<NativeTransition> & {
  preserveScroll?: never;
};
export type SsgoiConfig = Omit<RouteConfig<NativeTransition>, "transitions"> & {
  transitions?:
    | readonly SsgoiTransitionRule[]
    | ((args: TransitionsResolverArgs) => readonly SsgoiTransitionRule[]);
};
export type {
  PhysicsOptions,
  SpringConfig,
  InertiaConfig,
  NavigationDirection,
} from "@ssgoi/core/runtime";

export type RouteBoundaryState = { id: string; key?: string | number };
