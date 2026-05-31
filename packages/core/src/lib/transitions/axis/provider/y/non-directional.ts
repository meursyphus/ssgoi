import type { PhysicsOptions } from "@types";
import type {
  AxisAnimationConfig,
  AxisProvider,
  AxisProviderBuildArgs,
} from "../../types";

// "Non-directional" y — direction-agnostic. Outgoing fades in place with no
// translation; incoming always rises from below. Used when navigation isn't a
// back-and-forth pair (e.g. switching modes where forward/backward look the
// same). Composition is `sequence` (fade-through), same as directional y.
//
// Physics shape mirrors directional y for now (inertia out + spring in) — kept
// as separate constants so the two can drift independently if either feel
// needs its own tuning later.
const TRANSLATE_PX = 8;

// See x/fluid.ts — settle thresholds loosened 10× across all axis providers.
const Y_NON_DIRECTIONAL_OUT_PHYSICS: PhysicsOptions = {
  inertia: { acceleration: 150, resistance: 1.5, restDelta: 0.1 },
};

const Y_NON_DIRECTIONAL_IN_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 180, damping: 34, restDelta: 0.1, restSpeed: 0.1 },
};

function buildNonDirectionalY(
  _args: AxisProviderBuildArgs,
): AxisAnimationConfig {
  const inStart = TRANSLATE_PX;

  return {
    out: {
      willChange: "opacity",
      startStyle: {},
      animate: (t) => ({
        opacity: `${1 - t}`,
      }),
    },
    in: {
      willChange: "transform, opacity",
      startStyle: {
        transform: `translate3d(0, ${inStart}px, 0)`,
        opacity: "0",
      },
      animate: (t) => ({
        transform: `translate3d(0, ${inStart * (1 - t)}px, 0)`,
        opacity: `${t}`,
      }),
    },
  };
}

export function createNonDirectionalYProvider(): AxisProvider {
  return {
    outPhysics: Y_NON_DIRECTIONAL_OUT_PHYSICS,
    inPhysics: Y_NON_DIRECTIONAL_IN_PHYSICS,
    composition: { mode: "sequence" },
    build: buildNonDirectionalY,
  };
}
