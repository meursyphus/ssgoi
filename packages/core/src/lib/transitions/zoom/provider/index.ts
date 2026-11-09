import { BlurBackgroundStrategy, OverlayStrategy } from "./blur";
import { ExpandBackgroundStrategy } from "./expand";
import { StaticBackgroundStrategy } from "./static";
import type { ZoomStrategy, ZoomType } from "../types";
import type { PhysicsOptions } from "@types";

/* ────────────────────────────────────────────────────────────────────────────
 * BackgroundStrategy factory — table-driven dispatch on `ZoomType`. Returns
 * a fresh instance per call so each transition has its own physics
 * integrator state. No `if/switch` on type at the call-site.
 * ──────────────────────────────────────────────────────────────────────────── */

export type BackgroundStrategyWithPhysics = ZoomStrategy & {
  /** Physics for `enter` (tile expands) — and for `exit` unless overridden. */
  physics: PhysicsOptions;
  /** Optional faster/slower physics for `exit` (tile shrinks back). */
  exitPhysics?: PhysicsOptions;
};

const BACKGROUND_STRATEGIES: Record<
  ZoomType,
  () => BackgroundStrategyWithPhysics
> = {
  expand: () => new ExpandBackgroundStrategy(),
  static: () => new StaticBackgroundStrategy(),
  blur: () => new BlurBackgroundStrategy(),
};

export function createBackgroundStrategy(
  type: ZoomType,
): BackgroundStrategyWithPhysics {
  return BACKGROUND_STRATEGIES[type]();
}

export {
  BlurBackgroundStrategy,
  ExpandBackgroundStrategy,
  OverlayStrategy,
  StaticBackgroundStrategy,
};
