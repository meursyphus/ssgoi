import type { PhysicsOptions, TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 17, damping: 6 },
};
const ROTATE_Y = 20;
const PERSPECTIVE = 800;

export interface StripOptions {
  physics?: PhysicsOptions;
}

export const strip = (options: StripOptions = {}): TransitionConfig => {
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;
  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.pointerEvents = "none";
        el.style.transform = `perspective(${PERSPECTIVE}px) rotateY(0deg) translate3d(0%, 0, 0)`;
      });
      to.then((el) => {
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.transform = `perspective(${PERSPECTIVE}px) rotateY(${ROTATE_Y}deg) translate3d(-100%, 0, 0)`;
      });
      return {};
    },
    animation: ({ from, to }) => {
      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => {
          const rotate = -t * ROTATE_Y;
          const translateX = t * 100;
          return {
            transform: `perspective(${PERSPECTIVE}px) rotateY(${rotate}deg) translate3d(${translateX}%, 0, 0)`,
          };
        },
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (_t, u) => {
          const rotate = u * ROTATE_Y;
          const translateX = -u * 100;
          return {
            transform: `perspective(${PERSPECTIVE}px) rotateY(${rotate}deg) translate3d(${translateX}%, 0, 0)`,
          };
        },
        onComplete: () => {
          to.style.transform = "";
          to.style.willChange = "auto";
          to.style.backfaceVisibility = "";
          (to.style as CSSStyleDeclaration & { contain: string }).contain = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "sequence" });
    },
  };
};
