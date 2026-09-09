import { createStandardNavigator } from "standard-navigation";
import { StackRouter, unstable_integrateWithRouter } from "expo-router";
import type {
  StackNavigationState,
  StackRouterOptions,
  ParamListBase,
} from "expo-router/react-navigation";
import {
  NativeNavigator,
  type BoundaryOptions,
  type NavigatorEvents,
  type ScreenOptions,
} from "./navigator.js";

const navigator = createStandardNavigator<
  ScreenOptions,
  NavigatorEvents,
  BoundaryOptions
>(NativeNavigator);
// Keep the alpha Expo API confined to this optional entry point.
if (typeof unstable_integrateWithRouter !== "function") {
  throw new Error(
    "SSGOI: the expo-router entry requires Expo Router's standard navigator API (validated with 56.2.20).",
  );
}
const ExpoBoundary = unstable_integrateWithRouter<
  ScreenOptions,
  StackNavigationState<ParamListBase>,
  NavigatorEvents,
  BoundaryOptions,
  StackRouterOptions
>(navigator, StackRouter, { useOnlyUserDefinedScreens: false });

export interface SsgoiRouteBoundaryProps extends BoundaryOptions {
  initialRouteName?: string;
}
/** Place in app/_layout.tsx. Expo discovers page files; no manual Screen list is required. */
export function SsgoiRouteBoundary(props: SsgoiRouteBoundaryProps) {
  return <ExpoBoundary {...props} />;
}
export type { ExpoRouteLocation } from "./navigator.js";
export type { RouteBoundaryState } from "./types.js";
