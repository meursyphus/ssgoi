import type { PhysicsOptions } from "@types";
import type {
  ZoomAnimationConfig,
  ZoomAnimationInput,
  ZoomContributeCtx,
  ZoomProvider,
  ZoomStrategy,
} from "../types";
import {
  Animation,
  IntegratorProvider,
  WebAnimation,
} from "../../../animation";

export const EXPAND_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 430,
    damping: 33,
    doubleSpring: 1,
  },
};

/**
 * Background page that *shrinks toward the tile* while the foreground tile
 * inflates to fill the page. Used when `mode === "enter"` and the background
 * element is the outgoing page (`from`).
 *
 * The dispatcher feeds `u = 1 → 0` here so the visual direction (full page →
 * tile) matches the original v5 behavior.
 */
function createEnterOut({
  enterRect,
  exitRect,
  scrollOffset,
}: ZoomAnimationInput): ZoomAnimationConfig {
  const dx =
    enterRect.left -
    exitRect.left +
    (enterRect.width - exitRect.width) / 2 +
    scrollOffset.x;
  const dy =
    enterRect.top -
    exitRect.top +
    (enterRect.height - exitRect.height) / 2 +
    scrollOffset.y;

  const scaleX = enterRect.width / exitRect.width;
  const scaleY = enterRect.height / exitRect.height;
  const scale = Math.max(scaleX, scaleY);

  return {
    transformOrigin: `${exitRect.left + exitRect.width / 2}px ${exitRect.top + exitRect.height / 2}px`,
    animate: (progress) => {
      const t = 1 - progress;

      return {
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t}px) scale(${1 + (scale - 1) * t})`,
      };
    },
  };
}

/**
 * Background page that *expands from the tile* while the foreground tile
 * shrinks back to its grid cell. Used when `mode === "exit"` and the
 * background element is the incoming page (`to`). Fed `t = 0 → 1`.
 */
function createExitIn({
  enterRect,
  exitRect,
  scrollOffset,
}: ZoomAnimationInput): ZoomAnimationConfig {
  const dx =
    enterRect.left -
    exitRect.left +
    (enterRect.width - exitRect.width) / 2 -
    scrollOffset.x;
  const dy =
    enterRect.top -
    exitRect.top +
    (enterRect.height - exitRect.height) / 2 -
    scrollOffset.y;

  const scaleX = enterRect.width / exitRect.width;
  const scaleY = enterRect.height / exitRect.height;
  const scale = Math.max(scaleX, scaleY);

  return {
    transformOrigin: `${exitRect.left + exitRect.width / 2}px ${exitRect.top + exitRect.height / 2}px`,
    animate: (progress) => {
      const t = 1 - progress;

      return {
        transform: `translate(${dx * t}px, ${dy * t}px) scale(${1 + (scale - 1) * t})`,
      };
    },
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * Strategy: drives the *background* page motion for `type: "expand"`.
 * Owns its own physics (used by every other strategy in the same transition
 * so progress stays locked across the parallel animation set).
 * ──────────────────────────────────────────────────────────────────────────── */

export class ExpandBackgroundStrategy implements ZoomStrategy {
  readonly physics = EXPAND_PHYSICS;

  contribute(ctx: ZoomContributeCtx): Animation[] {
    const { from, to, resolved, input, physics } = ctx;
    const isEnter = resolved.mode === "enter";
    // Enter: background = outgoing `from` (page → tile, u-fed).
    // Exit:  background = incoming `to`   (tile → page, t-fed).
    const bgEl = isEnter ? from : to;
    const bgConfig = isEnter ? createEnterOut(input) : createExitIn(input);

    if (bgConfig) bgEl.style.transformOrigin = bgConfig.transformOrigin;

    return [
      new WebAnimation({
        element: bgEl,
        integrator: IntegratorProvider.from(physics),
        style: isEnter
          ? (_t, u) => bgConfig.animate(u) as Record<string, string | number>
          : (t) => bgConfig.animate(t) as Record<string, string | number>,
      }),
    ];
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Legacy provider export — kept so `ZOOM_PROVIDERS` and the public
 * `ZoomProvider` shape stay intact for any external consumer or test that
 * still reaches in. The strategy above is the new entry point.
 * ──────────────────────────────────────────────────────────────────────────── */

import { createZoomIn, createZoomOut } from "../zoom-element";

export function createExpandProvider(): ZoomProvider {
  return {
    physics: EXPAND_PHYSICS,
    in: createZoomIn,
    out: createZoomOut,
    backgroundIn: createExitIn,
    backgroundOut: createEnterOut,
  };
}
