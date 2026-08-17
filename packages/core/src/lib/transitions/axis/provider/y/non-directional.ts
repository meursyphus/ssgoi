import type { PhysicsOptions } from "@types";
import type {
  AxisAnimationConfig,
  AxisProvider,
  AxisProviderBuildArgs,
} from "../../types";

// "Non-directional" y — direction-agnostic. Outgoing fades in place with no
// translation; incoming always rises from below. Used when navigation isn't a
// back-and-forth pair (e.g. switching modes where forward/backward look the
// same). The two sides overlap as a cross-fade, but the incoming page settles
// for roughly twice as long as the outgoing page. The outgoing curve borrows
// x/fluid's quick inertia falloff; the incoming curve chains two fast springs
// so it still reads as a soft arrival without making tab switches feel heavy.
const TRANSLATE_PX = 20;

// See x/fluid.ts — settle thresholds loosened 10× across all axis providers.
const Y_NON_DIRECTIONAL_OUT_PHYSICS: PhysicsOptions = {
  inertia: { acceleration: 150, resistance: 1.5, restDelta: 0.1 },
};

const Y_NON_DIRECTIONAL_IN_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 1000,
    damping: 50,
    doubleSpring: 1.2,
    restDelta: 0.1,
    restSpeed: 0.1,
  },
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
    composition: { mode: "parallel", startAt: [0, 0] },
    build: buildNonDirectionalY,
  };
}
