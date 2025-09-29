import type {
  SpringConfig,
  SggoiTransition,
  SggoiTransitionContext,
} from "../types";
import { getRect } from "../utils/get-rect";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface JaeminOptions {
  spring?: Partial<SpringConfig>;
  initialRotation?: number; // Initial rotation angle in degrees
  initialScale?: number; // Initial scale factor
  rotationTriggerPoint?: number; // Progress point where rotation starts (0-1)
}

// Internal interface for demo usage only - not exported
interface JaeminInternalOptions extends JaeminOptions {
  containerMode?: "positioned-parent" | "viewport"; // Container mode (default: 'viewport')
}

/**
 * Calculate the visible viewport rect for jaemin transition
 */
function getJaeminRect(
  context: SggoiTransitionContext,
  containerMode: "positioned-parent" | "viewport" = "viewport",
) {
  if (containerMode === "positioned-parent") {
    // Use positioned parent bounds for demos/modals
    const positionedParentRect =
      context.positionedParent.getBoundingClientRect();
    return {
      top: positionedParentRect.top,
      left: positionedParentRect.left,
      width: positionedParentRect.width,
      height: positionedParentRect.height,
    };
  } else {
    // Default: Use full viewport calculation
    const containerRect = getRect(document.body, context.positionedParent);
    const top = context.scroll.y;

    return {
      top,
      left: 0,
      width: containerRect.width,
      height: window.innerHeight - containerRect.top,
    };
  }
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
  return jaeminInternal(options);
};

// Internal implementation that supports containerMode for demo usage
export const jaeminInternal = (
  options: JaeminInternalOptions = {},
): SggoiTransition => {
  const spring: SpringConfig = {
    // Much slower animation - 4x duration by reducing stiffness further
    stiffness: options.spring?.stiffness ?? 50,
    damping: options.spring?.damping ?? 30,
  };

  const initialRotation = options.initialRotation ?? 45; // 45 degrees from log data
  const initialScale = options.initialScale ?? 0.01; // Very small initial size - like a tiny dot
  const rotationTriggerPoint = options.rotationTriggerPoint ?? 0.8; // 80% point for dramatic final transformation
  const containerMode = options.containerMode ?? "viewport"; // Default to viewport

  return {
    out: async (element, context) => {
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
          prepareOutgoing(element, context);
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
    in: async (element, context) => {
      const rect = getJaeminRect(context, containerMode);

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
          const maxBorderRadius = Math.min(rect.width, rect.height) * 0.4;
          element.style.setProperty(
            "--max-border-radius",
            `${maxBorderRadius}px`,
          );
          element.style.setProperty("--border-radius-scale", "1");

          // GPU acceleration hints
          element.style.willChange = "transform";
          element.style.backfaceVisibility = "hidden";

          // Set up transform origin and positioning based on container mode
          if (containerMode === "positioned-parent") {
            // Use percentage-based transform origin for demo environments
            element.style.transformOrigin = "50% 50%";
            // Use absolute positioning relative to the container
            element.style.position = "absolute";
            element.style.top = "0px";
            element.style.left = "0px";
            element.style.width = `${rect.width}px`;
            element.style.height = `${rect.height}px`;
          } else {
            // Default viewport mode: use absolute positioning for precise control
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            element.style.transformOrigin = `${centerX}px ${centerY}px`;
            // Use fixed positioning for full browser
            element.style.position = "fixed";
            element.style.top = `${rect.top}px`;
            element.style.left = `${rect.left}px`;
            element.style.width = `${rect.width}px`;
            element.style.height = `${rect.height}px`;
          }
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
