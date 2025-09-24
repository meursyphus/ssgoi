import type {
  SpringConfig,
  SggoiTransition,
  SggoiTransitionContext,
} from "../types";
import { getRect } from "../utils/get-rect";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { sleep } from "../utils/sleep";

interface JaeminOptions {
  spring?: Partial<SpringConfig>;
  initialRotation?: number; // Initial rotation angle in degrees
  initialScale?: number; // Initial scale factor
  rotationTriggerPoint?: number; // Progress point where rotation starts (0-1)
  transitionDelay?: number; // Delay between out and in animations
}

/**
 * Calculate the visible viewport rect for jaemin transition
 */
function getJaeminRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const top = context.scroll.y;

  return {
    top,
    left: 0,
    width: containerRect.width,
    height: window.innerHeight - containerRect.top,
  };
}

/**
 * Set transform-origin to the center of jaemin rect
 */
function applyJaeminTransformOrigin(
  element: HTMLElement,
  rect: ReturnType<typeof getJaeminRect>,
) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  element.style.transformOrigin = `${centerX}px ${centerY}px`;
}

/**
 * Apply clipPath to limit element visibility to jaemin rect
 * Supports dynamic border radius for circular/rounded rect clip
 */
function applyJaeminClip(
  element: HTMLElement,
  rect: ReturnType<typeof getJaeminRect>,
  borderRadiusPercent: number = 0, // 0 = rectangle, 1 = maximum roundness
) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  if (borderRadiusPercent > 0.95) {
    // Near-circular: use circle clip for smoother rendering
    const radius = Math.min(rect.width, rect.height) / 2;
    element.style.clipPath = `circle(${radius * borderRadiusPercent}px at ${centerX}px ${centerY}px)`;
  } else if (borderRadiusPercent > 0.01) {
    // Rounded rectangle using inset with border-radius
    const insetRadius = Math.min(rect.width, rect.height) * 0.4 * borderRadiusPercent;
    element.style.clipPath = `inset(${rect.top}px ${window.innerWidth - rect.left - rect.width}px ${window.innerHeight - rect.top - rect.height}px ${rect.left}px round ${insetRadius}px)`;
  } else {
    // Perfect rectangle
    element.style.clipPath = `polygon(
      ${rect.left}px ${rect.top}px,
      ${rect.left + rect.width}px ${rect.top}px,
      ${rect.left + rect.width}px ${rect.top + rect.height}px,
      ${rect.left}px ${rect.top + rect.height}px
    )`;
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
  const spring: SpringConfig = {
    // Much slower animation - 4x duration by reducing stiffness further
    stiffness: options.spring?.stiffness ?? 50,
    damping: options.spring?.damping ?? 30,
  };

  const initialRotation = options.initialRotation ?? 45; // 45 degrees from log data
  const initialScale = options.initialScale ?? 0.01; // Very small initial size - like a tiny dot
  const rotationTriggerPoint = options.rotationTriggerPoint ?? 0.8; // 80% point for dramatic final transformation
  const transitionDelay = options.transitionDelay ?? 100; // Delay between out and in animations

  // Shared promise for coordinating OUT and IN animations
  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  return {
    out: async (element, context) => {
      const originalOpacity = element.style.opacity;

      // Create promise for OUT animation completion
      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });

      return {
        spring: {
          stiffness: 80,
          damping: 25,
        },
        from: 1,
        to: 0,
        prepare: () => {
          prepareOutgoing(element, context);
          element.style.opacity = "1";
        },
        tick: (progress) => {
          element.style.opacity = String(progress);
        },
        onEnd: () => {
          element.style.opacity = originalOpacity;
          // Resolve the promise when OUT animation completes
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
        },
      };
    },
    in: async (element, context) => {
      const rect = getJaeminRect(context);
      const originalTransform = element.style.transform;
      const originalTransformOrigin = element.style.transformOrigin;
      const originalClipPath = element.style.clipPath;

      return {
        spring,
        from: 0,
        to: 1,
        prepare: () => {
          // GPU acceleration hints
          element.style.willChange = "transform, clip-path";
          element.style.backfaceVisibility = "hidden";

          // Set transform origin to center of visible rect
          applyJaeminTransformOrigin(element, rect);

          // Apply initial clip path (fully rounded when small)
          applyJaeminClip(element, rect, 1);

          // Start with rotated and scaled state
          element.style.transform = `rotate(${initialRotation}deg) scale(${initialScale}) translateZ(0)`;

          // Start with opacity 0 to hide until OUT completes
          element.style.opacity = "0";
        },
        wait: async () => {
          // Wait for OUT animation to complete if it exists
          if (outAnimationComplete) {
            await outAnimationComplete;
            // Configurable delay after OUT completes
            await sleep(transitionDelay);
          }
          // Now make it visible
          element.style.opacity = "1";
        },
        tick: (progress) => {
          // Calculate current scale with 3-phase timing
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
          let borderRadiusPercent: number;
          if (progress <= rotationStartPoint) {
            // Keep fully rounded until rotation starts (70%)
            borderRadiusPercent = 1;
          } else {
            // Rapidly become rectangular during rotation phase (70-100%)
            const borderProgress =
              (progress - rotationStartPoint) / (1 - rotationStartPoint);
            // Very aggressive curve - radius disappears quickly as rotation completes
            const easedProgress = Math.pow(borderProgress, 0.5); // Square root for fast early change
            borderRadiusPercent = 1 - easedProgress;
          }

          // Apply transform and dynamic clip path
          element.style.transform = `rotate(${currentRotation.toFixed(2)}deg) scale(${currentScale.toFixed(4)}) translateZ(0)`;
          applyJaeminClip(element, rect, borderRadiusPercent);
        },
        onEnd: () => {
          // Clean up optimization hints
          element.style.willChange = "";
          element.style.backfaceVisibility = "";

          // Reset to original styles
          element.style.transform = originalTransform;
          element.style.transformOrigin = originalTransformOrigin;
          element.style.clipPath = originalClipPath;
        },
      };
    },
  };
};