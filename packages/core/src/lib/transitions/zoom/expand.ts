import type { PhysicsOptions } from "@types";
import type {
  ZoomAnimationConfig,
  ZoomAnimationInput,
  ZoomProvider,
} from "./types";
import { createZoomIn, createZoomOut } from "./zoom-element";

export const EXPAND_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 340, damping: 30, doubleSpring: 1 },
};

function createEnterOut({
  enterRect,
  exitRect,
  scrollOffset,
}: ZoomAnimationInput): ZoomAnimationConfig {
  const dx =
    enterRect.left -
    exitRect.left +
    (enterRect.width - exitRect.width) / 2 +
    scrollOffset.x;
  const dy =
    enterRect.top -
    exitRect.top +
    (enterRect.height - exitRect.height) / 2 +
    scrollOffset.y;

  const scaleX = enterRect.width / exitRect.width;
  const scaleY = enterRect.height / exitRect.height;
  const scale = Math.max(scaleX, scaleY);

  return {
    transformOrigin: `${exitRect.left + exitRect.width / 2}px ${exitRect.top + exitRect.height / 2}px`,
    animate: (progress) => {
      const t = 1 - progress;

      return {
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t}px) scale(${1 + (scale - 1) * t})`,
        opacity: `${1 - t}`,
      };
    },
  };
}

function createExitIn({
  enterRect,
  exitRect,
  scrollOffset,
}: ZoomAnimationInput): ZoomAnimationConfig {
  const dx =
    enterRect.left -
    exitRect.left +
    (enterRect.width - exitRect.width) / 2 -
    scrollOffset.x;
  const dy =
    enterRect.top -
    exitRect.top +
    (enterRect.height - exitRect.height) / 2 -
    scrollOffset.y;

  const scaleX = enterRect.width / exitRect.width;
  const scaleY = enterRect.height / exitRect.height;
  const scale = Math.max(scaleX, scaleY);

  return {
    transformOrigin: `${exitRect.left + exitRect.width / 2}px ${exitRect.top + exitRect.height / 2}px`,
    animate: (progress) => {
      const t = 1 - progress;

      return {
        transform: `translate(${dx * t}px, ${dy * t}px) scale(${1 + (scale - 1) * t})`,
        opacity: `${progress}`,
      };
    },
  };
}

export function createExpandProvider(): ZoomProvider {
  return {
    physics: EXPAND_PHYSICS,
    in: createZoomIn,
    out: createZoomOut,
    backgroundIn: createExitIn,
    backgroundOut: createEnterOut,
  };
}
