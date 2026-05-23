import type { PhysicsOptions } from "@types";

/**
 * Internal type union accepted by the underlying `drill` transition provider.
 *
 * Public API uses `"slide"` (the new name for the previous `"crossfade"`
 * behavior). The `"crossfade"` key is retained here purely so the BC
 * normalization in `index.ts` can keep routing through the same provider
 * without touching the internal transition / provider code.
 *
 * @internal
 */
export type DrillType = "parallax" | "crossfade";
export type DrillDirection = "enter" | "exit";

export interface DrillOptions {
  type?: DrillType;
  direction?: DrillDirection;
}

export type DrillStyle = Record<string, number | string>;
export type DrillAnimateFunc = (progress: number) => DrillStyle;

export interface DrillSideConfig {
  willChange: string;
  startStyle: DrillStyle;
  animate: DrillAnimateFunc;
}

export interface DrillAnimationConfig {
  out: DrillSideConfig;
  in: DrillSideConfig;
}

export interface DrillProvider {
  physics: PhysicsOptions;
  build: (direction: DrillDirection) => DrillAnimationConfig;
}
