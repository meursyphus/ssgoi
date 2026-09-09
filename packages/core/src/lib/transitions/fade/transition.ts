import type { PhysicsOptions, TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

import {
  FADE_OUT_PHYSICS,
  FADE_IN_PHYSICS,
  pageMotionStyle,
} from "../../runtime/page-motion";

export interface FadeOptions {
  physics?: PhysicsOptions;
}

export const fade = (options: FadeOptions = {}): TransitionConfig => {
  const inPhysics = options.physics ?? FADE_IN_PHYSICS;
  const outPhysics = options.physics ?? FADE_OUT_PHYSICS;

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
        style: (t) => ({
          opacity: pageMotionStyle("fade", "out", "forward", t).opacity,
        }),
        onComplete: () => {
          // The outgoing node is the real page and gets reused (re-hidden,
          // shown again next navigation), so clear every inline style we
          // wrote — willChange and the final opacity:0 frame — exactly like
          // the incoming cleanup below, or the page stays invisible.
          from.style.willChange = "auto";
          from.style.opacity = "";
        },
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(inPhysics),
        style: (t) => ({
          opacity: pageMotionStyle("fade", "in", "forward", t).opacity,
        }),
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.opacity = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "sequence" });
    },
  };
};
