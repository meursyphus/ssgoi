import { X_PROVIDERS } from "./x";
import { createYProvider } from "./y";
import { createZProvider } from "./z";
import type { AxisFeel, AxisProvider, AxisType } from "../types";

// Provider map is 2-dimensional: (axis type, feel). The `snappy` entry is
// always present and acts as the fallback when a flavor isn't implemented for
// a given axis (currently y and z).
type AxisProviderMap = { snappy: AxisProvider } & Partial<
  Record<AxisFeel, AxisProvider>
>;

const yProvider = createYProvider();
const zProvider = createZProvider();

export const AXIS_PROVIDERS: Record<AxisType, AxisProviderMap> = {
  x: X_PROVIDERS,
  // y and z don't yet have a `fluid` variant — the lookup falls back to
  // `snappy` if asked for `fluid` on them.
  y: { snappy: yProvider },
  z: { snappy: zProvider },
};

export function resolveAxisProvider(
  type: AxisType,
  feel: AxisFeel,
): AxisProvider {
  const providers = AXIS_PROVIDERS[type];
  return providers[feel] ?? providers.snappy;
}
