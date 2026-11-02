import type { ComponentType } from "react";
import type { StandardNavigator } from "standard-navigation";
import {
  NativeNavigator,
  type BoundaryOptions,
  type NavigatorEvents,
  type ScreenOptions,
} from "./navigator.js";
import { useSsgoi } from "./ssgoi.js";

export interface SsgoiLayoutBoundaryProps extends BoundaryOptions {
  initialRouteName?: string;
}
/**
 * The Expo Router primitives the layout boundary integrates with, typed only by
 * the members it uses so the root entry never imports Expo Router.
 * @example <Ssgoi framework={{ StackRouter, unstable_integrateWithRouter }}>
 */
export interface SsgoiFramework {
  StackRouter: object;
  // Method syntax keeps Expo's generic parameters assignable to these opaque ones.
  unstable_integrateWithRouter(
    navigator: object,
    router: object,
    options?: { useOnlyUserDefinedScreens?: boolean },
  ): ComponentType<SsgoiLayoutBoundaryProps>;
}

// Mirrors createStandardNavigator from standard-navigation 0.0.9 (guarded by a test). Inlined
// because the package ships only `main`, which the native isolation bundle cannot resolve.
const navigator = {
  type: "standard",
  version: 1,
  NavigatorContent: NativeNavigator,
} as const satisfies StandardNavigator<
  ScreenOptions,
  NavigatorEvents,
  BoundaryOptions
>;
// Keyed by the primitives, not the framework object, so an inline framework never remounts the stack.
const boundaries = new WeakMap<
  object,
  WeakMap<object, ComponentType<SsgoiLayoutBoundaryProps>>
>();

/** Integrates the native navigator with Expo Router once per pair of primitives. */
export function integrateExpoBoundary(
  framework: SsgoiFramework,
  owner: string,
): ComponentType<SsgoiLayoutBoundaryProps> {
  const integrate = framework.unstable_integrateWithRouter;
  // Keep the alpha Expo API behind a runtime check; its shape may change between releases.
  if (typeof integrate !== "function") {
    throw new Error(
      `SSGOI: ${owner} requires Expo Router's standard navigator API (validated with 56.2.20).`,
    );
  }
  let byRouter = boundaries.get(integrate);
  if (!byRouter) boundaries.set(integrate, (byRouter = new WeakMap()));
  let boundary = byRouter.get(framework.StackRouter);
  if (!boundary) {
    boundary = framework.unstable_integrateWithRouter(
      navigator,
      framework.StackRouter,
      { useOnlyUserDefinedScreens: false },
    );
    byRouter.set(framework.StackRouter, boundary);
  }
  return boundary;
}

/**
 * @experimental Expo Router integration. The API may change.
 * Place in app/_layout.tsx inside <Ssgoi framework={{ StackRouter, unstable_integrateWithRouter }}>.
 * Expo discovers page files; no manual Screen list is required.
 */
export function SsgoiLayoutBoundary(props: SsgoiLayoutBoundaryProps) {
  const { framework } = useSsgoi();
  if (!framework) {
    throw new Error(
      "SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ StackRouter, unstable_integrateWithRouter }}>.",
    );
  }
  const Boundary = integrateExpoBoundary(framework, "SsgoiLayoutBoundary");
  return <Boundary {...props} />;
}
