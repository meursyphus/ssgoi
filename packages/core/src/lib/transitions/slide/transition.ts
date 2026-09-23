import type { NavigationDirection } from "@types";
import { defineTransition } from "../../transition/define-transition";
import type { PhysicsOptions, TransitionDirection } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

export interface SlideOptions {
  physics?: PhysicsOptions;
}

import { SLIDE_PHYSICS, pageMotionStyle } from "../../runtime/page-motion";

export const slide = (options: SlideOptions = {}) => {
  const physicsOptions: PhysicsOptions = options.physics ?? SLIDE_PHYSICS;

  const createDirection = (navigationDirection: NavigationDirection) => {
    const startX = navigationDirection === "forward" ? 100 : -100;
    return {
      prepare: ({ from, to }) => {
        from.then((el) => {
          el.style.willChange = "transform";
          el.style.backfaceVisibility = "hidden";
          (el.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          el.style.pointerEvents = "none";
        });
        to.then((el) => {
          el.style.transform = `translate3d(${startX}%, 0, 0)`;
          el.style.willChange = "transform";
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
          style: (t) => {
            const translateX =
              100 * pageMotionStyle("slide", "out", navigationDirection, t).x;
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
          style: (t) => {
            const translateX =
              100 * pageMotionStyle("slide", "in", navigationDirection, t).x;
            return { transform: `translate3d(${translateX}%, 0, 0)` };
          },
          onComplete: () => {
            to.style.willChange = "auto";
            to.style.backfaceVisibility = "";
            (to.style as CSSStyleDeclaration & { contain: string }).contain =
              "";
            to.style.transform = "";
          },
        });

        return new MultiAnimation(
          { out: outAnim, in: inAnim },
          { mode: "parallel" },
        );
      },
    } satisfies TransitionDirection<object>;
  };

  return defineTransition({
    forward: createDirection("forward"),
    backward: createDirection("backward"),
  });
};
