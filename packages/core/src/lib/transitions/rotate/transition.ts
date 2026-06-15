import type { PhysicsOptions, TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 100, damping: 30 },
};

export interface RotateOptions {
  physics?: PhysicsOptions;
}

export const rotate = (options: RotateOptions = {}): TransitionConfig => {
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;
  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        el.style.transformOrigin = "center center";
        el.style.willChange = "transform, opacity";
      });
      to.then((el) => {
        el.style.opacity = "0";
        el.style.transform = "rotate(-180deg)";
        el.style.transformOrigin = "center center";
        el.style.willChange = "transform, opacity";
      });
      return {};
    },
    animation: ({ from, to }) => {
      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => ({
          transform: `rotate(${t * 180}deg)`,
          opacity: t < 0.5 ? 1 : 0,
        }),
        // The outgoing node is reused (re-hidden, shown again on the next
        // navigation), so clear every inline style we wrote to `from`
        // (prepare + the final WAAPI frame), mirroring the `to` cleanup.
        onComplete: () => {
          from.style.willChange = "auto";
          from.style.transform = "";
          from.style.transformOrigin = "";
          from.style.opacity = "";
        },
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        // u runs 1→0, so -u*180 unwinds -180→0.
        style: (t, u) => ({
          transform: `rotate(${-u * 180}deg)`,
          opacity: t > 0.5 ? 1 : 0,
        }),
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.transform = "";
          to.style.transformOrigin = "";
          to.style.opacity = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
