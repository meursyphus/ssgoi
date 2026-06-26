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

// Peak backdrop blur (px) applied to the overlay layer when the sheet is fully
// risen. Matches the zoom `blur` tone's frosted-glass amount.
const MAX_BLUR_PX = 16;

// The background also dims a touch so the foreground sheet reads as the focus.
// Floor opacity at peak (never fully transparent — the rising sheet already
// covers it, and a partial dim looks richer mid-transit than a hard fade).
const MIN_OPACITY = 0.6;

// Springs/inertia overshoot past the endpoints (exit t > 1, reversed enter
// t < 0), which would drive the radius negative — invalid CSS. Clamp to >= 0.
const blur = (px: number) => `blur(${Math.max(0, px).toFixed(2)}px)`;

/**
 * `blur` sheet tone — the background page blurs and recedes behind the rising
 * sheet, the way a modal pushes the page underneath out of focus.
 *
 * The blur lives on a *separate* overlay layer (a `backdrop-filter` between the
 * background and the sheet) rather than on the background element itself. That
 * keeps the frost uniform and decoupled from the background's clip + scale —
 * applying `filter: blur` directly to the clipped/scaled page would hard-cut
 * the blur halo at the clip edge and ride the scale transform. The background
 * only carries the recede (a small scale + dim); the overlay owns the blur.
 */
export function createBlurProvider(): SheetProvider {
  return {
    enterPhysics: ENTER_PHYSICS,
    exitPhysics: EXIT_PHYSICS,
    background: {
      willChange: "transform, opacity",
      // enter: t 0 → 1 as the sheet rises. At rest (t = 0) the page is
      // untouched; at peak it is shrunk and dimmed.
      enterStyle: (t) => ({
        transform: `scale(${1 - SCALE_OFFSET * t})`,
        opacity: 1 - (1 - MIN_OPACITY) * t,
      }),
      // exit: t 0 → 1 as the sheet falls away and the page returns to rest —
      // the inverse ramp of enter.
      exitStyle: (t) => ({
        transform: `scale(${1 - SCALE_OFFSET + SCALE_OFFSET * t})`,
        opacity: MIN_OPACITY + (1 - MIN_OPACITY) * t,
      }),
    },
    overlay: {
      willChange: "backdrop-filter",
      initialStyle: {
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        backdropFilter: "blur(0px)",
        WebkitBackdropFilter: "blur(0px)",
      },
      // enter: 0 → MAX as the sheet rises (progress 0 → 1).
      // exit: MAX → 0 as it falls (progress 0 → 1, so the visual is inverted).
      style: (direction, progress) => {
        const visual = direction === "enter" ? progress : 1 - progress;
        const b = blur(MAX_BLUR_PX * visual);
        return { backdropFilter: b, WebkitBackdropFilter: b };
      },
    },
  };
}
