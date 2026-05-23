import { BlurBackgroundStrategy, OverlayStrategy, createBlurProvider } from "./blur";
import { ExpandBackgroundStrategy, createExpandProvider } from "./expand";
import { StaticBackgroundStrategy, createStaticProvider } from "./static";
import type { ZoomProvider, ZoomStrategy, ZoomType } from "../types";
import type { PhysicsOptions } from "@types";

/* ────────────────────────────────────────────────────────────────────────────
 * Legacy lookup — preserved for back-compat. The new transition.ts no longer
 * reads from this map; it uses the strategy factory below.
 * ──────────────────────────────────────────────────────────────────────────── */

export const ZOOM_PROVIDERS: Record<ZoomType, ZoomProvider> = {
  expand: createExpandProvider(),
  static: createStaticProvider(),
  blur: createBlurProvider(),
};

/* ────────────────────────────────────────────────────────────────────────────
 * BackgroundStrategy factory — table-driven dispatch on `ZoomType`. Returns
 * a fresh instance per call so each transition has its own physics
 * integrator state. No `if/switch` on type at the call-site.
 * ──────────────────────────────────────────────────────────────────────────── */

export type BackgroundStrategyWithPhysics = ZoomStrategy & {
  physics: PhysicsOptions;
};

const BACKGROUND_STRATEGIES: Record<ZoomType, () => BackgroundStrategyWithPhysics> = {
  expand: () => new ExpandBackgroundStrategy(),
  static: () => new StaticBackgroundStrategy(),
  blur: () => new BlurBackgroundStrategy(),
};

export function createBackgroundStrategy(type: ZoomType): BackgroundStrategyWithPhysics {
  return BACKGROUND_STRATEGIES[type]();
}

export {
  BlurBackgroundStrategy,
  ExpandBackgroundStrategy,
  OverlayStrategy,
  StaticBackgroundStrategy,
};
