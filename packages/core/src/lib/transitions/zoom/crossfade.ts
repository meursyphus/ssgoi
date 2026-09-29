import { IntegratorProvider, WebAnimation } from "../../animation";
import { getClientRect, getRect } from "@utils";
import {
  CROSSFADE_ATTRIBUTE,
  alignVisual,
  clampOpacity,
  cloneCrossfadeVisual,
  crossfadeUnderOpacity,
  measureVisual,
  retainOpacity,
} from "../crossfade";
import { insetClipPath } from "../inset-clip";
import {
  centerX,
  centerY,
  insetWithin,
  resolveElementMediaGeometry,
  type MediaRect,
} from "../media-geometry";
import { Z_FOREGROUND } from "../stacking";
import { buildTileGeometry } from "./zoom-element";
import type { ZoomContributeCtx } from "./types";

/**
 * When the destination shows more of the image than the tile can render,
 * the copy of the preview rides above the tile instead of inside it. One
 * element then covers the whole card, sides included, scaled uniformly
 * along the tile's own path, so the strip the tile can show never meets
 * the card beneath with a visible edge while the copy is what shows.
 */
function crossfadeAboveTile(
  ctx: ZoomContributeCtx,
  geometry: ReturnType<typeof buildTileGeometry>,
  preview: HTMLElement,
  detail: HTMLElement,
): WebAnimation[] {
  const { resolved, input, from, to, physics, context, onDispose } = ctx;
  const entering = resolved.mode === "enter";
  const { positionedParent } = context;
  const enterBox = getRect(positionedParent, entering ? to : from);
  const exitBox = getRect(positionedParent, entering ? from : to);
  const { enterContent, exitContent } = geometry;
  const rest: MediaRect = {
    left: exitBox.left + exitContent.left,
    top: exitBox.top + exitContent.top,
    width: exitContent.width,
    height: exitContent.height,
  };
  const start = {
    x: enterBox.left + centerX(enterContent),
    y: enterBox.top + centerY(enterContent),
  };
  const end = { x: centerX(rest), y: centerY(rest) };
  // Where the tile's image is when the move is `k` of the way to the card:
  // the same linear path in centre and size the tile itself follows.
  const at = (k: number): MediaRect => {
    const width = enterContent.width * (1 + (geometry.scaleX - 1) * k);
    const height = enterContent.height * (1 + (geometry.scaleY - 1) * k);
    return {
      left: start.x + (end.x - start.x) * k - width / 2,
      top: start.y + (end.y - start.y) * k - height / 2,
      width,
      height,
    };
  };

  const previewOpacity = retainOpacity(preview);
  const detailOpacity = retainOpacity(detail);
  const layer = document.createElement("div");
  layer.setAttribute(CROSSFADE_ATTRIBUTE, "");
  layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, {
    position: "absolute",
    left: `${rest.left}px`,
    top: `${rest.top}px`,
    width: `${rest.width}px`,
    height: `${rest.height}px`,
    pointerEvents: "none",
    zIndex: String(Number(Z_FOREGROUND) + 1),
    transformOrigin: "center center",
    willChange: "transform, opacity",
  });
  const clone = cloneCrossfadeVisual(preview);
  Object.assign(clone.style, {
    width: `${exitContent.width}px`,
    height: `${exitContent.height}px`,
    borderRadius: "0",
    zIndex: "auto",
  });
  // Trim the copy to what the card shows of the image, with its corners.
  const exitMedia = input.exitMedia;
  if (exitMedia) {
    const radii = exitMedia.cornerRadii ?? [exitMedia.radius];
    clone.style.clipPath = insetClipPath(
      exitContent,
      insetWithin(exitContent, exitMedia.window),
      radii.map((radius) => ({ x: radius, y: radius })),
    );
  }
  layer.append(clone);

  const reference = { box: rest, scaleX: 1, scaleY: 1 };
  const layerStyle = (t: number, u: number) => {
    const k = entering ? u : t;
    return {
      transform: alignVisual(at(k), reference),
      opacity: clampOpacity(k) * previewOpacity.opacity,
    };
  };
  const detailStyle = (t: number, u: number) => ({
    opacity: crossfadeUnderOpacity(
      entering ? t : u,
      detailOpacity.opacity,
      previewOpacity.opacity,
    ),
  });
  Object.assign(layer.style, layerStyle(0, 1));
  detailOpacity.set(detailStyle(0, 1).opacity);
  positionedParent.appendChild(layer);
  onDispose(() => {
    layer.remove();
    previewOpacity.restore();
    detailOpacity.restore();
  });
  return [
    new WebAnimation({
      element: layer,
      motion: { lifetime: "temporary", role: "shared-media-source" },
      integrator: IntegratorProvider.from(physics),
      style: layerStyle,
    }),
    new WebAnimation({
      element: detail,
      integrator: IntegratorProvider.from(physics),
      style: detailStyle,
    }),
  ];
}

