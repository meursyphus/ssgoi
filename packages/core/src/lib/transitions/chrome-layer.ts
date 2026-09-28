import { getClientRect, getRect } from "@utils";
import { CROSSFADE_ATTRIBUTE, clampOpacity } from "./crossfade";
import type { MediaRect } from "./media-geometry";

/*
 * A shared-element transition paints the moving visual above the other page:
 * zoom raises a whole page, hero lifts both images into a layer. Anything
 * that page paints over the shared element's slot — a sticky tab bar the
 * card sits under, a duration badge, a caption gradient, floating buttons —
 * is covered for the whole run and pops when the transition settles. The
 * moving visual cannot be lowered beneath that chrome: it is one element,
 * and the chrome lives inside the other page's own stacking context.
 *
 * Instead the chrome is found by hit testing the shared element's box,
 * copied into a layer above the moving visual and crossfaded there. At the
 * settled end the copies are pixel identical to the real chrome and are
 * simply removed.
 */

export const CHROME_ATTRIBUTE = "data-ssgoi-chrome";
const HIT_TEST_ATTRIBUTE = "data-ssgoi-hit-test";
const CREATED_ATTRIBUTE = "data-ssgoi-id";
const HERO_LAYER_ATTRIBUTE = "data-hero-layer";
/** Temporary elements a transition itself puts on the page. */
export const TEMPORARY_SELECTOR = `[${CROSSFADE_ATTRIBUTE}], [${CHROME_ATTRIBUTE}], [${CREATED_ATTRIBUTE}], [${HERO_LAYER_ATTRIBUTE}]`;
const OPAQUE_MEDIA = "canvas, video, audio, iframe, object, embed";
/** Grid step for the safety-net samples over the shared element's box. */
const SAMPLE_STEP = 48;
const MAX_SAMPLES_PER_AXIS = 6;

/**
 * Share of the motion during which a page's overlays are visible: they show
 * only once their page owns the last part of the move. A control or caption
 * painted over the shared image at half opacity mid-flight marks the moving
 * visual's edge against the identical image around it, and a large copy of
 * list chrome would otherwise linger over most of the opening page.
 */
export const CHROME_SPAN = 0.4;

/** Opacity of a page's overlays given the progress toward that page. */
export function chromeOpacity(toward: number): number {
  return clampOpacity((toward - (1 - CHROME_SPAN)) / CHROME_SPAN);
}

type Point = { x: number; y: number };
type Box = MediaRect;

function intersection(a: Box, b: Box): Box | null {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.left + a.width, b.left + b.width);
  const bottom = Math.min(a.top + a.height, b.top + b.height);
  if (right - left <= 1 || bottom - top <= 1) return null;
  return { left, top, width: right - left, height: bottom - top };
}

/** A coarse grid over `area` catches chrome nested inside unrelated subtrees. */
export function gridPoints(area: Box): Point[] {
  const columns = Math.min(
    MAX_SAMPLES_PER_AXIS,
    Math.max(1, Math.ceil(area.width / SAMPLE_STEP)),
  );
  const rows = Math.min(
    MAX_SAMPLES_PER_AXIS,
    Math.max(1, Math.ceil(area.height / SAMPLE_STEP)),
  );
  const points: Point[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      points.push({
        x: area.left + (area.width * (column + 0.5)) / columns,
        y: area.top + (area.height * (row + 0.5)) / rows,
      });
    }
  }
  return points;
}

/**
 * Chrome is usually a sibling somewhere up the shared element's ancestor
 * chain (the badge next to the image, the tab bar next to the content). One
 * sample at the centre of each such sibling's overlap with `area` finds
 * chrome far smaller than the grid step.
 */
export function siblingPoints(
  page: HTMLElement,
  shared: HTMLElement,
  area: Box,
  measure: (element: Element) => Box,
  ignore: (element: Element) => boolean,
): Point[] {
  const points: Point[] = [];
  for (
    let ancestor = shared.parentElement;
    ancestor;
    ancestor = ancestor.parentElement
  ) {
    for (const sibling of Array.from(ancestor.children)) {
      if (sibling === shared || sibling.contains(shared) || ignore(sibling))
        continue;
      const overlap = intersection(measure(sibling), area);
      if (!overlap) continue;
      points.push({
        x: overlap.left + overlap.width / 2,
        y: overlap.top + overlap.height / 2,
      });
    }
    if (ancestor === page) break;
  }
  return points;
}

