import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing, timeToSpring, sleep } from "../utils";

// Default spring configurations for fade transitions
export const defaultOutSpring = timeToSpring(0.1); // 100ms
export const defaultInSpring = timeToSpring(0.2); // 200ms

interface FadeOptions {
  spring?: Partial<SpringConfig>;
}

export const fade = (options: FadeOptions = {}): SggoiTransition => {
  
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
          stiffness: options.spring?.stiffness ?? defaultInSpring.stiffness,
          damping: options.spring?.damping ?? defaultInSpring.damping,
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
          stiffness: options.spring?.stiffness ?? defaultOutSpring.stiffness,
          damping: options.spring?.damping ?? defaultOutSpring.damping,
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
