import type { PhysicsOptions } from "@types";
import type {
  DrillAnimationConfig,
  DrillDirection,
  DrillProvider,
} from "../types";

// ease-out (Material decelerated): incoming page settles into place.
// stiffness 230, damping 25 → ratio 0.82 of critical (~30.3), settles gently.
const PARALLAX_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 230,
    damping: 25,
    doubleSpring: {
      stiffness: 230,
      damping: 24,
    },
  },
};

function buildParallax(direction: DrillDirection): DrillAnimationConfig {
  // enter: from slides left to -20% (parallax shadow), to slides in from 100%.
  // exit:  from slides right to 100%, to slides in from -20%.
  const outEnd = direction === "enter" ? -20 : 100;
  const inStart = direction === "enter" ? 100 : -20;

  return {
    out: {
      willChange: "transform",
      startStyle: {},
      animate: (t) => ({
        transform: `translate3d(${outEnd * t}%, 0, 0)`,
      }),
    },
    in: {
      willChange: "transform",
      startStyle: {
        transform: `translate3d(${inStart}%, 0, 0)`,
      },
      animate: (t) => ({
        transform: `translate3d(${inStart * (1 - t)}%, 0, 0)`,
      }),
    },
  };
}

export function createParallaxProvider(): DrillProvider {
  return {
    physics: PARALLAX_PHYSICS,
    build: buildParallax,
  };
}
