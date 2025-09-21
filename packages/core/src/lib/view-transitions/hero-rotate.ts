import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface HeroRotateOptions {
  spring?: Partial<SpringConfig>;
  initialRotation?: number; // Initial rotation angle in degrees
  initialScale?: number; // Initial scale factor
  rotationTriggerPoint?: number; // Progress point where rotation starts (0-1)
}

/**
 * Hero Rotate Transition
 *
 * Implements a shared element transition where:
 * 1. Page A fades out
 * 2. Page B appears rotated and scaled down at center
 * 3. Page B scales up while rotating back to normal
 *
 * Based on analyzed animation log data showing 45° rotation over 1.728s
 */
export const heroRotate = (
  options: HeroRotateOptions = {},
): SggoiTransition => {
  const spring: SpringConfig = {
    // Matched to analyzed timing: 1.728s with ease-out characteristics
    stiffness: options.spring?.stiffness ?? 180,
    damping: options.spring?.damping ?? 25,
  };

  const initialRotation = options.initialRotation ?? 45; // 45 degrees from log data
  const initialScale = options.initialScale ?? 0.3; // Small initial size
  const rotationTriggerPoint = options.rotationTriggerPoint ?? 0.66; // 2/3 point from description

  return {
    out: async (element) => {
      return {
        spring,
        from: 1,
        to: 0,
        prepare: (element) => {
          prepareOutgoing(element);
        },
        tick: (progress) => {
          // Fade out the outgoing page
          element.style.opacity = String(progress);
        },
      };
    },
    in: async (element) => {
      // Store original styles for cleanup
      const originalTransform = element.style.transform;
      const originalTransformOrigin = element.style.transformOrigin;
      const originalPosition = element.style.position;
      const originalZIndex = element.style.zIndex;

      return {
        spring,
        from: 0,
        to: 1,
        prepare: () => {
          // Set up the incoming page for animation
          element.style.transformOrigin = "center center";
          element.style.position = "relative";
          element.style.zIndex = "1000";

          // Start with rotated and scaled state
          element.style.transform = `rotate(${initialRotation}deg) scale(${initialScale})`;
          element.style.opacity = "1";
        },
        tick: (progress) => {
          // Calculate current scale (from initialScale to 1.0)
          const currentScale = initialScale + (1 - initialScale) * progress;

          // Calculate rotation based on trigger point
          let currentRotation: number;
          if (progress <= rotationTriggerPoint) {
            // No rotation change until trigger point
            currentRotation = initialRotation;
          } else {
            // Rotate from initialRotation to 0 after trigger point
            const rotationProgress =
              (progress - rotationTriggerPoint) / (1 - rotationTriggerPoint);
            currentRotation = initialRotation * (1 - rotationProgress);
          }

          // Apply the combined transform
          element.style.transform = `rotate(${currentRotation}deg) scale(${currentScale})`;
        },
        onEnd: () => {
          // Reset to original styles
          element.style.transform = originalTransform;
          element.style.transformOrigin = originalTransformOrigin;
          element.style.position = originalPosition;
          element.style.zIndex = originalZIndex;
        },
      };
    },
  };
};
