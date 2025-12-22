import type { SggoiTransition, PhysicsOptions } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface ScrollOptions {
  direction?: "up" | "down";
  physics?: PhysicsOptions;
}

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 5, damping: 4 },
};

export const scroll = (options: ScrollOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "up";
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;

  const isUp = direction === "up";

  // Shared state between out and in animations
  let outElementHeight: number | null = null;
  let inElementHeight: number | null = null;
  let calculatedHeight: number | null = null;

  // Common height calculation function
  const calculateHeight = (): number | null => {
    // Both heights must be available
    if (outElementHeight === null || inElementHeight === null) {
      return null;
    }

    // Min of out and in heights, then max with viewport
    const minHeight = Math.min(outElementHeight, inElementHeight);
    const viewportHeight = window.innerHeight;
    return Math.max(minHeight, viewportHeight);
  };

  return {
    in: (element) => {
      // Get incoming element height before animation starts
      inElementHeight = element.offsetHeight;

      // Calculate height if both values are ready
      if (outElementHeight !== null) {
        calculatedHeight = calculateHeight();
      }

      return {
        physics: physicsOptions,
        prepare: () => {
          // GPU acceleration hints
          element.style.willChange = "transform";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        },
        tick: (progress) => {
          // Use cached height or recalculate
          if (calculatedHeight === null) {
            calculatedHeight = calculateHeight();
          }
          const height = calculatedHeight ?? window.innerHeight;

          const translateY = isUp
            ? (1 - progress) * height
            : (1 - progress) * -height;

          element.style.transform = `translate3d(0, ${translateY}px, 0)`;
        },
        onEnd: () => {
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
        },
      };
    },
    out: (element, context) => ({
      physics: physicsOptions,
      onStart: () => {
        // Capture outgoing element height at animation start (before detached)
        outElementHeight = element.offsetHeight;

        // Calculate height if both values are ready
        if (inElementHeight !== null) {
          calculatedHeight = calculateHeight();
        }
      },
      tick: (progress) => {
        // Use cached height or recalculate
        if (calculatedHeight === null) {
          calculatedHeight = calculateHeight();
        }
        const height = calculatedHeight ?? window.innerHeight;

        const translateY = isUp
          ? (1 - progress) * -height
          : (1 - progress) * height;

        element.style.transform = `translate3d(0, ${translateY}px, 0)`;
      },
      prepare: (el) => {
        prepareOutgoing(el, context);
        el.style.zIndex = isUp ? "-1" : "1";
        // GPU acceleration hints
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.pointerEvents = "none";
      },
    }),
  };
};
