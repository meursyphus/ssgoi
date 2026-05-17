import type { PhysicsOptions } from "@types";
import type {
  AxisAnimationConfig,
  AxisProvider,
  AxisProviderBuildArgs,
} from "../types";

// Mirrors X — same physics and slide distance, just on the other axis.
const Y_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 2400, damping: 65, doubleSpring: 0.7 },
};

const TRANSLATE_OFFSET = 8; // px

function buildY({ direction }: AxisProviderBuildArgs): AxisAnimationConfig {
  // forward: outgoing slides up, incoming arrives from below.
  // backward: outgoing slides down, incoming arrives from above.
  const outEnd = direction === "forward" ? -TRANSLATE_OFFSET : TRANSLATE_OFFSET;
  const inStart =
    direction === "forward" ? TRANSLATE_OFFSET : -TRANSLATE_OFFSET;

  return {
    out: {
      willChange: "transform, opacity",
      startStyle: {},
      animate: (t) => ({
        transform: `translate3d(0, ${outEnd * t}px, 0)`,
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

export function createYProvider(): AxisProvider {
  return {
    physics: Y_PHYSICS,
    composition: { mode: "parallel", startAt: [0, 0.3] },
    build: buildY,
  };
}
