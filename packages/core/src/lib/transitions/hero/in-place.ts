import { insertBeside } from "@utils";
import { Z_BACKGROUND, Z_FOREGROUND } from "../stacking";

/** Restore just the properties owned by this transition, including !important. */
export function preserveStyles(
  element: HTMLElement,
  properties: string[],
): () => void {
  const styles = properties.map((name) => ({
    name,
    value: element.style.getPropertyValue(name),
    priority: element.style.getPropertyPriority(name),
  }));
  return () => {
    for (const { name, value, priority } of styles) {
      if (value) element.style.setProperty(name, value, priority);
      else element.style.removeProperty(name);
    }
  };
}

/**
 * Keep the incoming page above the positioned outgoing page, including its
 * media. The restore skips a page a newer run already owns (`owns`).
 */
export function stackHeroPages(
  from: HTMLElement,
  to: HTMLElement,
): (owns?: (element: HTMLElement) => boolean) => void {
  const restoreFrom = preserveStyles(from, ["z-index"]);
  const restoreTo = preserveStyles(to, ["z-index", "position"]);
  from.style.zIndex = Z_BACKGROUND;
  to.style.zIndex = Z_FOREGROUND;
  if (getComputedStyle(to).position === "static")
    to.style.position = "relative";
  return (owns = () => true) => {
    if (owns(from)) restoreFrom();
    if (owns(to)) restoreTo();
  };
}

/**
 * Which side of the real visual its crossfade copy sits on. Both are siblings
 * in one stacking context and paint in tree order.
 * - `below`: the copy precedes the visual and stays opaque while the visual
 *   fades in over it. The absolutely positioned copy also paints the parts of
 *   the flight the visual cannot: cover content past the image's own box (a
 *   replaced element clips there unless the browser honors
 *   `overflow: visible`) and anything an unpositioned clipping ancestor cuts.
 * - `above`: the copy follows the visual and fades out over it.
 */
export type CrossfadePlacement = "below" | "above";

/**
 * Insert the copy next to the visual without moving anything, preferring
 * below (see `insertBeside`).
 */
export function placeCrossfadeCopy(
  visual: HTMLElement,
  copy: HTMLElement,
): CrossfadePlacement {
  return insertBeside<CrossfadePlacement>(visual, copy, [
    ["below", (node) => visual.before(node)],
    ["above", (node) => visual.after(node)],
  ]);
}
