import { createBackgroundScaleProvider } from "./background-scale";
import { createBlurProvider } from "./blur";
import { createStaticProvider } from "./static";
import type { SheetProvider, SheetType } from "../types";

export const SHEET_PROVIDERS: Record<SheetType, SheetProvider> = {
  static: createStaticProvider(),
  "background-scale": createBackgroundScaleProvider(),
  blur: createBlurProvider(),
};
