import type { PhysicsOptions } from "@types";
import type { AxisAnimationConfig, AxisProvider } from "../../types";

// Same physics as directional z so the fade-through timing aligns regardless
// of which feel is picked. See directional.ts for the damping rationale.
// See x/fluid.ts — settle thresholds loosened 10× across all axis providers.
const Z_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 280, damping: 30, restDelta: 0.1, restSpeed: 0.1 },
};

const SCALE_OFFSET = 0.1;
const FADE_OUT_END = 1 / 3;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function buildNonDirectionalZ(): AxisAnimationConfig {
  // Direction-agnostic: outgoing only fades (no scale), incoming always
  // emerges by scaling up (1-s → 1). The "depth" reading comes entirely from
  // the incoming side; the outgoing side just clears space.
  return {
    out: {
      willChange: "opacity",
      startStyle: {},
      animate: (t) => ({
        opacity: `${clamp01(1 - t / FADE_OUT_END)}`,
      }),
    },
    in: {
      willChange: "transform, opacity",
      startStyle: {
        transform: `scale(${1 - SCALE_OFFSET})`,
        opacity: "0",
      },
      animate: (t) => ({
        transform: `scale(${1 - SCALE_OFFSET + t * SCALE_OFFSET})`,
        opacity: `${clamp01((t - FADE_OUT_END) / (1 - FADE_OUT_END))}`,
      }),
    },
  };
}

export function createNonDirectionalZProvider(): AxisProvider {
  return {
    outPhysics: Z_PHYSICS,
    inPhysics: Z_PHYSICS,
    composition: { mode: "parallel" },
    build: buildNonDirectionalZ,
  };
}
