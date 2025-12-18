import type { SpringConfig, SggoiTransition, StyleObject } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { sleep, withResolvers } from "../utils";

const DEFAULT_OUT_SPRING: SpringConfig = {
  stiffness: 180,
  damping: 20,
  doubleSpring: true,
};
const DEFAULT_IN_SPRING: SpringConfig = {
  stiffness: 170,
  damping: 20,
  doubleSpring: true,
};
const DEFAULT_TRANSITION_DELAY = 0;

interface FadeOptions {
  inSpring?: SpringConfig;
  outSpring?: SpringConfig;
  transitionDelay?: number;
}

export const fade = (options: FadeOptions = {}): SggoiTransition => {
  const {
    inSpring = DEFAULT_IN_SPRING,
    outSpring = DEFAULT_OUT_SPRING,
    transitionDelay = DEFAULT_TRANSITION_DELAY,
  } = options;
  // Shared promise for coordinating OUT and IN animations
  let { promise: outAnimationComplete, resolve: resolveOutAnimation } =
    withResolvers<void>();

  return {
    in: (element) => {
      return {
        spring: inSpring,
        prepare: () => {
          element.style.opacity = "0";
          element.style.willChange = "opacity";
        },
        wait: async () => {
          // Wait for OUT animation to complete if it exists
          if (outAnimationComplete) {
            await outAnimationComplete;
            const newResolvers = withResolvers<void>();
            outAnimationComplete = newResolvers.promise;
            resolveOutAnimation = newResolvers.resolve;
            await sleep(transitionDelay);
          }
        },
        css: (progress): StyleObject => ({
          opacity: progress,
        }),
        onEnd: () => {
          element.style.willChange = "auto";
          element.style.opacity = "1";
        },
      };
    },
    out: (element, context) => {
      return {
        spring: outSpring,
        css: (progress): StyleObject => ({
          opacity: progress,
        }),
        prepare: () => {
          prepareOutgoing(element, context);
          element.style.willChange = "opacity";
        },
        onEnd: () => {
          // Resolve the promise when OUT animation completes
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
          element.style.willChange = "auto";
        },
      };
    },
  };
};