/** Elements of `page` painted over `shared` at `point`, topmost first. */
export function stackAbove(
  stack: readonly Element[],
  page: HTMLElement,
  shared: HTMLElement,
  ignore: (element: Element) => boolean,
): HTMLElement[] {
  const above: HTMLElement[] = [];
  for (const element of stack) {
    if (element === shared || shared.contains(element)) return above;
    if (!(element instanceof HTMLElement)) continue;
    if (element === page || !page.contains(element)) continue;
    // An ancestor is listed after its descendants; it paints beneath them.
    if (element.contains(shared) || ignore(element)) continue;
    above.push(element);
  }
  // The shared element is not under this point (clipped away): nothing
  // there is covering it.
  return [];
}

/** Keep only elements with no ancestor in the set. */
export function outermost(elements: Iterable<HTMLElement>): HTMLElement[] {
  const all = Array.from(new Set(elements));
  return all.filter(
    (element) =>
      !all.some((other) => other !== element && other.contains(element)),
  );
}

/**
 * Hit testing skips `pointer-events: none`, which decorative overlays (a
 * gradient scrim, a centred glyph) commonly set. Painted order is what
 * matters here, so the page is made hit-testable for the duration of the
 * samples.
 */
function withHitTesting<T>(page: HTMLElement, sample: () => T): T {
  const style = document.createElement("style");
  style.textContent = `[${HIT_TEST_ATTRIBUTE}], [${HIT_TEST_ATTRIBUTE}] * { pointer-events: auto !important; }`;
  page.setAttribute(HIT_TEST_ATTRIBUTE, "");
  document.head.append(style);
  try {
    return sample();
  } finally {
    style.remove();
    page.removeAttribute(HIT_TEST_ATTRIBUTE);
  }
}

