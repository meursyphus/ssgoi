import { createCrossfadeProvider } from "./crossfade";
import { createParallaxProvider } from "./parallax";
import type { DrillProvider, DrillType } from "../types";

export const DRILL_PROVIDERS: Record<DrillType, DrillProvider> = {
  parallax: createParallaxProvider(),
  crossfade: createCrossfadeProvider(),
};
