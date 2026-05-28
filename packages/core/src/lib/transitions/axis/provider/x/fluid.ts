import type { PhysicsOptions } from "@types";
import type {
  AxisAnimationConfig,
  AxisProvider,
  AxisProviderBuildArgs,
} from "../../types";

// "Fluid" x — Material SharedAxisTransition (horizontal) decomposed into two
// sequential physics phases instead of a single staggered ramp.
//
//   1. Outgoing falls away under an inertia integrator (acceleration + drag).
//      Position 0→1 naturally curves slow-then-fast, giving the Material
//      "legacyAccelerate" out-fade shape for free.
//   2. Once it settles, incoming arrives on a stiffer spring tuned ~2× the
//      perceived speed of the out phase. Spring's slow-settle tail gives the
//      "legacyDecelerate" in-fade shape.
//
// The sequence composition handles the stagger, so each `animate(t)` is a
// straight 0→1 slide+fade — no FADE_SPLIT, no easing branches.
// The sibling `snappy` x is the KakaoTalk-style flavor — parallel cross-fade.
const TRANSLATE_PX = 30;

// All axis providers loosen settle thresholds 10× over the integrator
// defaults (0.01 → 0.1) so the imperceptible tail of each phase doesn't
// hold up the sequence handoff or the page lifecycle.
const FLUID_OUT_PHYSICS: PhysicsOptions = {
  inertia: { acceleration: 150, resistance: 1.5, restDelta: 0.1 },
};

const FLUID_IN_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 180, damping: 34, restDelta: 0.1, restSpeed: 0.1 },
};

function buildFluidX({
  direction,
}: AxisProviderBuildArgs): AxisAnimationConfig {
  // forward: outgoing slides left, incoming arrives from the right.
  // backward: mirrored.
  const sign = direction === "forward" ? 1 : -1;
  const outTarget = -TRANSLATE_PX * sign;
  const inStart = TRANSLATE_PX * sign;

  return {
    out: {
      willChange: "transform, opacity",
      startStyle: {},
      animate: (t) => ({
        transform: `translate3d(${outTarget * t}px, 0, 0)`,
        opacity: `${1 - t}`,
      }),
    },
    in: {
      willChange: "transform, opacity",
      startStyle: {
        transform: `translate3d(${inStart}px, 0, 0)`,
        opacity: "0",
      },
      animate: (t) => ({
        transform: `translate3d(${inStart * (1 - t)}px, 0, 0)`,
        opacity: `${t}`,
      }),
    },
  };
}

export function createFluidXProvider(): AxisProvider {
  return {
    outPhysics: FLUID_OUT_PHYSICS,
    inPhysics: FLUID_IN_PHYSICS,
    // Phased motion: outgoing falls away first under inertia, then incoming
    // springs in. The fade-through shape comes from the integrator curves
    // plus the sequence handoff, not from FADE_SPLIT inside animate(t).
    composition: { mode: "sequence" },
    build: buildFluidX,
  };
}
