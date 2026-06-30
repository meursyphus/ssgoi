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
export type SheetType = "static" | "background-scale" | "blur";
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

/**
 * A separate full-viewport layer that sits *between* the background page and
 * the foreground sheet (at `Z_OVERLAY`). Used by the `blur` tone to drive a
 * `backdrop-filter` independently of the background's own clip + scale — the
 * background recedes (clipped, scaled) while this layer frosts it uniformly,
 * the way the zoom `blur` tone separates its blur overlay from the tile.
 */
export interface SheetOverlayConfig {
  willChange: string;
  initialStyle: Record<string, string>;
  /** `progress` is the raw animation t (0 → 1) for the active direction. */
  style: (direction: SheetDirection, progress: number) => SheetStyle;
}

export interface SheetProvider {
  enterPhysics: PhysicsOptions;
  exitPhysics: PhysicsOptions;
  background: SheetBackgroundConfig;
  /** Only set by tones that need a backdrop-filter layer (currently `blur`). */
  overlay?: SheetOverlayConfig;
}
