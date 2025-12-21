import type {
  SpringConfig,
  SggoiTransition,
  SggoiTransitionContext,
  PhysicsOptions,
} from "../types";
import { getRect } from "../utils/get-rect";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const DEFAULT_SPRING: SpringConfig = { stiffness: 50, damping: 30 };

interface JaeminOptions {
  physics?: PhysicsOptions;
  initialRotation?: number; // Initial rotation angle in degrees
  initialScale?: number; // Initial scale factor
  rotationTriggerPoint?: number; // Progress point where rotation starts (0-1)
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
  const physicsOptions: PhysicsOptions = options.physics ?? {
    spring: DEFAULT_SPRING,
  };

  const initialRotation = options.initialRotation ?? 45;
  const initialScale = options.initialScale ?? 0.01;
  const rotationTriggerPoint = options.rotationTriggerPoint ?? 0.8;

  return {
    out: async (element, context) => {
      const originalOpacity = element.style.opacity;

      return {
        physics: {
          spring: {
            stiffness: 80,
            damping: 25,
          },
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
        },
      };
    },
    in: async (element, context) => {
      const rect = getJaeminRect(context);

      const originalTransform = element.style.transform;
      const originalTransformOrigin = element.style.transformOrigin;
      const originalPosition = element.style.position;
      const originalZIndex = element.style.zIndex;

      return {
        physics: physicsOptions,
        from: 0,
        to: 1,
        prepare: () => {
          const maxBorderRadius = Math.min(rect.width, rect.height) * 0.4;
          element.style.setProperty(
            "--max-border-radius",
            `${maxBorderRadius}px`,
          );
          element.style.setProperty("--border-radius-scale", "1");

          element.style.willChange = "transform";
          element.style.backfaceVisibility = "hidden";

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          element.style.transformOrigin = `${centerX}px ${centerY}px`;
          element.style.position = "fixed";
          element.style.top = `${rect.top}px`;
          element.style.left = `${rect.left}px`;
          element.style.width = `${rect.width}px`;
          element.style.height = `${rect.height}px`;
          element.style.zIndex = "1000";
          element.style.overflow = "hidden";

          element.style.transform = `rotate(${initialRotation}deg) scale(${initialScale}) translateZ(0)`;
          element.style.borderRadius = `calc(var(--max-border-radius) * var(--border-radius-scale))`;
          element.style.opacity = "1";
        },
        tick: (progress) => {
          let currentScale: number;
          if (progress <= 0.05) {
            currentScale = initialScale;
          } else if (progress <= rotationTriggerPoint) {
            const transProgress =
              (progress - 0.05) / (rotationTriggerPoint - 0.05);
            const easedProgress = Math.pow(transProgress, 9);
            currentScale = initialScale + (0.8 - initialScale) * easedProgress;
          } else {
            const finalProgress =
              (progress - rotationTriggerPoint) / (1 - rotationTriggerPoint);
            const easedFinalProgress = 1 - Math.pow(1 - finalProgress, 3);
            currentScale = 0.8 + 0.2 * easedFinalProgress;
          }

          let currentRotation: number;
          const rotationStartPoint = 0.7;
          if (progress <= rotationStartPoint) {
            currentRotation = initialRotation;
          } else {
            const finalProgress =
              (progress - rotationStartPoint) / (1 - rotationStartPoint);
            const easedFinalProgress = 1 - Math.pow(1 - finalProgress, 2);
            currentRotation = initialRotation * (1 - easedFinalProgress);
          }

          let borderRadiusScale: number;
          if (progress <= rotationStartPoint) {
            borderRadiusScale = 1;
          } else {
            const borderProgress =
              (progress - rotationStartPoint) / (1 - rotationStartPoint);
            const easedProgress = Math.pow(borderProgress, 0.5);
            borderRadiusScale = 1 - easedProgress;
          }

          element.style.transform = `rotate(${currentRotation.toFixed(2)}deg) scale(${currentScale.toFixed(4)}) translateZ(0)`;
          element.style.setProperty(
            "--border-radius-scale",
            borderRadiusScale.toFixed(4),
          );
        },
        onEnd: () => {
          element.style.willChange = "";
          element.style.backfaceVisibility = "";
          element.style.removeProperty("--max-border-radius");
          element.style.removeProperty("--border-radius-scale");
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
