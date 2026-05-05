import type { ZoomAnimationConfig, ZoomAnimationInput } from "./types";

export function createEnterIn({
  enterRect,
  exitRect,
  pageRect,
  scrollOffset,
}: ZoomAnimationInput): ZoomAnimationConfig {
  const dx =
    exitRect.left -
    enterRect.left +
    (exitRect.width - enterRect.width) / 2 -
    scrollOffset.x;
  const dy =
    exitRect.top -
    enterRect.top +
    (exitRect.height - enterRect.height) / 2 -
    scrollOffset.y;

  const scaleX = exitRect.width / enterRect.width;
  const scaleY = exitRect.height / enterRect.height;
  const scale = Math.max(scaleX, scaleY);

  const startTop = (enterRect.top / pageRect.height) * 100;
  const startRight =
    ((pageRect.width - (enterRect.left + enterRect.width)) / pageRect.width) *
    100;
  const startBottom =
    ((pageRect.height - (enterRect.top + enterRect.height)) / pageRect.height) *
    100;
  const startLeft = (enterRect.left / pageRect.width) * 100;

  return {
    transformOrigin: `${enterRect.left + enterRect.width / 2}px ${enterRect.top + enterRect.height / 2}px`,
    animate: (progress) => {
      const u = 1 - progress;

      return {
        clipPath: `inset(${startTop * u}% ${startRight * u}% ${startBottom * u}% ${startLeft * u}%)`,
        transform: `translate(${dx * u}px, ${dy * u}px) scale(${1 + (scale - 1) * u})`,
      };
    },
  };
}

export function createEnterOut({
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
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t - scrollOffset.y}px) scale(${1 + (scale - 1) * t})`,
        opacity: `${1 - t}`,
      };
    },
  };
}

export function createExitIn({
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

export function createExitOut({
  enterRect,
  exitRect,
  pageRect,
  scrollOffset,
}: ZoomAnimationInput): ZoomAnimationConfig {
  const dx =
    exitRect.left -
    enterRect.left +
    (exitRect.width - enterRect.width) / 2 +
    scrollOffset.x;
  const dy =
    exitRect.top -
    enterRect.top +
    (exitRect.height - enterRect.height) / 2 +
    scrollOffset.y;

  const scaleX = exitRect.width / enterRect.width;
  const scaleY = exitRect.height / enterRect.height;
  const scale = Math.min(scaleX, scaleY);

  const startTop = (enterRect.top / pageRect.height) * 100;
  const startRight =
    ((pageRect.width - (enterRect.left + enterRect.width)) / pageRect.width) *
    100;
  const startBottom =
    ((pageRect.height - (enterRect.top + enterRect.height)) / pageRect.height) *
    100;
  const startLeft = (enterRect.left / pageRect.width) * 100;

  return {
    transformOrigin: `${enterRect.left + enterRect.width / 2}px ${enterRect.top + enterRect.height / 2}px`,
    animate: (progress) => {
      const t = 1 - progress;

      return {
        clipPath: `inset(${startTop * t}% ${startRight * t}% ${startBottom * t}% ${startLeft * t}%)`,
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t - scrollOffset.y}px) scale(${1 + (scale - 1) * t})`,
      };
    },
  };
}
