import { createDirectionalZProvider } from "./directional";
import { createNonDirectionalZProvider } from "./non-directional";
import type { AxisFeel, AxisProvider } from "../../types";

// Z axis ships two feels — directional (forward/backward both move in the
// same scale direction; out grows past viewer, in emerges from depth) and
// non-directional (out fade-only, in always emerges by scaling up). There is
// no separate snappy z; `directional` doubles as the snappy alias so
// unsupported-feel lookups still resolve under the AxisProviderMap contract
// in ../index.ts. Mirrors the y provider's structure.
const directional = createDirectionalZProvider();

export const Z_PROVIDERS: { snappy: AxisProvider } & Partial<
  Record<AxisFeel, AxisProvider>
> = {
  snappy: directional,
  directional,
  "non-directional": createNonDirectionalZProvider(),
};