/** Painted-order chrome of `page` over `shared`'s on-screen box. */
export function collectChrome(
  page: HTMLElement,
  shared: HTMLElement,
  ignore: (element: Element) => boolean,
): HTMLElement[] {
  if (typeof document.elementsFromPoint !== "function") return [];
  const shown = intersection(shared.getBoundingClientRect(), {
    left: 0,
    top: 0,
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });
  if (!shown) return [];
  const measure = (element: Element) => element.getBoundingClientRect();
  const points = [
    ...siblingPoints(page, shared, shown, measure, ignore),
    ...gridPoints(shown),
  ];
  const seen = new Set<string>();
  const found = new Set<HTMLElement>();
  withHitTesting(page, () => {
    for (const { x, y } of points) {
      const key = `${Math.round(x / 4)},${Math.round(y / 4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      for (const element of stackAbove(
        document.elementsFromPoint(x, y),
        page,
        shared,
        ignore,
      ))
        found.add(element);
    }
  });
  return outermost(found);
}

/**
 * A stand-in for one piece of chrome. Descendants keep their own classes
 * (same document, same stylesheets); only the root receives its computed
 * style, which pins the inherited values (colour, font) the subtree relied on
 * and is far cheaper than resolving every descendant.
 */
export function cloneChrome(source: HTMLElement): HTMLElement | null {
  if (source.matches(OPAQUE_MEDIA) || source.querySelector(OPAQUE_MEDIA))
    return null;
  const clone = source.cloneNode(true) as HTMLElement;
  // The copy's root receives resolved values, so a unitless line-height the
  // original inherited (Tailwind's 1.5) would reach the copy's descendants
  // as a fixed length and push their text off by a few pixels. Pin every
  // element's own resolved line-height instead.
  const sources = [source, ...source.querySelectorAll("*")];
  const copies = [clone, ...clone.querySelectorAll("*")];
  copies.forEach((copy, index) => {
    const original = sources[index];
    if (copy instanceof HTMLElement && original)
      copy.style.lineHeight = getComputedStyle(original).lineHeight;
  });
  for (const stale of clone.querySelectorAll(TEMPORARY_SELECTOR))
    stale.remove();
  for (const node of [clone, ...clone.querySelectorAll("*")]) {
    for (const { name } of Array.from(node.attributes)) {
      if (
        name === "id" ||
        name === "data-ssgoi-transition" ||
        name.startsWith("data-hero-") ||
        name.startsWith("data-zoom-")
      )
        node.removeAttribute(name);
    }
  }
  const computed = getComputedStyle(source);
  for (const property of Array.from(computed))
    clone.style.setProperty(property, computed.getPropertyValue(property));
  clone.setAttribute(CHROME_ATTRIBUTE, "");
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("inert", "");
  Object.assign(clone.style, {
    position: "absolute",
    right: "auto",
    bottom: "auto",
    margin: "0",
    minWidth: "0",
    minHeight: "0",
    maxWidth: "none",
    maxHeight: "none",
    boxSizing: "border-box",
    transform: "none",
    translate: "none",
    rotate: "none",
    scale: "none",
    animation: "none",
    transition: "none",
    pointerEvents: "none",
  });
  return clone;
}

function clipsContent(style: CSSStyleDeclaration): boolean {
  return (
    style.overflowX !== "visible" ||
    style.overflowY !== "visible" ||
    (style.clipPath !== "none" && style.clipPath !== "") ||
    /paint|strict|content/.test(style.contain)
  );
}

/** Ancestors between `element` and `page` that trim their content, outermost first. */
export function clippingAncestors(
  element: HTMLElement,
  page: HTMLElement,
): HTMLElement[] {
  const found: HTMLElement[] = [];
  for (
    let ancestor = element.parentElement;
    ancestor && ancestor !== page;
    ancestor = ancestor.parentElement
  ) {
    if (clipsContent(getComputedStyle(ancestor))) found.unshift(ancestor);
  }
  return found;
}

/** An empty box with the ancestor's trimming: its padding box, corners and clip-path. */
function cloneClip(
  ancestor: HTMLElement,
  box: Box,
  origin: { left: number; top: number },
): HTMLElement {
  const style = getComputedStyle(ancestor);
  const frame = document.createElement("div");
  frame.setAttribute(CHROME_ATTRIBUTE, "");
  Object.assign(frame.style, {
    position: "absolute",
    left: `${box.left - origin.left + ancestor.clientLeft}px`,
    top: `${box.top - origin.top + ancestor.clientTop}px`,
    width: `${ancestor.clientWidth}px`,
    height: `${ancestor.clientHeight}px`,
    overflow: "hidden",
    borderTopLeftRadius: style.borderTopLeftRadius,
    borderTopRightRadius: style.borderTopRightRadius,
    borderBottomRightRadius: style.borderBottomRightRadius,
    borderBottomLeftRadius: style.borderBottomLeftRadius,
    clipPath: style.clipPath,
    pointerEvents: "none",
  });
  return frame;
}

export interface ChromeLayerOptions {
  /** The page whose chrome is copied. */
  page: HTMLElement;
  /** The shared visual whose slot that chrome covers. */
  shared: HTMLElement;
  /** Elements never taken for chrome: the moving page, temporary layers. */
  ignore: (element: Element) => boolean;
  positionedParent: HTMLElement;
  zIndex: string;
  /** Set when the layer will ride the page's own transform. */
  transformOrigin?: string;
}

/**
 * The layer of chrome copies for `page` over `shared`, positioned in
 * `positionedParent`'s content space with the same box as the page, so a
 * transform authored for the page moves the copies with it. Returns null
 * when nothing covers the shared visual. The caller appends it, drives its
 * opacity (and transform) and removes it on dispose.
 */
export function buildChromeLayer(
  options: ChromeLayerOptions,
): HTMLElement | null {
  const { page, shared, ignore, positionedParent } = options;
  if (typeof document === "undefined" || !page.contains) return null;
  const chrome = collectChrome(page, shared, ignore);
  if (chrome.length === 0) return null;

  // Offset-based, so already in the container's content space: an absolute
  // child of a scrolled container is placed in that same space.
  const box = getRect(positionedParent, page);
  const layer = document.createElement("div");
  layer.setAttribute(CHROME_ATTRIBUTE, "");
  layer.setAttribute("aria-hidden", "true");
  layer.setAttribute("inert", "");
  Object.assign(layer.style, {
    position: "absolute",
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    pointerEvents: "none",
    isolation: "isolate",
    zIndex: options.zIndex,
    transformOrigin: options.transformOrigin ?? "",
    willChange: options.transformOrigin ? "transform, opacity" : "opacity",
  });
  const measure = (element: HTMLElement): Box => {
    const rect = getClientRect(page, element);
    return {
      left: rect.left + page.scrollLeft,
      top: rect.top + page.scrollTop,
      width: rect.width,
      height: rect.height,
    };
  };
  for (const source of chrome) {
    const clone = cloneChrome(source);
    if (!clone) continue;
    // A caption gradient that the card's rounded `overflow: hidden` box trims
    // must stay trimmed in the copy, or its square corners paint past the
    // card until the layer goes. Rebuild each clipping ancestor between the
    // chrome and the page as a nested box around the copy.
    let host: HTMLElement = layer;
    let origin = { left: 0, top: 0 };
    for (const ancestor of clippingAncestors(source, page)) {
      const ancestorBox = measure(ancestor);
      const frame = cloneClip(ancestor, ancestorBox, origin);
      host.append(frame);
      host = frame;
      origin = { left: ancestorBox.left, top: ancestorBox.top };
    }
    const rect = measure(source);
    Object.assign(clone.style, {
      left: `${rect.left - origin.left}px`,
      top: `${rect.top - origin.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    host.append(clone);
  }
  return layer.childElementCount ? layer : null;
}
