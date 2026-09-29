import type { ZoomAnimationConfig, ZoomAnimationInput } from "./types";
import { insetClipPath } from "../inset-clip";
import {
  centerX,
  centerY,
  isCompatibleMediaGeometryPair,
  projectedWindowRect,
  type MediaCornerRadii,
  type MediaRect,
} from "../media-geometry";

type TileGeometry = {
  contentAware: boolean;
  enterContent: MediaRect;
  exitContent: MediaRect;
  startWindow: MediaRect;
  scaleX: number;
  scaleY: number;
  exitCornerRadii?: MediaCornerRadii;
  /**
   * The destination shows more of the image than the source renders (a
   * shelf card showing the whole frame, a full-screen player cropping its
   * sides). The tile covers only the shared part; the rest of the
   * destination must show from beneath it, so the shared element is not
   * hidden.
   */
  partial: boolean;
};

const EPSILON = 0.01;

function containsRect(outer: MediaRect, inner: MediaRect): boolean {
  return (
    inner.left >= outer.left - EPSILON &&
    inner.top >= outer.top - EPSILON &&
    inner.left + inner.width <= outer.left + outer.width + EPSILON &&
    inner.top + inner.height <= outer.top + outer.height + EPSILON
  );
}

function intersectRects(a: MediaRect, b: MediaRect): MediaRect | null {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.left + a.width, b.left + b.width);
  const bottom = Math.min(a.top + a.height, b.top + b.height);
  if (right - left <= EPSILON || bottom - top <= EPSILON) return null;
  return { left, top, width: right - left, height: bottom - top };
}

export function buildTileGeometry(input: ZoomAnimationInput): TileGeometry {
  const fallback = (): TileGeometry => ({
    contentAware: false,
    enterContent: input.enterRect,
    exitContent: input.exitRect,
    startWindow: input.enterRect,
    scaleX: input.exitRect.width / input.enterRect.width,
    scaleY: input.exitRect.height / input.enterRect.height,
    partial: false,
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

  // The zoom tile is the whole detail page, not a media clone: it can only
  // show pixels the detail image renders. When the projected destination
  // crop needs more (the card shows the whole frame, the player crops its
  // sides), the tile keeps the uniform scale and covers the shared part
  // only; the destination's extra edges show from beneath and the shared
  // element stays visible. Stretching the page to the card's box instead
  // would warp the image by the aspect difference. No shared part at all
  // is the legacy bbox path.
  const shown = intersectRects(startWindow, enterMedia.window);
  if (!shown) return fallback();

  // The window keeps rounding toward the destination's corners even when it
  // lands inside the card: while the tile is still larger than the card its
  // corners are the visible shape, and once it is smaller a rounded corner
  // only uncovers the card's own identical pixels beneath.
  return {
    contentAware: true,
    enterContent,
    exitContent,
    startWindow: shown,
    scaleX,
    scaleY,
    exitCornerRadii: exitMedia.cornerRadii,
    partial: !containsRect(enterMedia.window, startWindow),
  };
}

function clipInsets(
  window: MediaRect,
  pageRect: DOMRect,
): { top: number; right: number; bottom: number; left: number } {
  return {
    top: window.top,
    right: pageRect.width - (window.left + window.width),
    bottom: pageRect.height - (window.top + window.height),
    left: window.left,
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

function interpolatedRadii(
  exitRadius: number,
  enterRadius: number,
  exitCorners: MediaCornerRadii | undefined,
  tileProgress: number,
  scaleX: number,
  scaleY: number,
): { x: number; y: number }[] {
  return (exitCorners ?? [exitRadius]).map((corner) =>
    clipRadius(
      Math.max(0, corner * tileProgress + enterRadius * (1 - tileProgress)),
      scaleX,
      scaleY,
    ),
  );
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
      const radii = interpolatedRadii(
        exitRadius,
        enterRadius,
        geometry.exitCornerRadii,
        u,
        sx,
        sy,
      );

      return {
        clipPath: insetClipPath(
          pageRect,
          {
            top: start.top * u,
            right: start.right * u,
            bottom: start.bottom * u,
            left: start.left * u,
          },
          radii,
        ),
        transform: `translate(${dx * u}px, ${dy * u}px) scale(${sx}, ${sy})`,
      };
    },
  };
}

/**
 * Progress at which the shrinking tile's window has closed onto the shared
 * visual. A spring spends its last stretch creeping through the final few
 * percent, and a window still a few percent open there shows a sliver of the
 * page body next to the destination's own content until the rest threshold
 * cuts it. Closing the window slightly ahead of the motion removes that
 * sliver; the visual itself keeps settling with the transform.
 */
const EXIT_WINDOW_SETTLE = 0.85;

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
      const closing = Math.min(1, t / EXIT_WINDOW_SETTLE);
      const radii = interpolatedRadii(
        exitRadius,
        enterRadius,
        geometry.exitCornerRadii,
        closing,
        sx,
        sy,
      );

      return {
        clipPath: insetClipPath(
          pageRect,
          {
            top: start.top * closing,
            right: start.right * closing,
            bottom: start.bottom * closing,
            left: start.left * closing,
          },
          radii,
        ),
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t}px) scale(${sx}, ${sy})`,
      };
    },
  };
}
