import type { PhysicsOptions, TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

// ease-out (Material decelerated): incoming page settles into place.
// stiffness 170, damping 22 → ratio 0.86 of critical (~26.1), settles ~310ms.
const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 170, damping: 22 },
};

export interface DrillOptions {
  opacity?: boolean;
  direction?: "enter" | "exit";
  physics?: PhysicsOptions;
}

export const drill = (options: DrillOptions = {}): TransitionConfig => {
  const { opacity = false, direction = "enter" } = options;
  const physicsOptions = options.physics ?? DEFAULT_PHYSICS;
  const willChange = opacity ? "transform, opacity" : "transform";

  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        el.style.willChange = willChange;
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.pointerEvents = "none";
        el.style.zIndex = direction === "enter" ? "-1" : "100";
      });
      to.then((el) => {
        const startX = direction === "enter" ? 100 : -20;
        el.style.transform = `translate3d(${startX}%, 0, 0)`;
        if (opacity) el.style.opacity = "0";
        el.style.willChange = willChange;
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
      });
      return {};
    },
    animation: ({ from, to }) => {
      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t, u) => {
          // enter: from slides left to -20% as t: 0→1
          // exit:  from slides right to 100% as t: 0→1
          const x = direction === "enter" ? -20 * t : 100 * t;
          const style: Record<string, number | string> = {
            transform: `translate3d(${x}%, 0, 0)`,
          };
          if (opacity) style.opacity = u;
          return style;
        },
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t, u) => {
          // enter: to comes from 100% (start) to 0 (end)
          // exit:  to comes from -20% (start) to 0 (end)
          const start = direction === "enter" ? 100 : -20;
          const x = start * u;
          const style: Record<string, number | string> = {
            transform: `translate3d(${x}%, 0, 0)`,
          };
          if (opacity) style.opacity = t;
          return style;
        },
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.backfaceVisibility = "";
          (to.style as CSSStyleDeclaration & { contain: string }).contain = "";
          to.style.transform = "";
          if (opacity) to.style.opacity = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
