import type { PhysicsOptions } from "@types";
import type { AxisAnimationConfig, AxisProvider } from "../types";

// standard easing (Material shared Z-axis): in-place transformation, both
// pages share the same canvas. 280/30 = ratio 0.90 of critical (~33.5), ~280ms.
const Z_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 280, damping: 30 },
};

const SCALE_OFFSET = 0.05;

function buildZ(): AxisAnimationConfig {
  return {
    // Outgoing scales up slightly (1 → 1+s) while fading — recedes toward
    // viewer feel, complementing the incoming page rising from below.
    out: {
      willChange: "transform, opacity",
      startStyle: {},
      animate: (t) => ({
        transform: `scale(${1 + t * SCALE_OFFSET})`,
        opacity: `${1 - t}`,
      }),
    },
    // Incoming rises from below (1-s → 1) with fade in.
    in: {
      willChange: "transform, opacity",
      startStyle: {
        transform: `scale(${1 - SCALE_OFFSET})`,
        opacity: "0",
      },
      animate: (t) => ({
        transform: `scale(${1 - SCALE_OFFSET + t * SCALE_OFFSET})`,
        opacity: `${t}`,
      }),
    },
  };
}

export function createZProvider(): AxisProvider {
  return {
    physics: Z_PHYSICS,
    // Both pages share the canvas (in-place scale+fade), so a strict
    // fade-through-with-offset would feel disjointed. Run them together
    // for a cleaner cross-fade.
    composition: { mode: "parallel" },
    build: buildZ,
  };
}
