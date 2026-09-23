import type { NavigationDirection } from "@types";
import { cloneCrossfadeVisual } from "../crossfade";
import type { MediaRect } from "../media-geometry";
import { Z_FOREGROUND } from "../stacking";
import { HERO_ENTER_KEY, HERO_EXIT_KEY, HERO_LEGACY_KEY } from "./keys";
import type { HeroPair } from "./types";

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
  if (
    pair.fromEl.getAttribute(HERO_EXIT_KEY) === pair.key &&
    pair.toEl.getAttribute(HERO_ENTER_KEY) === pair.key
  )
    return false;
  // Legacy symmetric keys have no endpoint roles, so use core navigation.
  return (
    direction === "backward" &&
    pair.fromEl.getAttribute(HERO_LEGACY_KEY) === pair.key &&
    pair.toEl.getAttribute(HERO_LEGACY_KEY) === pair.key
  );
}

/** Both exit images share a stacking context above the pages and their chrome. */
export function createHeroExitLayer(
  from: HTMLElement,
  to: HTMLElement,
  fromContent: MediaRect,
  toContent: MediaRect,
  resetRadius: boolean,
): { layer: HTMLElement; source: HTMLElement; destination: HTMLElement } {
  const layer = document.createElement("div");
  layer.setAttribute("data-hero-layer", "");
  layer.setAttribute("aria-hidden", "true");
  layer.setAttribute("inert", "");
  Object.assign(layer.style, {
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    isolation: "isolate",
    zIndex: String(Number(Z_FOREGROUND) + 1),
  });
  const copy = (visual: HTMLElement, content: MediaRect): HTMLElement => {
    const clone = cloneCrossfadeVisual(visual);
    Object.assign(clone.style, {
      left: `${content.left}px`,
      top: `${content.top}px`,
      width: `${content.width}px`,
      height: `${content.height}px`,
      zIndex: "auto",
      // Add the two weighted images inside the isolated layer so opaque
      // images stay opaque at the midpoint instead of exposing list chrome.
      mixBlendMode: "plus-lighter",
    });
    if (resetRadius) clone.style.borderRadius = "0";
    return clone;
  };
  const source = copy(from, fromContent);
  const destination = copy(to, toContent);
  source.setAttribute("data-hero-layer-source", "");
  destination.setAttribute("data-hero-layer-destination", "");
  layer.append(destination, source);
  return { layer, source, destination };
}
