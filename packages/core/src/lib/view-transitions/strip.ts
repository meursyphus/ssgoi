import type { SggoiTransition, StyleObject } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const DEFAULT_SPRING = { stiffness: 17, damping: 6 };
const ROTATE_Y = 20;
const PERSPECTIVE = 800;

export const strip = (): SggoiTransition => {
  // Shared promise for coordinating OUT and IN animations
  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  return {
    in: (element) => {
      return {
        spring: DEFAULT_SPRING,
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
        spring: DEFAULT_SPRING,
        prepare: (el) => {
          prepareOutgoing(el, context);
          // GPU acceleration hints
          el.style.willChange = "transform";
          el.style.backfaceVisibility = "hidden";
          (el.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          el.style.pointerEvents = "none";
          // Set initial transform for css keyframe generation
          el.style.transform = `perspective(${PERSPECTIVE}px) rotateY(0deg) translate3d(0%, 0, 0)`;
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
