import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing, timeToSpring, sleep } from "../utils";

interface FadeOptions {
  spring?: Partial<SpringConfig>;
}

export const fade = (options: FadeOptions = {}): SggoiTransition => {
  // Out animation: 100ms (0.1s)
  const outSpring = timeToSpring(0.1);
  // In animation: 200ms (0.2s)
  const inSpring = timeToSpring(0.2);
  
  // Shared promise for coordinating OUT and IN animations
  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  return {
    in: async (element) => {
      // Set initial opacity to 0
      element.style.opacity = "0";
      
      // Wait for OUT animation to complete if it exists
      if (outAnimationComplete) {
        await outAnimationComplete;
        // Additional 200ms delay after OUT completes
        await sleep(200);
      }
      
      return {
        spring: {
          stiffness: options.spring?.stiffness ?? inSpring.stiffness,
          damping: options.spring?.damping ?? inSpring.damping,
        },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
      };
    },
    out: (element) => {
      // Create promise for OUT animation completion
      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });
      
      return {
        spring: {
          stiffness: options.spring?.stiffness ?? outSpring.stiffness,
          damping: options.spring?.damping ?? outSpring.damping,
        },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
        prepare: prepareOutgoing,
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
