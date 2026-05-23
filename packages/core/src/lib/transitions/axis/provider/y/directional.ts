import type { PhysicsOptions } from "@types";
import type {
  AxisAnimationConfig,
  AxisProvider,
  AxisProviderBuildArgs,
} from "../../types";

// "Directional" y — forward navigation goes bottom→top (outgoing slides up,
// incoming rises from below). Backward mirrors. Composition is `sequence` so
// the out-fade finishes before the in-fade starts (fade-through), matching the
// x fluid pattern. Slide distance is intentionally small (8 px) — y travel
// reads heavier than x for the same number of pixels.
//
// Physics shape borrows x fluid's asymmetric pair (inertia out + spring in) so
// the integrator curves give the cross-fade shape for free under sequence
// composition. Constants are kept independent of x fluid's so y can evolve on
// its own without tugging the x feel.
const TRANSLATE_PX = 8;

const Y_DIRECTIONAL_OUT_PHYSICS: PhysicsOptions = {
  inertia: { acceleration: 150, resistance: 1.5 },
};

const Y_DIRECTIONAL_IN_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 180, damping: 34 },
};

function buildDirectionalY({
  direction,
}: AxisProviderBuildArgs): AxisAnimationConfig {
  const sign = direction === "forward" ? 1 : -1;
  const outTarget = -TRANSLATE_PX * sign;
  const inStart = TRANSLATE_PX * sign;

  return {
    out: {
      willChange: "transform, opacity",
      startStyle: {},
      animate: (t) => ({
        transform: `translate3d(0, ${outTarget * t}px, 0)`,
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

export function createDirectionalYProvider(): AxisProvider {
  return {
    outPhysics: Y_DIRECTIONAL_OUT_PHYSICS,
    inPhysics: Y_DIRECTIONAL_IN_PHYSICS,
    composition: { mode: "sequence" },
    build: buildDirectionalY,
  };
}
