import type { PhysicsOptions } from "@types";
import type {
  DrillAnimationConfig,
  DrillDirection,
  DrillProvider,
} from "../types";

// Double spring gives an ease-in-out feel; leader 130/20 + 0.7 follower
// lands the visible motion near ~400ms with a soft tail at both ends.
const CROSSFADE_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 200, damping: 20, doubleSpring: 0.7 },
};

// Opacity floor — incoming starts at 0.5 (not 0), outgoing settles at 0.5 (not 0).
const FADE_FLOOR = 0.5;

function buildCrossfade(direction: DrillDirection): DrillAnimationConfig {
  const outEnd = direction === "enter" ? -100 : 100;
  const inStart = direction === "enter" ? 100 : -100;

  return {
    out: {
      willChange: "transform, opacity",
      startStyle: {},
      animate: (t) => ({
        transform: `translate3d(${outEnd * t}%, 0, 0)`,
        opacity: `${FADE_FLOOR + (1 - FADE_FLOOR) * (1 - t)}`,
      }),
    },
    in: {
      willChange: "transform, opacity",
      startStyle: {
        transform: `translate3d(${inStart}%, 0, 0)`,
        opacity: `${FADE_FLOOR}`,
      },
      animate: (t) => ({
        transform: `translate3d(${inStart * (1 - t)}%, 0, 0)`,
        opacity: `${FADE_FLOOR + (1 - FADE_FLOOR) * t}`,
      }),
    },
  };
}

export function createCrossfadeProvider(): DrillProvider {
  return {
    physics: CROSSFADE_PHYSICS,
    build: buildCrossfade,
  };
}
