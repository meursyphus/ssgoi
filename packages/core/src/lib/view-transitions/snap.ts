import type { SpringConfig, SggoiTransition, StyleObject } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { withResolvers } from "../utils";

const TRANSLATE_OFFSET = 6; // px
const OUT_OPACITY_MIN = 0; // OUT: 1 → this value
const IN_OPACITY_START = 1; // IN: this value → 1

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 3050,
  damping: 42,
  doubleSpring: 0.5,
};

interface SnapOptions {
  direction?: "left" | "right";
  spring?: Partial<SpringConfig>;
}

/**
 * Snap transition - fast, subtle page transition with directional slide
 *
 * - OUT: Fade out + slide in same direction (waits for completion before IN)
 * - IN: Fade in + slide from opposite direction
 */
export const snap = (options: SnapOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "left";
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? DEFAULT_SPRING.stiffness,
    damping: options.spring?.damping ?? DEFAULT_SPRING.damping,
    doubleSpring: options.spring?.doubleSpring ?? DEFAULT_SPRING.doubleSpring,
  };

  const isLeft = direction === "left";

  // Shared promise for coordinating OUT and IN animations
  let { promise: outAnimationComplete, resolve: resolveOutAnimation } =
    withResolvers<void>();

  return {
    // Entering page: fades in + slides from opposite direction
    in: (element) => {
      return {
        spring,
        prepare: () => {
          element.style.opacity = "0";
          element.style.willChange = "transform, opacity";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        },
        wait: async () => {
          // Wait for OUT animation to complete
          if (outAnimationComplete) {
            await outAnimationComplete;
            const newResolvers = withResolvers<void>();
            outAnimationComplete = newResolvers.promise;
            resolveOutAnimation = newResolvers.resolve;
          }
        },
        css: (progress): StyleObject => {
          // Slide from opposite direction
          // If direction="left", IN page slides from right (positive → 0)
          // If direction="right", IN page slides from left (negative → 0)
          const translateX = isLeft
            ? (1 - progress) * TRANSLATE_OFFSET
            : (1 - progress) * -TRANSLATE_OFFSET;

          // Opacity: IN_OPACITY_START → 1
          const opacity = IN_OPACITY_START + progress * (1 - IN_OPACITY_START);

          return {
            transform: `translate3d(${translateX}px, 0, 0)`,
            opacity,
          };
        },
        onEnd: () => {
          element.style.opacity = "1";
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
        },
      };
    },
    // Exiting page: fade out + slide in same direction as navigation
    out: (element, context) => {
      return {
        spring,
        prepare: () => {
          prepareOutgoing(element, context);
          element.style.willChange = "transform, opacity";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          element.style.pointerEvents = "none";
        },
        css: (progress): StyleObject => {
          // Slide in the same direction as navigation
          // If direction="left", OUT page slides left (0 → -8px)
          // If direction="right", OUT page slides right (0 → 8px)
          const translateX = isLeft
            ? (1 - progress) * -TRANSLATE_OFFSET
            : (1 - progress) * TRANSLATE_OFFSET;

          // Opacity: 1 → OUT_OPACITY_MIN
          const opacity = OUT_OPACITY_MIN + progress * (1 - OUT_OPACITY_MIN);

          return {
            transform: `translate3d(${translateX}px, 0, 0)`,
            opacity,
          };
        },
        onEnd: () => {
          // Resolve the promise when OUT animation completes
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
        },
      };
    },
  };
};
