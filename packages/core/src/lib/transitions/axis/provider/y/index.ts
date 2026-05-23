import { createDirectionalYProvider } from "./directional";
import { createNonDirectionalYProvider } from "./non-directional";
import type { AxisFeel, AxisProvider } from "../../types";

// Y axis ships two feels — selected by `feel`. There is no separate snappy y;
// `directional` doubles as the snappy alias so unsupported-feel lookups fall
// through to it (matches the AxisProviderMap contract in ../index.ts).
const directional = createDirectionalYProvider();

export const Y_PROVIDERS: { snappy: AxisProvider } & Partial<
  Record<AxisFeel, AxisProvider>
> = {
  snappy: directional,
  directional,
  "non-directional": createNonDirectionalYProvider(),
};
