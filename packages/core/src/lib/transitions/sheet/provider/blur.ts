import type { PhysicsOptions } from "@types";
import type { SheetProvider } from "../types";

// ease-out spring for the rising sheet (mirrors the scale tone's feel).
const ENTER_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 200, damping: 24 },
};

// ease-in inertia for the falling sheet (outgoing).
const EXIT_PHYSICS: PhysicsOptions = {
  inertia: { acceleration: 25, resistance: 1.2 },
};

// The background recedes by this much at peak — kept subtle on purpose. The
// blur is the primary "step back" cue here, so the scale only needs to hint
// at depth (the `scale` tone uses a much larger 0.2).
const SCALE_OFFSET = 0.08;

// Peak gaussian blur (px) applied to the background page when the sheet is
// fully risen. Matches the zoom `blur` tone's frosted-glass amount.
const MAX_BLUR_PX = 16;

// The background also dims a touch so the foreground sheet reads as the focus.
// Floor opacity at peak (never fully transparent — the rising sheet already
// covers it, and a partial dim looks richer mid-transit than a hard fade).
const MIN_OPACITY = 0.6;

// Springs/inertia overshoot past the endpoints: exit (t > 1) drives
// blur(MAX * (1 - t)) negative, and an interrupted/reversed enter (t < 0) drives
// blur(MAX * t) negative — both invalid CSS. Clamp the radius to >= 0.
const blur = (px: number) => `blur(${Math.max(0, px).toFixed(2)}px)`;

/**
 * `blur` sheet tone — the background page blurs and recedes behind the rising
 * sheet, the way a modal pushes the page underneath out of focus. A small
 * scale + dim gives the recede some depth without the heavy stacked-card shrink
 * of the `scale` tone.
 */
export function createBlurProvider(): SheetProvider {
  return {
    enterPhysics: ENTER_PHYSICS,
    exitPhysics: EXIT_PHYSICS,
    background: {
      willChange: "transform, opacity, filter",
      // enter: t 0 → 1 as the sheet rises (u = 1 - t). At rest (t = 0) the page
      // is untouched; at peak it is shrunk, blurred and dimmed.
      enterStyle: (t) => ({
        transform: `scale(${1 - SCALE_OFFSET * t})`,
        filter: blur(MAX_BLUR_PX * t),
        opacity: 1 - (1 - MIN_OPACITY) * t,
      }),
      // exit: t 0 → 1 as the sheet falls away and the page returns to rest. The
      // visual ramp is the inverse of enter.
      exitStyle: (t) => ({
        transform: `scale(${1 - SCALE_OFFSET + SCALE_OFFSET * t})`,
        filter: blur(MAX_BLUR_PX * (1 - t)),
        opacity: MIN_OPACITY + (1 - MIN_OPACITY) * t,
      }),
    },
  };
}
