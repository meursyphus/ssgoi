import type { PhysicsOptions } from "@types";
import type { SheetProvider } from "../types";

// ease-out (Material decelerated): sheet rises and lands gracefully (incoming).
const ENTER_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 200, damping: 24 },
};

// ease-in (Material accelerated): sheet falls away (outgoing).
const EXIT_PHYSICS: PhysicsOptions = {
  inertia: { acceleration: 25, resistance: 1.2 },
};

export function createStaticProvider(): SheetProvider {
  return {
    enterPhysics: ENTER_PHYSICS,
    exitPhysics: EXIT_PHYSICS,
    background: {
      willChange: "",
      enterStyle: () => ({}),
      exitStyle: () => ({}),
    },
  };
}
