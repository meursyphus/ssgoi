import type { PhysicsOptions } from "@types";

/**
 * Internal type union accepted by the underlying `sheet` transition provider.
 *
 * Public API uses `"scale"` (the new name for `"background-scale"`). The
 * `"background-scale"` key is retained here purely so the BC normalization
 * in `index.ts` can keep routing through the same provider without touching
 * the internal transition / provider code.
 *
 * @internal
 */
export type SheetType = "static" | "background-scale";
export type SheetDirection = "enter" | "exit";

export interface SheetOptions {
  type?: SheetType;
  direction?: SheetDirection;
}

export type SheetStyle = Record<string, number | string>;

export interface SheetBackgroundConfig {
  willChange: string;
  enterStyle: (t: number, u: number) => SheetStyle;
  exitStyle: (t: number) => SheetStyle;
}

export interface SheetProvider {
  enterPhysics: PhysicsOptions;
  exitPhysics: PhysicsOptions;
  background: SheetBackgroundConfig;
}
