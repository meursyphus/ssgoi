import type { SggoiTransition, StyleObject, PhysicsOptions } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 17, damping: 6 },
};
const ROTATE_Y = 20;
const PERSPECTIVE = 800;

interface StripOptions {
  physics?: PhysicsOptions;
}

export const strip = (options: StripOptions = {}): SggoiTransition => {
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;
  // Shared promise for coordinating OUT and IN animations
  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  return {
    in: (element) => {
      return {
        physics: physicsOptions,
        prepare: () => {
          // GPU acceleration hints
          element.style.willChange = "transform";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          // Set initial transform for css keyframe generation
          element.style.transform = `perspective(${PERSPECTIVE}px) rotateY(${ROTATE_Y}deg) translate3d(-100%, 0, 0)`;
        },
        wait: async () => {
          // Wait for OUT animation to complete if it exists
          if (outAnimationComplete) {
            await outAnimationComplete;
          }
        },
        css: (progress): StyleObject => {
          const rotateY = (1 - progress) * ROTATE_Y;
          const translateX = -(1 - progress) * 100;
          return {
            transform: `perspective(${PERSPECTIVE}px) rotateY(${rotateY}deg) translate3d(${translateX}%, 0, 0)`,
          };
        },
        onEnd: () => {
          element.style.transform = "";
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
        },
      };
    },
    out: (element, context) => {
      // Create promise for OUT animation completion
      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });

      return {
        physics: physicsOptions,
        prepare: () => {
          prepareOutgoing(element, context);
          // GPU acceleration hints
          element.style.willChange = "transform";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          element.style.pointerEvents = "none";
          // Set initial transform for css keyframe generation
          element.style.transform = `perspective(${PERSPECTIVE}px) rotateY(0deg) translate3d(0%, 0, 0)`;
        },
        css: (_progress): StyleObject => {
          const progress = 1 - _progress;
          const rotateY = progress * ROTATE_Y;
          const translateX = progress * 100;
          return {
            transform: `perspective(${PERSPECTIVE}px) rotateY(${-rotateY}deg) translate3d(${translateX}%, 0, 0)`,
          };
        },
        onEnd: () => {
          // Resolve the promise when OUT animation completes
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
          element.style.transform = "";
        },
      };
    },
  };
};
