import type { ZoomAnimationConfig, ZoomAnimationInput } from "./types";
import {
  centerX,
  centerY,
  isCompatibleMediaGeometryPair,
  projectedWindowRect,
  type MediaCornerRadii,
  type MediaRect,
} from "../media-geometry";

type TileGeometry = {
  enterContent: MediaRect;
  exitContent: MediaRect;
  startWindow: MediaRect;
  scaleX: number;
  scaleY: number;
  exitCornerRadii?: MediaCornerRadii;
};

function containsRect(outer: MediaRect, inner: MediaRect): boolean {
  const epsilon = 0.01;
  return (
    inner.left >= outer.left - epsilon &&
    inner.top >= outer.top - epsilon &&
    inner.left + inner.width <= outer.left + outer.width + epsilon &&
    inner.top + inner.height <= outer.top + outer.height + epsilon
  );
}

function buildTileGeometry(input: ZoomAnimationInput): TileGeometry {
  const fallback = (): TileGeometry => ({
    enterContent: input.enterRect,
    exitContent: input.exitRect,
    startWindow: input.enterRect,
    scaleX: input.exitRect.width / input.enterRect.width,
    scaleY: input.exitRect.height / input.enterRect.height,
  });

  const { enterMedia, exitMedia } = input;
  if (!enterMedia || !exitMedia) return fallback();
  if (!isCompatibleMediaGeometryPair(enterMedia, exitMedia)) return fallback();

  const enterContent = enterMedia.content;
  const exitContent = exitMedia.content;
  if (
    enterContent.width <= 0 ||
    enterContent.height <= 0 ||
    exitContent.width <= 0 ||
    exitContent.height <= 0
  ) {
    return fallback();
  }

  const scaleX = exitContent.width / enterContent.width;
  const scaleY = exitContent.height / enterContent.height;
  const startWindow = projectedWindowRect(
    enterContent,
    exitContent,
    exitMedia.window,
    scaleX,
    scaleY,
  );

  // The zoom tile is the whole detail page, not a media clone. If the
  // projected source crop needs pixels outside the destination image's own
  // rendered window, preserve the legacy bbox path instead of revealing an
  // impossible region.
  if (!containsRect(enterMedia.window, startWindow)) return fallback();

  return {
    enterContent,
    exitContent,
    startWindow,
    scaleX,
    scaleY,
    exitCornerRadii: exitMedia.cornerRadii,
  };
}

function clipInsets(
  window: MediaRect,
  pageRect: DOMRect,
): { top: number; right: number; bottom: number; left: number } {
  return {
    top: (window.top / pageRect.height) * 100,
    right:
      ((pageRect.width - (window.left + window.width)) / pageRect.width) * 100,
    bottom:
      ((pageRect.height - (window.top + window.height)) / pageRect.height) *
      100,
    left: (window.left / pageRect.width) * 100,
  };
}

function clipRadius(
  visibleRadius: number,
  scaleX: number,
  scaleY: number,
): { x: number; y: number } {
  const epsilon = 0.000001;
  return {
    x: visibleRadius / Math.max(Math.abs(scaleX), epsilon),
    y: visibleRadius / Math.max(Math.abs(scaleY), epsilon),
  };
}

function roundedClip(
  exitRadius: number,
  enterRadius: number,
  exitCorners: MediaCornerRadii | undefined,
  tileProgress: number,
  scaleX: number,
  scaleY: number,
): string {
  const radii = (exitCorners ?? [exitRadius]).map((corner) =>
    clipRadius(
      Math.max(0, corner * tileProgress + enterRadius * (1 - tileProgress)),
      scaleX,
      scaleY,
    ),
  );
  return `${radii.map((radius) => `${radius.x}px`).join(" ")} / ${radii.map((radius) => `${radius.y}px`).join(" ")}`;
}

export function createZoomIn(input: ZoomAnimationInput): ZoomAnimationConfig {
  const { pageRect, scrollOffset, enterRadius, exitRadius } = input;
  const geometry = buildTileGeometry(input);
  const { enterContent, exitContent, startWindow, scaleX, scaleY } = geometry;
  const dx =
    exitContent.left -
    enterContent.left +
    (exitContent.width - enterContent.width) / 2 -
    scrollOffset.x;
  const dy =
    exitContent.top -
    enterContent.top +
    (exitContent.height - enterContent.height) / 2 -
    scrollOffset.y;

  const start = clipInsets(startWindow, pageRect);

  return {
    transformOrigin: `${centerX(enterContent)}px ${centerY(enterContent)}px`,
    animate: (progress) => {
      const u = 1 - progress;
      const sx = 1 + (scaleX - 1) * u;
      const sy = 1 + (scaleY - 1) * u;
      const radius = roundedClip(
        exitRadius,
        enterRadius,
        geometry.exitCornerRadii,
        u,
        sx,
        sy,
      );

      return {
        clipPath: `inset(${start.top * u}% ${start.right * u}% ${start.bottom * u}% ${start.left * u}% round ${radius})`,
        transform: `translate(${dx * u}px, ${dy * u}px) scale(${sx}, ${sy})`,
      };
    },
  };
}

export function createZoomOut(input: ZoomAnimationInput): ZoomAnimationConfig {
  const { pageRect, scrollOffset, enterRadius, exitRadius } = input;
  const geometry = buildTileGeometry(input);
  const { enterContent, exitContent, startWindow, scaleX, scaleY } = geometry;
  const dx =
    exitContent.left -
    enterContent.left +
    (exitContent.width - enterContent.width) / 2 +
    scrollOffset.x;
  const dy =
    exitContent.top -
    enterContent.top +
    (exitContent.height - enterContent.height) / 2 +
    scrollOffset.y;

  const start = clipInsets(startWindow, pageRect);

  return {
    transformOrigin: `${centerX(enterContent)}px ${centerY(enterContent)}px`,
    animate: (progress) => {
      const t = 1 - progress;
      const sx = 1 + (scaleX - 1) * t;
      const sy = 1 + (scaleY - 1) * t;
      const radius = roundedClip(
        exitRadius,
        enterRadius,
        geometry.exitCornerRadii,
        t,
        sx,
        sy,
      );

      return {
        clipPath: `inset(${start.top * t}% ${start.right * t}% ${start.bottom * t}% ${start.left * t}% round ${radius})`,
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t}px) scale(${sx}, ${sy})`,
      };
    },
  };
}
