import type { SpringConfig, SggoiTransition } from "../types";

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
    // Much slower animation - 4x duration by reducing stiffness further
    stiffness: options.spring?.stiffness ?? 50,
    damping: options.spring?.damping ?? 30,
  };

  const initialRotation = options.initialRotation ?? 45; // 45 degrees from log data
  const initialScale = options.initialScale ?? 0.01; // Very small initial size - like a tiny dot
  const rotationTriggerPoint = options.rotationTriggerPoint ?? 0.8; // 80% point for dramatic final transformation

  return {
    out: async (element) => {
      // Store original styles for cleanup
      const originalOpacity = element.style.opacity;

      return {
        spring: {
          stiffness: 300, // Faster spring for quick fade out
          damping: 25,
        },
        from: 1,
        to: 0,
        prepare: () => {
          // Ensure element is visible at start
          element.style.opacity = "1";
        },
        tick: (progress) => {
          // Simple linear fade out - no rotation or scaling
          element.style.opacity = String(progress);
        },
        onEnd: () => {
          // Reset opacity
          element.style.opacity = originalOpacity;
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
          // Set up the incoming page for animation with stable positioning
          element.style.transformOrigin = "center center";
          element.style.position = "relative";
          element.style.zIndex = "1000";

          // Start with rotated and scaled state
          element.style.transform = `rotate(${initialRotation}deg) scale(${initialScale})`;
          element.style.opacity = "1";
        },
        tick: (progress) => {
          // Calculate current scale - very slow growth to rotationTriggerPoint, then final push
          let currentScale: number;
          if (progress <= 0.05) {
            // Entry phase (0-5%): stay very small
            currentScale = initialScale;
          } else if (progress <= rotationTriggerPoint) {
            // Trans phase (5-80%): gradual growth with nonic curve
            const transProgress =
              (progress - 0.05) / (rotationTriggerPoint - 0.05);
            const easedProgress = Math.pow(transProgress, 9); // Nonic for ultra slow start
            currentScale = initialScale + (0.8 - initialScale) * easedProgress;
          } else {
            // Final 20%: scale from 0.8 to 1.0
            const finalProgress =
              (progress - rotationTriggerPoint) / (1 - rotationTriggerPoint);
            const easedFinalProgress = 1 - Math.pow(1 - finalProgress, 3);
            currentScale = 0.8 + 0.2 * easedFinalProgress;
          }

          // Add dramatic glow effect during final transformation
          let glowIntensity = 0;
          if (progress > rotationTriggerPoint) {
            const glowProgress =
              (progress - rotationTriggerPoint) / (1 - rotationTriggerPoint);
            glowIntensity = Math.pow(glowProgress, 2) * 3; // Intense glow in final 20%
          }
          const boxShadow = `0 0 ${glowIntensity * 60}px rgba(255, 255, 255, ${glowIntensity * 0.4})`;

          // Border radius effect: starts very round, becomes rectangular in final 20%
          const maxBorderRadius =
            Math.min(window.innerWidth, window.innerHeight) * 0.5;
          let currentBorderRadius: number;
          if (progress <= rotationTriggerPoint) {
            // Keep circular until trigger point (80%)
            currentBorderRadius = maxBorderRadius;
          } else {
            // Quickly become rectangular in final 20%
            const borderProgress =
              (progress - rotationTriggerPoint) / (1 - rotationTriggerPoint);
            const easedBorderProgress = Math.pow(borderProgress, 2); // Ease-in for quick change
            currentBorderRadius = maxBorderRadius * (1 - easedBorderProgress);
          }

          // Calculate rotation - starts earlier than scale for more natural movement
          let currentRotation: number;
          const rotationStartPoint = 0.7; // Start rotation at 70%
          if (progress <= rotationStartPoint) {
            // Keep full rotation until 70%
            currentRotation = initialRotation;
          } else {
            // 70-100%: rotate from full to 0 degrees (rotation phase)
            const finalProgress =
              (progress - rotationStartPoint) / (1 - rotationStartPoint);
            const easedFinalProgress = 1 - Math.pow(1 - finalProgress, 2);
            currentRotation = initialRotation * (1 - easedFinalProgress);
          }

          // Apply the combined transform with tunnel effect
          element.style.transform = `rotate(${currentRotation.toFixed(2)}deg) scale(${currentScale.toFixed(4)})`;
          element.style.boxShadow = boxShadow;
          element.style.borderRadius = `${currentBorderRadius.toFixed(2)}px`;
          element.style.transition = "box-shadow 0.1s ease-out";
          element.style.overflow = "hidden"; // Ensure content respects border radius
        },
        onEnd: () => {
          // Reset to original styles including tunnel effects
          element.style.transform = originalTransform;
          element.style.transformOrigin = originalTransformOrigin;
          element.style.position = originalPosition;
          element.style.zIndex = originalZIndex;
          element.style.boxShadow = "";
          element.style.transition = "";
          element.style.borderRadius = "";
          element.style.overflow = "";
        },
      };
    },
  };
};

/**
 * Hero Rotate Reverse Transition
 *
 * Simple fade out for reverse navigation
 */
export const heroRotateReverse = (
  options: Pick<HeroRotateOptions, "spring"> = {},
): SggoiTransition => {
  const spring: SpringConfig = {
    // Fast fade out for reverse navigation
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 25,
  };

  return {
    out: async (element) => {
      const originalOpacity = element.style.opacity;

      return {
        spring,
        from: 1,
        to: 0,
        prepare: () => {
          element.style.opacity = "1";
        },
        tick: (progress) => {
          // Simple fade out
          element.style.opacity = String(progress);
        },
        onEnd: () => {
          element.style.opacity = originalOpacity;
        },
      };
    },
    in: async (element) => {
      const originalOpacity = element.style.opacity;

      return {
        spring,
        from: 0,
        to: 1,
        prepare: () => {
          element.style.opacity = "0";
        },
        tick: (progress) => {
          // Simple fade in
          element.style.opacity = String(progress);
        },
        onEnd: () => {
          element.style.opacity = originalOpacity;
        },
      };
    },
  };
};
