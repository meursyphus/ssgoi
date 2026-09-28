import { IntegratorProvider, WebAnimation } from "../../animation";
import type { AnimationDisposal } from "../../animation/animation";
import type { PhysicsOptions } from "@types";
import { collectContentTargets } from "../content-targets";
import { CROSSFADE_ATTRIBUTE, clampOpacity } from "../crossfade";
import type { MediaRect } from "../media-geometry";

/**
 * Share of the motion during which a page's overlays are visible: they show
 * only once their page owns the last part of the move. A control or caption
 * painted over the shared image at half opacity mid-flight marks the tile's
 * edge against the identical image around it, and a large copy of list
 * chrome would otherwise linger over most of the opening page.
 */
export const CHROME_SPAN = 0.4;

/** Opacity of a page's overlays given the progress toward that page. */
export function chromeOpacity(toward: number): number {
  return clampOpacity((toward - (1 - CHROME_SPAN)) / CHROME_SPAN);
}

/** Strictly overlapping boxes; a shared edge (a title right under the player) does not count. */
export function rectsOverlap(
  a: MediaRect,
  b: MediaRect,
  epsilon = 0.5,
): boolean {
  return (
    a.left + a.width > b.left + epsilon &&
    b.left + b.width > a.left + epsilon &&
    a.top + a.height > b.top + epsilon &&
    b.top + b.height > a.top + epsilon
  );
}

/**
 * Content of the zoomed page that is painted over the shared visual: the
 * disjoint subtrees around it whose box overlaps `area`. Those are the pieces
 * that would pop when the tile settles — everything else is revealed or
 * clipped by the tile's own window. A sizeless wrapper (`display: contents`,
 * a zero-height positioning anchor) is looked through so the controls it
 * holds are still found.
 */
export function collectOverlappingContent(
  page: HTMLElement,
  visuals: HTMLElement[],
  area: MediaRect,
  measure: (element: HTMLElement) => MediaRect,
): HTMLElement[] {
  const targets: HTMLElement[] = [];
  const visit = (nodes: Iterable<Element>): void => {
    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.getAttribute?.(CROSSFADE_ATTRIBUTE) != null) continue;
      const box = measure(node);
      if (box.width > 0 && box.height > 0) {
        if (rectsOverlap(box, area)) targets.push(node);
        continue;
      }
      visit(Array.from(node.children));
    }
  };
  visit(collectContentTargets(page, visuals));
  return targets;
}

/**
 * Fade `targets` with the shared physics: in as the page enters, out as it
 * exits, each toward its own authored opacity. Inline styles are restored
 * only while this run still owns the element — a newer navigation may already
 * be fading the same page again.
 */
export function fadeContent(
  targets: HTMLElement[],
  mode: "enter" | "exit",
  physics: PhysicsOptions,
  onDispose: (fn: (disposal: AnimationDisposal) => void) => void,
): WebAnimation[] {
  if (targets.length === 0) return [];
  const entries = targets.map((element) => {
    const computed = Number.parseFloat(getComputedStyle(element).opacity);
    return {
      element,
      opacity: element.style.opacity,
      willChange: element.style.willChange,
      target: Number.isFinite(computed) ? computed : 1,
    };
  });
  for (const { element } of entries) {
    // Seed the entering side so the page does not flash at full opacity
    // before the first animation tick.
    if (mode === "enter") element.style.opacity = "0";
    element.style.willChange = "opacity";
  }
  onDispose((disposal) => {
    for (const { element, opacity, willChange } of entries) {
      if (!disposal.owns(element)) continue;
      element.style.opacity = opacity;
      element.style.willChange = willChange;
    }
  });
  return entries.map(
    ({ element, target }) =>
      new WebAnimation({
        element,
        integrator: IntegratorProvider.from(physics),
        style: (t, u) => ({
          opacity: chromeOpacity(mode === "enter" ? t : u) * target,
        }),
      }),
  );
}
