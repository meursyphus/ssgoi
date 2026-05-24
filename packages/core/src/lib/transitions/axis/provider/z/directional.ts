import type { PhysicsOptions } from "@types";
import type {
  AxisAnimationConfig,
  AxisProvider,
  AxisProviderBuildArgs,
} from "../../types";

// Material shared Z-axis. Spring is near-critical (damping 30 vs ~33.5
// critical → ratio ≈ 0.9), so progress is effectively monotonic — safe to
// piecewise-map opacity inside the same tick as the scale.
const Z_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 280, damping: 30 },
};

const SCALE_OFFSET = 0.1;
// Fade-through split, no overlap. fade-out runs for the first third of
// progress; fade-in fills the remaining two thirds. Ratio 1:2 — fade-out is
// 2× faster than fade-in, matching the observed feel.
const FADE_OUT_END = 1 / 3;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function buildDirectionalZ({
  direction,
}: AxisProviderBuildArgs): AxisAnimationConfig {
  // forward = camera moves INTO the screen: both pages scale UP together
  // (outgoing recedes past viewer, incoming emerges from depth). backward
  // mirrors — both pages scale DOWN.
  const sign = direction === "forward" ? 1 : -1;
  const inStart = 1 - sign * SCALE_OFFSET;

  return {
    out: {
      willChange: "transform, opacity",
      startStyle: {},
      animate: (t) => ({
        transform: `scale(${1 + sign * t * SCALE_OFFSET})`,
        opacity: `${clamp01(1 - t / FADE_OUT_END)}`,
      }),
    },
    in: {
      willChange: "transform, opacity",
      startStyle: {
        transform: `scale(${inStart})`,
        opacity: "0",
      },
      animate: (t) => ({
        transform: `scale(${inStart + sign * t * SCALE_OFFSET})`,
        opacity: `${clamp01((t - FADE_OUT_END) / (1 - FADE_OUT_END))}`,
      }),
    },
  };
}

export function createDirectionalZProvider(): AxisProvider {
  return {
    outPhysics: Z_PHYSICS,
    inPhysics: Z_PHYSICS,
    // Scale must move together on both sides; fade-through is encoded inside
    // each tick (piecewise), not via composition staggering — so parallel.
    composition: { mode: "parallel" },
    build: buildDirectionalZ,
  };
}
