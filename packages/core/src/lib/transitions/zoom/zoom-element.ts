import type { ZoomAnimationConfig, ZoomAnimationInput } from "./types";

export function createZoomIn({
  enterRect,
  exitRect,
  pageRect,
  scrollOffset,
  enterRadius,
  exitRadius,
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
      const sx = 1 + (scaleX - 1) * u;
      const sy = 1 + (scaleY - 1) * u;
      // clip-path runs in pre-transform space; divide visible radius by the
      // current average scale so the on-screen radius matches the tile.
      const visibleR = exitRadius * u + enterRadius * (1 - u);
      const cpR = visibleR / ((sx + sy) / 2);

      return {
        clipPath: `inset(${startTop * u}% ${startRight * u}% ${startBottom * u}% ${startLeft * u}% round ${cpR}px)`,
        transform: `translate(${dx * u}px, ${dy * u}px) scale(${sx}, ${sy})`,
      };
    },
  };
}

export function createZoomOut({
  enterRect,
  exitRect,
  pageRect,
  scrollOffset,
  enterRadius,
  exitRadius,
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
      const sx = 1 + (scaleX - 1) * t;
      const sy = 1 + (scaleY - 1) * t;
      const visibleR = enterRadius * (1 - t) + exitRadius * t;
      const cpR = visibleR / ((sx + sy) / 2);

      return {
        clipPath: `inset(${startTop * t}% ${startRight * t}% ${startBottom * t}% ${startLeft * t}% round ${cpR}px)`,
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t}px) scale(${sx}, ${sy})`,
      };
    },
  };
}
