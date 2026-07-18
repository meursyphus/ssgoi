export type MediaFit = "contain" | "cover";

export interface MediaRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface MediaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

type RadiusSource = "computed" | "legacy" | "none" | "unsupported";

export interface MediaGeometry {
  bbox: MediaRect;
  content: MediaRect;
  window: MediaRect;
  clipInset: MediaInsets;
  aspectRatio: number | null;
  fit: MediaFit | null;
  radius: number;
  radiusSource: RadiusSource;
  bboxRadius: number;
  bboxRadiusSource: RadiusSource;
  contentAware: boolean;
  mediaElement: HTMLElement | null;
}

export interface ElementMediaGeometryOptions {
  /** Compatibility fit used only when a legacy aspect-ratio hint is present. */
  fallbackFit?: MediaFit;
  /** @deprecated Compatibility only. Intrinsic media dimensions are inferred. */
  legacyAspectRatioAttribute?: string;
  /** @deprecated Compatibility only. Border radius is inferred from CSS. */
  legacyRadiusAttribute?: string;
}

type MediaStyle = {
  fit: MediaFit | null;
  centered: boolean;
};

function parseAspectRatio(value: string | null): number | null {
  if (!value) return null;
  if (value.includes("/")) {
    const parts = value.split("/");
    if (parts.length !== 2) return null;
    const width = Number.parseFloat(parts[0] ?? "");
    const height = Number.parseFloat(parts[1] ?? "");
    return Number.isFinite(width) &&
      Number.isFinite(height) &&
      width > 0 &&
      height > 0
      ? width / height
      : null;
  }

  const ratio = Number.parseFloat(value);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : null;
}

function parseMediaFit(value: string | null): MediaFit | null {
  return value === "contain" || value === "cover" ? value : null;
}

function isImageElement(el: HTMLElement): boolean {
  return el.tagName === "IMG";
}

/**
 * Resolve only an unambiguous local image target. We intentionally avoid a
 * deep descendant query: cards commonly contain icons, avatars, pictures,
 * videos, and multiple images that must not be mistaken for the shared visual.
 */
export function findMediaElement(keyedEl: HTMLElement): HTMLElement | null {
  if (isImageElement(keyedEl)) return keyedEl;
  if (keyedEl.tagName === "PICTURE" || keyedEl.tagName === "VIDEO") {
    return null;
  }

  const candidates: HTMLElement[] = [];
  for (const child of Array.from(keyedEl.children)) {
    const childEl = child as HTMLElement;
    if (isImageElement(childEl)) candidates.push(childEl);
  }

  return candidates.length === 1 ? (candidates[0] ?? null) : null;
}

export function readIntrinsicAspectRatio(el: HTMLElement): number | null {
  if (!isImageElement(el)) return null;

  const media = el as HTMLElement & {
    naturalWidth?: number;
    naturalHeight?: number;
  };
  const width = media.naturalWidth;
  const height = media.naturalHeight;

  if (
    typeof width === "number" &&
    typeof height === "number" &&
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width > 0 &&
    height > 0
  ) {
    return width / height;
  }

  const widthValue = el.getAttribute("width")?.trim() ?? "";
  const heightValue = el.getAttribute("height")?.trim() ?? "";
  const widthHint = widthValue === "" ? Number.NaN : Number(widthValue);
  const heightHint = heightValue === "" ? Number.NaN : Number(heightValue);
  return Number.isFinite(widthHint) &&
    Number.isFinite(heightHint) &&
    widthHint > 0 &&
    heightHint > 0
    ? widthHint / heightHint
    : null;
}

function isCenteredObjectPosition(value: string): boolean {
  const position = value.trim().toLowerCase().replace(/\s+/g, " ");
  return (
    position === "" ||
    position === "center" ||
    position === "center center" ||
    position === "50% 50%"
  );
}

function styleFor(el: HTMLElement): CSSStyleDeclaration {
  if (typeof getComputedStyle === "function") {
    try {
      return getComputedStyle(el);
    } catch {
      // Detached test doubles and non-browser DOM shims may reject the node.
    }
  }
  return el.style;
}

function readMediaStyle(el: HTMLElement): MediaStyle {
  const style = styleFor(el);
  const centered = isCenteredObjectPosition(style.objectPosition ?? "");
  return {
    fit: centered ? parseMediaFit(style.objectFit ?? null) : null,
    centered,
  };
}

function parsePixelRadius(value: string | undefined): number | null {
  if (!value) return 0;
  const match = /^(-?(?:\d+\.?\d*|\.\d+))px$/.exec(value.trim());
  if (!match) return null;
  const radius = Number.parseFloat(match[1] ?? "");
  return Number.isFinite(radius) && radius >= 0 ? radius : null;
}

type RadiusReading = { radius: number; supported: boolean };

