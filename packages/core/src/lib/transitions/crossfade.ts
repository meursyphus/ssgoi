import { getClientRect } from "@utils";
export { retainOpacity } from "../utils/retain-opacity";
import type { MediaRect } from "./media-geometry";

export const CROSSFADE_ATTRIBUTE = "data-ssgoi-crossfade";
export const clampOpacity = (value: number): number =>
  Math.min(1, Math.max(0, value));

/** Preserve source styling when the visual is painted in the other page. */
export function cloneCrossfadeVisual(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  const copy = (from: Element, to: Element): void => {
    const computed = getComputedStyle(from);
    const style = (to as HTMLElement).style;
    for (const property of Array.from(computed))
      style.setProperty(property, computed.getPropertyValue(property));
    // Clones must not participate in key matching, focus, or duplicate IDs.
    for (const { name } of Array.from(to.attributes)) {
      if (
        name === "id" ||
        name.startsWith("data-hero-") ||
        name.startsWith("data-zoom-")
      )
        to.removeAttribute(name);
    }
    if (from.tagName === "IMG") {
      const image = from as HTMLImageElement;
      if (image.currentSrc) {
        to.removeAttribute("srcset");
        to.removeAttribute("sizes");
        to.setAttribute("src", image.currentSrc);
      }
      to.setAttribute("loading", "eager");
    }
    style.animation = "none";
    style.transition = "none";
    const children = Array.from(to.children);
    Array.from(from.children).forEach((child, index) => {
      const target = children[index];
      if (!target) return;
      if (
        child.hasAttribute(CROSSFADE_ATTRIBUTE) ||
        child.hasAttribute("data-hero-placeholder")
      )
        target.remove();
      else copy(child, target);
    });
  };
  copy(source, clone);
  clone.setAttribute(CROSSFADE_ATTRIBUTE, "");
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("inert", "");
  Object.assign(clone.style, {
    position: "absolute",
    left: "0",
    top: "0",
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
    transformOrigin: "center center",
    pointerEvents: "none",
    willChange: "transform, clip-path, opacity",
  });
  return clone;
}

export type VisualReference = {
  box: MediaRect;
  scaleX: number;
  scaleY: number;
};

export function measureVisual(
  root: HTMLElement,
  visual: HTMLElement,
): VisualReference {
  const box = getClientRect(root, visual);
  return {
    box: {
      left: box.left + root.scrollLeft,
      top: box.top + root.scrollTop,
      width: box.width,
      height: box.height,
    },
    scaleX:
      visual.offsetWidth && Math.abs(box.width - visual.offsetWidth) > 0.5
        ? box.width / visual.offsetWidth
        : 1,
    scaleY:
      visual.offsetHeight && Math.abs(box.height - visual.offsetHeight) > 0.5
        ? box.height / visual.offsetHeight
        : 1,
  };
}

export function alignVisual(
  target: MediaRect,
  reference: VisualReference,
): string {
  const { box, scaleX, scaleY } = reference;
  const x =
    (target.left + target.width / 2 - box.left - box.width / 2) / scaleX;
  const y =
    (target.top + target.height / 2 - box.top - box.height / 2) / scaleY;
  return `translate(${x}px, ${y}px) scale(${target.width / box.width}, ${target.height / box.height})`;
}
