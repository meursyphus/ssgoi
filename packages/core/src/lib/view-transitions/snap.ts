import type { PhysicsOptions, SggoiTransition, StyleObject } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { withResolvers } from "../utils";

const TRANSLATE_OFFSET = 6; // px
const OUT_OPACITY_MIN = 0; // OUT: 1 → this value
const IN_OPACITY_START = 1; // IN: this value → 1

const DEFAULT_PHYSICS: PhysicsOptions = {
  inertia: {
    acceleration: 50,
    resistance: 1.5,
  },
};

interface SnapOptions {
  direction?: "left" | "right";
  physics?: PhysicsOptions;
}

/**
 * Snap transition - fast, subtle page transition with directional slide
 *
 * - OUT: Fade out + slide in same direction (waits for completion before IN)
 * - IN: Fade in + slide from opposite direction
 */
export const snap = (options: SnapOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "left";
  const physicsOptions = options.physics ?? DEFAULT_PHYSICS;

  const isLeft = direction === "left";

  // Shared promise for coordinating OUT and IN animations
  let { promise: outAnimationComplete, resolve: resolveOutAnimation } =
    withResolvers<void>();

  return {
    // Entering page: fades in + slides from opposite direction
    in: (element) => {
      const getCss = (progress: number): StyleObject => {
        const translateX = isLeft
          ? (1 - progress) * TRANSLATE_OFFSET
          : (1 - progress) * -TRANSLATE_OFFSET;
        const opacity = IN_OPACITY_START + progress * (1 - IN_OPACITY_START);
        return {
          transform: `translate3d(${translateX}px, 0, 0)`,
          opacity,
        };
      };

      const update = (progress: number): void => {
        const style = getCss(progress);
        element.style.transform = style.transform as string;
        element.style.opacity = String(style.opacity);
      };

      return {
        physics: physicsOptions,
        prepare: () => {
          element.style.willChange = "transform, opacity";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        },
        update,
        wait: async () => {
          if (outAnimationComplete) {
            await outAnimationComplete;
            const newResolvers = withResolvers<void>();
            outAnimationComplete = newResolvers.promise;
            resolveOutAnimation = newResolvers.resolve;
          }
        },
        css: getCss,
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
      const getCss = (progress: number): StyleObject => {
        const translateX = isLeft
          ? (1 - progress) * -TRANSLATE_OFFSET
          : (1 - progress) * TRANSLATE_OFFSET;
        const opacity = OUT_OPACITY_MIN + progress * (1 - OUT_OPACITY_MIN);
        return {
          transform: `translate3d(${translateX}px, 0, 0)`,
          opacity,
        };
      };

      const update = (progress: number): void => {
        const style = getCss(progress);
        element.style.transform = style.transform as string;
        element.style.opacity = String(style.opacity);
      };

      return {
        physics: physicsOptions,
        prepare: () => {
          prepareOutgoing(element, context);
          element.style.willChange = "transform, opacity";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          element.style.pointerEvents = "none";
        },
        update,
        css: getCss,
        onEnd: () => {
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
