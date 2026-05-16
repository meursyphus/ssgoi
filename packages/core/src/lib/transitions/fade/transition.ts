import type { PhysicsOptions, TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

const DEFAULT_OUT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 180, damping: 20, doubleSpring: true },
};
const DEFAULT_IN_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 170, damping: 20, doubleSpring: true },
};

export interface FadeOptions {
  physics?: PhysicsOptions;
}

export const fade = (options: FadeOptions = {}): TransitionConfig => {
  const inPhysics = options.physics ?? DEFAULT_IN_PHYSICS;
  const outPhysics = options.physics ?? DEFAULT_OUT_PHYSICS;

  return {
    prepare: ({ to }) => {
      // Lay down the incoming page invisible before paint so it doesn't flash
      // at full opacity ahead of the spring.
      to.then((el) => {
        el.style.opacity = "0";
        el.style.willChange = "opacity";
      });
      return {};
    },
    animation: ({ from, to }) => {
      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(outPhysics),
        // Default bounds (0, 1). `u` runs 1→0 as the animation moves
        // forward, mapping opacity from fully visible to invisible.
        style: (_t, u) => ({ opacity: u }),
        onComplete: () => {
          from.style.willChange = "auto";
        },
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(inPhysics),
        style: (t) => ({ opacity: t }),
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.opacity = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "sequence" });
    },
  };
};