function readUniformRadius(el: HTMLElement): RadiusReading {
  const style = styleFor(el);
  const radii = [
    style.borderTopLeftRadius,
    style.borderTopRightRadius,
    style.borderBottomRightRadius,
    style.borderBottomLeftRadius,
  ].map(parsePixelRadius);
  const first = radii[0];
  if (first === null || first === undefined) {
    return { radius: 0, supported: false };
  }
  const supported = radii.every(
    (radius) => radius !== null && Math.abs(radius - first) < 0.001,
  );
  return { radius: supported ? first : 0, supported };
}

function readLegacyRadius(
  keyedEl: HTMLElement,
  attribute: string | undefined,
): number | null {
  if (!attribute) return null;
  const value = keyedEl.getAttribute(attribute)?.trim();
  if (value === undefined || value === null || value === "") return null;
  // Preserve the pre-deprecation parser, which accepted values such as
  // `data-*-radius="12px"`, while also treating zero as an explicit override.
  const radius = Number.parseFloat(value);
  return Number.isFinite(radius) && radius >= 0 ? radius : null;
}

function hasSimpleImageBox(el: HTMLElement): boolean {
  const style = styleFor(el);
  const values = [
    style.paddingTop,
    style.paddingRight,
    style.paddingBottom,
    style.paddingLeft,
    style.borderTopWidth,
    style.borderRightWidth,
    style.borderBottomWidth,
    style.borderLeftWidth,
  ];
  return values.every((value) => {
    if (!value) return true;
    const parsed = parsePixelRadius(value);
    return parsed === 0;
  });
}

function clipsBothAxes(el: HTMLElement): boolean {
  const style = styleFor(el);
  const clips = (value: string): boolean =>
    value === "hidden" || value === "clip";
  return clips(style.overflowX) && clips(style.overflowY);
}

export function centerX(rect: MediaRect): number {
  return rect.left + rect.width / 2;
}

export function centerY(rect: MediaRect): number {
  return rect.top + rect.height / 2;
}

export function insetWithin(outer: MediaRect, inner: MediaRect): MediaInsets {
  return {
    top: Math.max(0, inner.top - outer.top),
    right: Math.max(0, outer.left + outer.width - (inner.left + inner.width)),
    bottom: Math.max(0, outer.top + outer.height - (inner.top + inner.height)),
    left: Math.max(0, inner.left - outer.left),
  };
}

function intersection(a: MediaRect, b: MediaRect): MediaRect | null {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.left + a.width, b.left + b.width);
  const bottom = Math.min(a.top + a.height, b.top + b.height);
  return right > left && bottom > top
    ? { left, top, width: right - left, height: bottom - top }
    : null;
}

function sameRect(a: MediaRect, b: MediaRect): boolean {
  const epsilon = 0.01;
  return (
    Math.abs(a.left - b.left) < epsilon &&
    Math.abs(a.top - b.top) < epsilon &&
    Math.abs(a.width - b.width) < epsilon &&
    Math.abs(a.height - b.height) < epsilon
  );
}

export function fittedContentRect(
  bbox: MediaRect,
  aspectRatio: number,
  fit: MediaFit,
): MediaRect {
  const bboxAspectRatio = bbox.width / bbox.height;
  let width: number;
  let height: number;

  if (fit === "contain") {
    if (bboxAspectRatio > aspectRatio) {
      height = bbox.height;
      width = height * aspectRatio;
    } else {
      width = bbox.width;
      height = width / aspectRatio;
    }
  } else if (bboxAspectRatio > aspectRatio) {
    width = bbox.width;
    height = width / aspectRatio;
  } else {
    height = bbox.height;
    width = height * aspectRatio;
  }

  return {
    left: bbox.left + (bbox.width - width) / 2,
    top: bbox.top + (bbox.height - height) / 2,
    width,
    height,
  };
}

export function createMediaGeometry(
  bbox: MediaRect,
  aspectRatio: number | null,
  fit: MediaFit | null,
): MediaGeometry {
  const content =
    aspectRatio !== null && fit !== null && bbox.width > 0 && bbox.height > 0
      ? fittedContentRect(bbox, aspectRatio, fit)
      : bbox;
  const window = fit === "contain" ? content : bbox;
  return {
    bbox,
    content,
    window,
    clipInset: insetWithin(content, window),
    aspectRatio,
    fit,
    radius: 0,
    radiusSource: "none",
    bboxRadius: 0,
    bboxRadiusSource: "none",
    contentAware: aspectRatio !== null && fit !== null,
    mediaElement: null,
  };
}

function bboxGeometry(
  bbox: MediaRect,
  radius: number,
  radiusSource: MediaGeometry["radiusSource"],
): MediaGeometry {
  return {
    ...createMediaGeometry(bbox, null, null),
    radius,
    radiusSource,
    bboxRadius: radius,
    bboxRadiusSource: radiusSource,
  };
}

export function isCompatibleMediaGeometryPair(
  from: MediaGeometry,
  to: MediaGeometry,
): boolean {
  const fromAspect = from.aspectRatio;
  const toAspect = to.aspectRatio;
  return (
    from.contentAware &&
    to.contentAware &&
    fromAspect !== null &&
    toAspect !== null &&
    Math.abs(fromAspect - toAspect) / Math.max(fromAspect, toAspect) < 0.01
  );
}

