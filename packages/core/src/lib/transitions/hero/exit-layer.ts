import type { NavigationDirection } from "@types";
import type { MediaRect } from "../media-geometry";
import { Z_FOREGROUND } from "../stacking";
import { HERO_ENTER_KEY, HERO_EXIT_KEY, HERO_LEGACY_KEY } from "./keys";
import type { HeroPair } from "./types";
import { heroVisualOpacity } from "./in-place";

/** Endpoint roles define hero enter/exit even when browser history disagrees. */
export function usesHeroExitLayer(
  pair: HeroPair,
  direction: NavigationDirection,
): boolean {
  if (
    pair.fromEl.getAttribute(HERO_ENTER_KEY) === pair.key &&
    pair.toEl.getAttribute(HERO_EXIT_KEY) === pair.key
  )
    return true;
  // Legacy symmetric keys have no endpoint roles, so use core navigation.
  return (
    direction === "backward" &&
    pair.fromEl.getAttribute(HERO_LEGACY_KEY) === pair.key &&
    pair.toEl.getAttribute(HERO_LEGACY_KEY) === pair.key
  );
}

/** Paint an exit visual above both pages without moving either real endpoint. */
export function createHeroExitLayer(
  visual: HTMLElement,
  content: MediaRect,
  resetRadius: boolean,
): HTMLElement {
  const clone = visual.cloneNode(true) as HTMLElement;
  const snapshot = (source: Element, target: Element): void => {
    const computed = getComputedStyle(source);
    const style = (target as HTMLElement).style;
    for (const property of Array.from(computed))
      style.setProperty(property, computed.getPropertyValue(property));
    for (const { name } of Array.from(target.attributes)) {
      if (name === "id" || name.startsWith("data-hero-"))
        target.removeAttribute(name);
    }
    if (source.tagName === "IMG") {
      const image = source as HTMLImageElement;
      if (image.currentSrc) {
        target.removeAttribute("srcset");
        target.removeAttribute("sizes");
        target.setAttribute("src", image.currentSrc);
      }
      target.setAttribute("loading", "eager");
    }
    style.animation = "none";
    style.transition = "none";
    Array.from(source.children).forEach((child, i) => {
      const targetChild = target.children[i];
      if (targetChild) snapshot(child, targetChild);
    });
  };
  snapshot(visual, clone);
  clone.setAttribute("data-hero-layer", "");
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("inert", "");
  Object.assign(clone.style, {
    position: "absolute",
    left: `${content.left}px`,
    top: `${content.top}px`,
    right: "auto",
    bottom: "auto",
    width: `${content.width}px`,
    height: `${content.height}px`,
    minWidth: "0",
    minHeight: "0",
    maxWidth: "none",
    maxHeight: "none",
    boxSizing: "border-box",
    margin: "0",
    transformOrigin: "center center",
    translate: "none",
    rotate: "none",
    scale: "none",
    // Both real pages have explicit stacking contexts at or below this tier.
    zIndex: String(Number(Z_FOREGROUND) + 1),
    willChange: "transform, clip-path",
    pointerEvents: "none",
    opacity: heroVisualOpacity(visual),
  });
  if (resetRadius) clone.style.borderRadius = "0";
  return clone;
}
