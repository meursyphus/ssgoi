import type { PhysicsOptions, TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

export interface SlideOptions {
  physics?: PhysicsOptions;
}

// ease-out (Material decelerated): horizontal page push, incoming page settles in.
// 170/22 mirrors drill character; doubleSpring 0.8 softens both ends, ~330ms total.
const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 170, damping: 22, doubleSpring: 0.8 },
};

export const slide = (options: SlideOptions = {}): TransitionConfig => {
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;

  return {
    prepare: ({ from, to, context }) => {
      const isLeft = context.direction === "forward";
      from.then((el) => {
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.pointerEvents = "none";
      });
      to.then((el) => {
        const startX = isLeft ? 100 : -100;
        el.style.transform = `translate3d(${startX}%, 0, 0)`;
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
      });
      return {};
    },
    animation: ({ from, to, context }) => {
      const isLeft = context.direction === "forward";
      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => {
          const translateX = isLeft ? -100 * t : 100 * t;
          return { transform: `translate3d(${translateX}%, 0, 0)` };
        },
        // The outgoing node is the real Activity page and gets reused on the
        // next navigation, so reset every inline style we wrote to it (mirror
        // the incoming cleanup, plus the out-only pointerEvents).
        onComplete: () => {
          from.style.willChange = "auto";
          from.style.backfaceVisibility = "";
          (from.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
          from.style.transform = "";
          from.style.pointerEvents = "";
        },
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (_t, u) => {
          const translateX = isLeft ? u * 100 : u * -100;
          return { transform: `translate3d(${translateX}%, 0, 0)` };
        },
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.backfaceVisibility = "";
          (to.style as CSSStyleDeclaration & { contain: string }).contain = "";
          to.style.transform = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
