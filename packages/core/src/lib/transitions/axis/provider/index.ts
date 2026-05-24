import { X_PROVIDERS } from "./x";
import { Y_PROVIDERS } from "./y";
import { Z_PROVIDERS } from "./z";
import type { AxisFeel, AxisProvider, AxisType } from "../types";

// Provider map is 2-dimensional: (axis type, feel). The `snappy` entry is
// always present and acts as the fallback when a flavor isn't implemented for
// a given axis (z aliases snappy → directional, matching y's pattern).
type AxisProviderMap = { snappy: AxisProvider } & Partial<
  Record<AxisFeel, AxisProvider>
>;

export const AXIS_PROVIDERS: Record<AxisType, AxisProviderMap> = {
  x: X_PROVIDERS,
  y: Y_PROVIDERS,
  z: Z_PROVIDERS,
};

export function resolveAxisProvider(
  type: AxisType,
  feel: AxisFeel,
): AxisProvider {
  const providers = AXIS_PROVIDERS[type];
  return providers[feel] ?? providers.snappy;
}
