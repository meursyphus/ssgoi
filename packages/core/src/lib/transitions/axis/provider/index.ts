import { X_PROVIDERS } from "./x";
import { Y_PROVIDERS } from "./y";
import { createZProvider } from "./z";
import type { AxisFeel, AxisProvider, AxisType } from "../types";

// Provider map is 2-dimensional: (axis type, feel). The `snappy` entry is
// always present and acts as the fallback when a flavor isn't implemented for
// a given axis (z, and any unsupported feel asked of x or y).
type AxisProviderMap = { snappy: AxisProvider } & Partial<
  Record<AxisFeel, AxisProvider>
>;

const zProvider = createZProvider();

export const AXIS_PROVIDERS: Record<AxisType, AxisProviderMap> = {
  x: X_PROVIDERS,
  y: Y_PROVIDERS,
  z: { snappy: zProvider },
};

export function resolveAxisProvider(
  type: AxisType,
  feel: AxisFeel,
): AxisProvider {
  const providers = AXIS_PROVIDERS[type];
  return providers[feel] ?? providers.snappy;
}
