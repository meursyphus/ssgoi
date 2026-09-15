import { IntegratorProvider, WebAnimation } from "../../animation";
import { getClientRect } from "@utils";
import {
  alignVisual,
  clampOpacity,
  cloneCrossfadeVisual,
  measureVisual,
  retainOpacity,
} from "../crossfade";
import { insetClipPath } from "../inset-clip";
import { insetWithin, resolveElementMediaGeometry } from "../media-geometry";
import { buildTileGeometry } from "./zoom-element";
import type { ZoomContributeCtx } from "./types";

/** Both images ride inside the moving page, sharing its transform and clip. */
export function crossfadeZoomVisuals(ctx: ZoomContributeCtx): WebAnimation[] {
  const { resolved, input, from, to, physics, onComplete } = ctx;
  const entering = resolved.mode === "enter";
  const tile = entering ? to : from;
  const geometry = buildTileGeometry(input);
  const preview = geometry.contentAware
    ? (input.exitMedia?.mediaElement ?? resolved.exitEl)
    : resolved.exitEl;
  const detail = geometry.contentAware
    ? (input.enterMedia?.mediaElement ?? resolved.enterEl)
    : resolved.enterEl;
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
    opacity: clampOpacity(entering ? t : u) * detailOpacity.opacity,
  });
  clone.style.opacity = String(previewStyle(0, 1).opacity);
  previewOpacity.set(0);
  detailOpacity.set(detailStyle(0, 1).opacity);
  onComplete(() => {
    clone.remove();
    previewOpacity.restore();
    detailOpacity.restore();
  });
  return [
    new WebAnimation({
      element: clone,
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
