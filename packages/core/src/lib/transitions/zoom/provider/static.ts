import type { PhysicsOptions } from "@types";
import type { ZoomContributeCtx, ZoomStrategy } from "../types";
import { Animation } from "../../../animation";

export const STATIC_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 530,
    damping: 34,
    doubleSpring: 1,
  },
};

/* ────────────────────────────────────────────────────────────────────────────
 * Strategy: the `static` type leaves the background page untouched. The
 * background-side contribution is therefore empty — the tile motion alone
 * drives the visual. We still own physics so the rest of the transition
 * (tile, fade, crossfade) shares one spring.
 * ──────────────────────────────────────────────────────────────────────────── */

export class StaticBackgroundStrategy implements ZoomStrategy {
  readonly name = "background";
  readonly physics = STATIC_PHYSICS;

  contribute(_ctx: ZoomContributeCtx): Animation[] {
    return [];
  }
}
