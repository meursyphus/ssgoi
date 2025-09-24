import type { SggoiTransitionContext } from "../types";

/**
 * Applies common styles for outgoing page elements
 * Makes the element absolute positioned to allow the incoming page to take its place
 */
export const prepareOutgoing = (
  element: HTMLElement,
  context?: SggoiTransitionContext,
): void => {
  element.style.position = "absolute";
  element.style.width = "100%";
  element.style.top = `${-1 * (context?.scroll.y ?? 0)}px`;
  element.style.left = "0";
};
