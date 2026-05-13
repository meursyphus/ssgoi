import type { PhysicsOptions, TransitionConfig } from "@types";
import { getRect } from "@utils";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 50, damping: 30 },
};

const OUT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 80, damping: 25 },
};

export interface JaeminOptions {
  physics?: PhysicsOptions;
  initialRotation?: number;
  initialScale?: number;
  rotationTriggerPoint?: number;
}

function getJaeminRect(positionedParent: HTMLElement, scrollY: number) {
  const containerRect = getRect(document.body, positionedParent);
  return {
    top: scrollY,
    left: 0,
    width: containerRect.width,
    height: window.innerHeight - containerRect.top,
  };
}

/**
 * Jaemin transition — page A fades out while page B appears rotated and
 * scaled, then unwinds back to its natural size.
 *
 * Mapped to the new API as two WebAnimations in parallel. The "in" side uses
 * a single integrator and computes scale/rotation/border-radius from a
 * multi-stage easing inside the style function (originally three sequential
 * tick branches).
 */
export const jaemin = (options: JaeminOptions = {}): TransitionConfig => {
  const inPhysics = options.physics ?? DEFAULT_PHYSICS;
  const initialRotation = options.initialRotation ?? 45;
  const initialScale = options.initialScale ?? 0.01;
  const rotationTriggerPoint = options.rotationTriggerPoint ?? 0.8;

  return {
    prepare: ({ from, to, context }) => {
      from.then((el) => {
        el.style.opacity = "1";
      });
      to.then((el) => {
        const rect = getJaeminRect(
          context.positionedParent,
          context.to.scroll.y,
        );
        const maxBorderRadius = Math.min(rect.width, rect.height) * 0.4;
        el.style.setProperty("--max-border-radius", `${maxBorderRadius}px`);
        el.style.setProperty("--border-radius-scale", "1");
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        el.style.transformOrigin = `${centerX}px ${centerY}px`;
        el.style.position = "fixed";
        el.style.top = `${rect.top}px`;
        el.style.left = `${rect.left}px`;
        el.style.width = `${rect.width}px`;
        el.style.height = `${rect.height}px`;
        el.style.zIndex = "1000";
        el.style.overflow = "hidden";
        el.style.transform = `rotate(${initialRotation}deg) scale(${initialScale}) translateZ(0)`;
        el.style.borderRadius = `calc(var(--max-border-radius) * var(--border-radius-scale))`;
        el.style.opacity = "1";
      });
      return {};
    },
    animation: ({ from, to }) => {
      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(OUT_PHYSICS),
        style: (_t, u) => ({ opacity: u }),
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(inPhysics),
        style: (t) => {
          // Multi-phase scale curve (matches legacy tick branches).
          let currentScale: number;
          if (t <= 0.05) {
            currentScale = initialScale;
          } else if (t <= rotationTriggerPoint) {
            const transProgress = (t - 0.05) / (rotationTriggerPoint - 0.05);
            const eased = Math.pow(transProgress, 9);
            currentScale = initialScale + (0.8 - initialScale) * eased;
          } else {
            const finalProgress =
              (t - rotationTriggerPoint) / (1 - rotationTriggerPoint);
            const eased = 1 - Math.pow(1 - finalProgress, 3);
            currentScale = 0.8 + 0.2 * eased;
          }

          // Rotation unwinds after a separate trigger point so it lags scale.
          const rotationStart = 0.7;
          let currentRotation: number;
          if (t <= rotationStart) {
            currentRotation = initialRotation;
          } else {
            const finalProgress = (t - rotationStart) / (1 - rotationStart);
            const eased = 1 - Math.pow(1 - finalProgress, 2);
            currentRotation = initialRotation * (1 - eased);
          }

          // Border radius shrinks to 0 after rotation starts unwinding.
          let borderRadiusScale: number;
          if (t <= rotationStart) {
            borderRadiusScale = 1;
          } else {
            const borderProgress = (t - rotationStart) / (1 - rotationStart);
            const eased = Math.pow(borderProgress, 0.5);
            borderRadiusScale = 1 - eased;
          }

          return {
            transform: `rotate(${currentRotation.toFixed(2)}deg) scale(${currentScale.toFixed(4)}) translateZ(0)`,
            "--border-radius-scale": borderRadiusScale.toFixed(4),
          } as Record<string, string | number>;
        },
        onComplete: () => {
          to.style.willChange = "";
          to.style.backfaceVisibility = "";
          to.style.removeProperty("--max-border-radius");
          to.style.removeProperty("--border-radius-scale");
          to.style.transform = "";
          to.style.transformOrigin = "";
          to.style.position = "";
          to.style.zIndex = "";
          to.style.top = "";
          to.style.left = "";
          to.style.width = "";
          to.style.height = "";
          to.style.overflow = "";
          to.style.borderRadius = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
