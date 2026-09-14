import { Z_BACKGROUND, Z_FOREGROUND } from "../stacking";
import type { MediaRect } from "../media-geometry";

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

/** CSS hooks are caller-owned; the engine never relaxes ancestor clipping. */
export function markHeroTransitioning(element: HTMLElement): () => void {
  const previous = element.getAttribute("data-hero-transitioning");
  element.setAttribute("data-hero-transitioning", "");
  return () => {
    if (previous === null) element.removeAttribute("data-hero-transitioning");
    else element.setAttribute("data-hero-transitioning", previous);
  };
}

/** Keep the incoming page above the positioned outgoing page, including its media. */
export function stackHeroPages(from: HTMLElement, to: HTMLElement): () => void {
  const restoreFrom = preserveStyles(from, ["z-index"]);
  const restoreTo = preserveStyles(to, ["z-index", "position"]);
  from.style.zIndex = Z_BACKGROUND;
  to.style.zIndex = Z_FOREGROUND;
  if (getComputedStyle(to).position === "static")
    to.style.position = "relative";
  return () => {
    restoreFrom();
    restoreTo();
  };
}

/** Resize the real image to its fitted content while reserving its flow box. */
export function fitHeroImage(
  element: HTMLElement,
  content: MediaRect,
  box: MediaRect,
): () => void {
  if (element.tagName !== "IMG") return () => {};
  const style = getComputedStyle(element);
  const number = (value: string) => Number.parseFloat(value) || 0;
  const borderBox = style.boxSizing === "border-box";
  const width =
    number(style.width) +
    (borderBox
      ? 0
      : number(style.paddingLeft) +
        number(style.paddingRight) +
        number(style.borderLeftWidth) +
        number(style.borderRightWidth));
  const height =
    number(style.height) +
    (borderBox
      ? 0
      : number(style.paddingTop) +
        number(style.paddingBottom) +
        number(style.borderTopWidth) +
        number(style.borderBottomWidth));
  const targetWidth = (content.width * width) / box.width;
  const targetHeight = (content.height * height) / box.height;
  // An empty layout placeholder is not a shared-image clone. The actual image
  // never leaves its parent and keeps its decoded bitmap and event listeners.
  let placeholder: HTMLElement | null = null;
  if (style.position !== "absolute" && style.position !== "fixed") {
    placeholder = document.createElement("span");
    placeholder.setAttribute("data-hero-placeholder", "");
    placeholder.setAttribute("aria-hidden", "true");
    Object.assign(placeholder.style, {
      display: style.display === "inline" ? "inline-block" : style.display,
      boxSizing: "border-box",
      width: `${width}px`,
      height: `${height}px`,
      margin: style.margin,
      flex: style.flex,
      alignSelf: style.alignSelf,
      gridArea: style.gridArea,
      order: style.order,
      verticalAlign: style.verticalAlign,
      visibility: "hidden",
      pointerEvents: "none",
    });
    element.before(placeholder);
  }
  const restore = preserveStyles(element, [
    "position",
    "left",
    "top",
    "right",
    "bottom",
    "width",
    "height",
    "min-width",
    "min-height",
    "max-width",
    "max-height",
    "box-sizing",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "flex",
  ]);
  Object.assign(element.style, {
    position: "absolute",
    left: "0",
    top: "0",
    right: "auto",
    bottom: "auto",
    boxSizing: "border-box",
    width: `${targetWidth}px`,
    height: `${targetHeight}px`,
    minWidth: "0",
    minHeight: "0",
    maxWidth: "none",
    maxHeight: "none",
    margin: "0",
    flex: "none",
  });
  return () => {
    restore();
    placeholder?.remove();
  };
}
