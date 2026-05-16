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
