import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface ScrollOptions {
  direction?: "up" | "down";
  spring?: Partial<SpringConfig>;
}

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 5,
  damping: 4,
};

export const scroll = (options: ScrollOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "up";
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? DEFAULT_SPRING.stiffness,
    damping: options.spring?.damping ?? DEFAULT_SPRING.damping,
  };

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
        spring,
        tick: (progress) => {
          // Check if height is calculated
          if (calculatedHeight === null) {
            // Try to calculate if not done yet
            calculatedHeight = calculateHeight();
            if (calculatedHeight === null) return; // Still not ready
          }

          const translateY = isUp
            ? (1 - progress) * calculatedHeight // calculatedHeight → 0
            : (1 - progress) * -calculatedHeight; // -calculatedHeight → 0
          element.style.transform = `translateY(${translateY}px)`;
        },
      };
    },
    out: (element) => ({
      spring,
      onStart: () => {
        // Capture outgoing element height at animation start (before detached)
        outElementHeight = element.offsetHeight;

        // Calculate height if both values are ready
        if (inElementHeight !== null) {
          calculatedHeight = calculateHeight();
        }
      },
      tick: (progress) => {
        // Check if height is calculated
        if (calculatedHeight === null) {
          // Try to calculate if not done yet
          calculatedHeight = calculateHeight();
          if (calculatedHeight === null) return; // Still not ready
        }

        const translateY = isUp
          ? (1 - progress) * -calculatedHeight // 0 → -calculatedHeight
          : (1 - progress) * calculatedHeight; // 0 → calculatedHeight
        element.style.transform = `translateY(${translateY}px)`;
      },
      prepare: (element) => {
        prepareOutgoing(element);

        element.style.zIndex = isUp ? "-1" : "1";
      },
    }),
  };
};
