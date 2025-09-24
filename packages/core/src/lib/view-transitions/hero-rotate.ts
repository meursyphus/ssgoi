import type { SpringConfig, SggoiTransition } from "../types";

interface JaeminOptions {
  spring?: Partial<SpringConfig>;
  initialRotation?: number; // Initial rotation angle in degrees
  initialScale?: number; // Initial scale factor
  rotationTriggerPoint?: number; // Progress point where rotation starts (0-1)
}

/**
 * Jaemin Transition
 *
 * Implements a shared element transition where:
 * 1. Page A fades out
 * 2. Page B appears rotated and scaled down at center
 * 3. Page B scales up while rotating back to normal
 *
 * Based on analyzed animation log data showing 45° rotation over 1.728s
 * Created by Jaemin
 */
export const jaemin = (options: JaeminOptions = {}): SggoiTransition => {
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
          stiffness: 80,
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
          // Calculate border radius once and store as CSS custom property
          const maxBorderRadius =
            Math.min(window.innerWidth, window.innerHeight) * 0.4;
          element.style.setProperty(
            "--max-border-radius",
            `${maxBorderRadius}px`,
          );
          element.style.setProperty("--border-radius-scale", "1");

          // GPU acceleration hints
          element.style.willChange = "transform";
          element.style.backfaceVisibility = "hidden";

          // Set up the incoming page for animation with fixed viewport positioning
          element.style.transformOrigin = "50% 50%";
          element.style.position = "fixed";
          element.style.top = "0";
          element.style.left = "0";
          element.style.width = "100vw";
          element.style.height = "100vh";
          element.style.zIndex = "1000";
          element.style.overflow = "hidden"; // Clip content during scaling

          // Start with rotated and scaled state and initial border radius
          element.style.transform = `rotate(${initialRotation}deg) scale(${initialScale}) translateZ(0)`;
          element.style.borderRadius = `calc(var(--max-border-radius) * var(--border-radius-scale))`;
          element.style.opacity = "1";
        },
        tick: (progress) => {
          // Calculate current scale with 3-phase timing (no visual effects yet)
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

          // Calculate rotation with staggered timing
          let currentRotation: number;
          const rotationStartPoint = 0.7; // Start rotation at 70%
          if (progress <= rotationStartPoint) {
            // Keep full rotation until 70%
            currentRotation = initialRotation;
          } else {
            // 70-100%: rotate from full to 0 degrees
            const finalProgress =
              (progress - rotationStartPoint) / (1 - rotationStartPoint);
            const easedFinalProgress = 1 - Math.pow(1 - finalProgress, 2);
            currentRotation = initialRotation * (1 - easedFinalProgress);
          }

          // Border radius scale factor: sync with rotation timing (70-100%)
          let borderRadiusScale: number;
          if (progress <= rotationStartPoint) {
            // Keep fully rounded until rotation starts (70%)
            borderRadiusScale = 1;
          } else {
            // Rapidly become rectangular during rotation phase (70-100%)
            const borderProgress =
              (progress - rotationStartPoint) / (1 - rotationStartPoint);
            // Very aggressive curve - radius disappears quickly as rotation completes
            const easedProgress = Math.pow(borderProgress, 0.5); // Square root for fast early change
            borderRadiusScale = 1 - easedProgress;
          }

          // Apply transform and border radius scale
          element.style.transform = `rotate(${currentRotation.toFixed(2)}deg) scale(${currentScale.toFixed(4)}) translateZ(0)`;
          element.style.setProperty(
            "--border-radius-scale",
            borderRadiusScale.toFixed(4),
          );
        },
        onEnd: () => {
          // Clean up optimization hints
          element.style.willChange = "";
          element.style.backfaceVisibility = "";

          // Reset CSS custom properties
          element.style.removeProperty("--max-border-radius");
          element.style.removeProperty("--border-radius-scale");

          // Reset to original styles
          element.style.transform = originalTransform;
          element.style.transformOrigin = originalTransformOrigin;
          element.style.position = originalPosition;
          element.style.zIndex = originalZIndex;
          element.style.top = "";
          element.style.left = "";
          element.style.width = "";
          element.style.height = "";
          element.style.overflow = "";
          element.style.borderRadius = "";
        },
      };
    },
  };
};

/**
 * Jaemin Reverse Transition
 *
 * Simple fade out for reverse navigation
 * Created by Jaemin
 */
export const jaeminReverse = (
  options: Pick<JaeminOptions, "spring"> = {},
): SggoiTransition => {
  const spring: SpringConfig = {
    // Much slower, more visible fade out for reverse navigation
    stiffness: options.spring?.stiffness ?? 80,
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
