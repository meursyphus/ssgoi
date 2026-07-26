import type { PhysicsOptions } from "@types";
import type { SheetProvider } from "../types";

// ease-out (Material decelerated): sheet rises and lands gracefully (incoming).
const ENTER_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 230,
    damping: 25,
  },
};

// ease-in (Material accelerated): sheet falls away (outgoing).
const EXIT_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 230,
    damping: 25,
  },
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
