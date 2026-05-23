import type { PhysicsOptions } from "@types";
import type {
  ZoomAnimationConfig,
  ZoomContributeCtx,
  ZoomProvider,
  ZoomStrategy,
} from "../types";
import { Animation } from "../../../animation";
import { createZoomIn, createZoomOut } from "../zoom-element";

export const STATIC_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 420, damping: 34 },
};

function noopAnimation(): ZoomAnimationConfig {
  return {
    transformOrigin: "",
    animate: () => ({}),
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * Strategy: the `static` type leaves the background page untouched. The
 * background-side contribution is therefore empty — the tile motion alone
 * drives the visual. We still own physics so the rest of the transition
 * (tile, fade, crossfade) shares one spring.
 * ──────────────────────────────────────────────────────────────────────────── */

export class StaticBackgroundStrategy implements ZoomStrategy {
  readonly physics = STATIC_PHYSICS;

  contribute(_ctx: ZoomContributeCtx): Animation[] {
    return [];
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Legacy provider export — preserves the v5 shape for back-compat.
 * ──────────────────────────────────────────────────────────────────────────── */

export function createStaticProvider(): ZoomProvider {
  return {
    physics: STATIC_PHYSICS,
    in: createZoomIn,
    out: createZoomOut,
    backgroundIn: () => noopAnimation(),
    backgroundOut: () => noopAnimation(),
  };
}