function collapseMediaGeometryToBbox(geometry: MediaGeometry): MediaGeometry {
  return bboxGeometry(
    geometry.bbox,
    geometry.bboxRadius,
    geometry.bboxRadiusSource,
  );
}

export function normalizeMediaGeometryPair(
  from: MediaGeometry,
  to: MediaGeometry,
): [MediaGeometry, MediaGeometry] {
  return isCompatibleMediaGeometryPair(from, to)
    ? [from, to]
    : [collapseMediaGeometryToBbox(from), collapseMediaGeometryToBbox(to)];
}

export function resolveElementMediaGeometry(
  keyedEl: HTMLElement,
  keyedBox: MediaRect,
  measure: (el: HTMLElement) => MediaRect,
  options: ElementMediaGeometryOptions,
): MediaGeometry {
  const mediaEl = findMediaElement(keyedEl);
  const mediaBox = mediaEl ? measure(mediaEl) : keyedBox;
  const legacyAspectRatio = options.legacyAspectRatioAttribute
    ? parseAspectRatio(
        keyedEl.getAttribute(options.legacyAspectRatioAttribute) ??
          mediaEl?.getAttribute(options.legacyAspectRatioAttribute) ??
          null,
      )
    : null;
  const aspectRatio =
    legacyAspectRatio ?? (mediaEl ? readIntrinsicAspectRatio(mediaEl) : null);
  const mediaStyle = mediaEl
    ? readMediaStyle(mediaEl)
    : { fit: null, centered: true };
  const fit =
    mediaStyle.centered && (mediaEl === null || hasSimpleImageBox(mediaEl))
      ? (mediaStyle.fit ??
        (legacyAspectRatio !== null ? (options.fallbackFit ?? null) : null))
      : null;
  const base = createMediaGeometry(mediaBox, aspectRatio, fit);

  const keyedClips = clipsBothAxes(keyedEl);
  const wrapperClips = mediaEl !== null && mediaEl !== keyedEl && keyedClips;
  const clippedWindow = wrapperClips
    ? intersection(base.window, keyedBox)
    : base.window;
  const legacyRadius = readLegacyRadius(keyedEl, options.legacyRadiusAttribute);
  const keyedDefinesBboxShape = mediaEl === keyedEl || keyedClips;
  const keyedRadius = keyedDefinesBboxShape
    ? readUniformRadius(keyedEl)
    : { radius: 0, supported: true };
  const bboxRadius = legacyRadius ?? keyedRadius.radius;
  const bboxRadiusSource: RadiusSource =
    legacyRadius !== null
      ? "legacy"
      : !keyedRadius.supported
        ? "unsupported"
        : keyedRadius.radius > 0
          ? "computed"
          : "none";
  const radiusReadings: RadiusReading[] = [];
  if (
    clippedWindow &&
    keyedDefinesBboxShape &&
    sameRect(clippedWindow, keyedBox)
  ) {
    radiusReadings.push(keyedRadius);
  }
  if (clippedWindow && mediaEl && sameRect(clippedWindow, mediaBox)) {
    radiusReadings.push(readUniformRadius(mediaEl));
  }
  const radiusSupported = radiusReadings.every((reading) => reading.supported);
  const inferredRadius = Math.max(
    0,
    ...radiusReadings.map((reading) => reading.radius),
  );
  const radius = legacyRadius ?? inferredRadius;
  const radiusSource: MediaGeometry["radiusSource"] =
    legacyRadius !== null
      ? "legacy"
      : !radiusSupported
        ? "unsupported"
        : inferredRadius > 0
          ? "computed"
          : "none";

  if (!clippedWindow) {
    return bboxGeometry(keyedBox, bboxRadius, bboxRadiusSource);
  }

  if (radiusSource === "unsupported") {
    return bboxGeometry(keyedBox, bboxRadius, bboxRadiusSource);
  }

  return {
    ...base,
    bbox: keyedBox,
    window: clippedWindow,
    clipInset: insetWithin(base.content, clippedWindow),
    radius,
    radiusSource,
    bboxRadius,
    bboxRadiusSource,
    mediaElement: base.contentAware ? mediaEl : null,
  };
}

/** Inverse-project `targetWindow` into `baseContent` before its transform. */
export function projectedWindowRect(
  baseContent: MediaRect,
  targetContent: MediaRect,
  targetWindow: MediaRect,
  scaleX: number,
  scaleY: number,
): MediaRect {
  const width = targetWindow.width / scaleX;
  const height = targetWindow.height / scaleY;
  return {
    left:
      centerX(baseContent) +
      (centerX(targetWindow) - centerX(targetContent)) / scaleX -
      width / 2,
    top:
      centerY(baseContent) +
      (centerY(targetWindow) - centerY(targetContent)) / scaleY -
      height / 2,
    width,
    height,
  };
}
