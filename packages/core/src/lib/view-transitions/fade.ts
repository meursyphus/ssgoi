import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { sleep } from "../utils/sleep";

const DEFAULT_OUT_SPRING = { stiffness: 10, damping: 4 };
const DEFAULT_IN_SPRING = { stiffness: 11, damping: 4 };
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
  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  return {
    in: (element) => {
      return {
        spring: inSpring,
        prepare: (element) => {
          element.style.opacity = "0";
          element.style.willChange = "opacity";
        },
        wait: async () => {
          // Wait for OUT animation to complete if it exists
          if (outAnimationComplete) {
            await outAnimationComplete;
            // Configurable delay after OUT completes
            await sleep(transitionDelay);
          }
        },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
      };
    },
    out: (element, context) => {
      // Create promise for OUT animation completion
      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });

      return {
        spring: outSpring,
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
        prepare: (element) => {
          prepareOutgoing(element, context);
          element.style.willChange = "opacity";
        },
        onEnd: () => {
          // Resolve the promise when OUT animation completes
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
        },
      };
    },
  };
};
