import type { PhysicsOptions } from "@types";
import type { SheetProvider } from "../types";

const ENTER_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 200, damping: 24 },
};

const EXIT_PHYSICS: PhysicsOptions = {
  inertia: { acceleration: 25, resistance: 1.2 },
};

const SCALE_OFFSET = 0.2;

export function createBackgroundScaleProvider(): SheetProvider {
  return {
    enterPhysics: ENTER_PHYSICS,
    exitPhysics: EXIT_PHYSICS,
    background: {
      willChange: "transform, opacity",
      enterStyle: (t, u) => ({
        transform: `scale(${1 - SCALE_OFFSET * t})`,
        opacity: u,
      }),
      exitStyle: (t) => ({
        transform: `scale(${1 - SCALE_OFFSET + SCALE_OFFSET * t})`,
        opacity: t,
      }),
    },
  };
}
