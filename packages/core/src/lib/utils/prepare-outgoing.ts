import type { SsgoiTransitionContext } from "@types";

/**
 * Applies common styles for outgoing page elements
 * Makes the element absolute positioned to allow the incoming page to take its place
 */
export const prepareOutgoing = (
  element: HTMLElement,
  context?: Pick<SsgoiTransitionContext, "scrollOffset">,
): void => {
  element.style.position = "absolute";
  element.style.width = "100%";
  element.style.top = `${-1 * (context?.scrollOffset?.y ?? 0)}px`;
  element.style.left = "0";
  // The page is leaving: it lies over the one arriving in flow, and input
  // aimed through it (a wheel on the next page's carousel, a tap) belongs to
  // that page, not to a view that is on its way out. Restored with the rest
  // of the inline styles when the run settles.
  element.style.pointerEvents = "none";
};