/** Both images ride inside the moving page, sharing its transform and clip. */
export function crossfadeZoomVisuals(ctx: ZoomContributeCtx): WebAnimation[] {
  const { resolved, input, from, to, physics, onDispose } = ctx;
  const entering = resolved.mode === "enter";
  const tile = entering ? to : from;
  const geometry = buildTileGeometry(input);
  const preview = geometry.contentAware
    ? (input.exitMedia?.mediaElement ?? resolved.exitEl)
    : resolved.exitEl;
  const detail = geometry.contentAware
    ? (input.enterMedia?.mediaElement ?? resolved.enterEl)
    : resolved.enterEl;
  if (geometry.partial)
    return crossfadeAboveTile(ctx, geometry, preview, detail);
  const previewOpacity = retainOpacity(preview);
  const detailOpacity = retainOpacity(detail);
  const clone = cloneCrossfadeVisual(preview);
  if (geometry.contentAware) {
    clone.style.width = `${geometry.exitContent.width}px`;
    clone.style.height = `${geometry.exitContent.height}px`;
    clone.style.borderRadius = "0";
  }
  // Share the detail visual's stacking level, below its later-painted controls.
  clone.style.zIndex = getComputedStyle(detail).zIndex;
  detail.after(clone);
  clone.style.transform = alignVisual(
    {
      width: geometry.enterContent.width,
      height: geometry.enterContent.height,
      left: geometry.enterContent.left + tile.scrollLeft,
      top: geometry.enterContent.top + tile.scrollTop,
    },
    measureVisual(tile, clone),
  );
  const detailGeometry =
    input.enterMedia ??
    resolveElementMediaGeometry(
      resolved.enterEl,
      input.enterRect,
      (element) => getClientRect(tile, element),
      { clipRoot: tile, legacyRadiusAttribute: "data-zoom-radius" },
    );
  const radiusSource = geometry.contentAware
    ? detailGeometry.radiusSource
    : detailGeometry.bboxRadiusSource;
  if (radiusSource !== "unsupported") {
    const window = geometry.contentAware
      ? detailGeometry.window
      : input.enterRect;
    const corners = geometry.contentAware
      ? (detailGeometry.cornerRadii ?? [detailGeometry.radius])
      : [detailGeometry.bboxRadius];
    clone.style.borderRadius = "0";
    clone.style.clipPath = insetClipPath(
      geometry.enterContent,
      insetWithin(geometry.enterContent, window),
      corners.map((radius) => ({ x: radius, y: radius })),
    );
  }

  const previewStyle = (t: number, u: number) => ({
    opacity: clampOpacity(entering ? u : t) * previewOpacity.opacity,
  });
  const detailStyle = (t: number, u: number) => ({
    opacity: crossfadeUnderOpacity(
      entering ? t : u,
      detailOpacity.opacity,
      previewOpacity.opacity,
    ),
  });
  clone.style.opacity = String(previewStyle(0, 1).opacity);
  previewOpacity.set(0);
  detailOpacity.set(detailStyle(0, 1).opacity);
  // The clone is this run's own resource; opacity leases arbitrate with a
  // newer run that reuses the same image, so they are released regardless.
  onDispose(() => {
    clone.remove();
    previewOpacity.restore();
    detailOpacity.restore();
  });
  return [
    new WebAnimation({
      element: clone,
      motion: { lifetime: "temporary", role: "shared-media-source" },
      integrator: IntegratorProvider.from(physics),
      style: previewStyle,
    }),
    new WebAnimation({
      element: detail,
      integrator: IntegratorProvider.from(physics),
      style: detailStyle,
    }),
  ];
}
