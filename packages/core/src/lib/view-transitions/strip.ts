import type { SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";


const DEFAULT_SPRING = { stiffness: 300, damping: 30 };

export const strip = (): SggoiTransition => {
  // Shared promise for coordinating OUT and IN animations
  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  return {
    in: (element) => {
      return {
        spring: DEFAULT_SPRING,
        prepare: (element) => {
          element.style.transform = "translateX(-100%)";
        },
        wait: async () => {
          // Wait for OUT animation to complete if it exists
          if (outAnimationComplete) {
            await outAnimationComplete;
          }
        },
        tick: (progress) => {
          const translateX = (1 - progress) * -100;
          element.style.transform = `translateX(${translateX}%)`;
        },
      };
    },
    out: (element, context) => {
      // Create promise for OUT animation completion
      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });

      return {
        spring: DEFAULT_SPRING,
        prepare: (element) => prepareOutgoing(element, context),
        tick: (_progress) => {
          const progress = 1 -_progress;
          const translateX = progress * 100;
          element.style.transform = `translateX(${translateX}%)`;
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