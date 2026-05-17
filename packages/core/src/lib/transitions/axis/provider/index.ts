import { createXProvider } from "./x";
import { createYProvider } from "./y";
import { createZProvider } from "./z";
import type { AxisProvider, AxisType } from "../types";

export const AXIS_PROVIDERS: Record<AxisType, AxisProvider> = {
  x: createXProvider(),
  y: createYProvider(),
  z: createZProvider(),
};
