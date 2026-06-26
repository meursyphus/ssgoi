import type { SsgoiTransitionContext } from "@types";
import { getRect } from "./get-rect";

/**
 * Viewport-aligned slice of the scrolling container, anchored at the
 * chosen side's scroll position. Used by page transitions
 * (sheet/jaemin/film) to size the visible page area.
 *
 * When scrolling === positioned, no offset is subtracted — that container
 * IS the viewport and its body-relative top is not an inset. Otherwise
 * the positioned parent's offset within scrolling is subtracted.
 */
export function getViewportRect(
  context: SsgoiTransitionContext,
  side: "from" | "to",
) {
  const { scrollingElement, positionedParent } = context;
  const offsetTop =
    scrollingElement !== positionedParent &&
    scrollingElement.contains(positionedParent)
      ? getRect(scrollingElement, positionedParent).top
      : 0;
  return {
    top: context[side].scroll.y,
    left: 0,
    width: scrollingElement.clientWidth,
    height: scrollingElement.clientHeight - offsetTop,
  };
}

/**
 * Vertical placement for an absolute backdrop-filter overlay that lives inside
 * `positionedParent` but must cover the scrolling element's visible viewport
 * regardless of scroll (the blur tone of sheet / zoom).
 *
 * Unlike {@link getViewportRect} — which sizes a page element's own clipped
 * slice in its own box — the overlay is a separate layer whose absolute
 * coordinates are relative to `positionedParent`. During a transition the
 * container is scrolled to the chosen side's position, so an `inset: 0` overlay
 * would ride that scroll and leave the bottom `scroll.y` px unblurred. To land
 * the overlay at the live viewport top instead, its content-space `top` backs
 * out both the scroll (`scroll.y`) and `positionedParent`'s own offset within
 * the scroller (`offsetTop`); its height is the full viewport (`clientHeight`).
 */
export function getOverlayRect(
  context: SsgoiTransitionContext,
  side: "from" | "to",
) {
  const { scrollingElement, positionedParent } = context;
  const offsetTop =
    scrollingElement !== positionedParent &&
    scrollingElement.contains(positionedParent)
      ? getRect(scrollingElement, positionedParent).top
      : 0;
  return {
    top: context[side].scroll.y - offsetTop,
    height: scrollingElement.clientHeight,
  };
}
