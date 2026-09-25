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
};

/** Where the incoming page sits in normal flow, in its offsetParent. */
export type OutgoingSlot = { top: number; offsetParent: Element };

/**
 * The slot the outgoing page just left: the incoming page took it over when
 * both are children of `parent` (a keyed swap, or sibling Activities).
 *
 * Read it before `prepare`, which may take the incoming page out of flow
 * (`jaemin` pins it `position: fixed`).
 */
export const measureOutgoingSlot = (
  incoming: HTMLElement,
  parent: Node | null,
): OutgoingSlot | null => {
  if (!parent || incoming.parentNode !== parent) return null;
  const { offsetParent } = incoming;
  return offsetParent ? { top: incoming.offsetTop, offsetParent } : null;
};

/**
 * `prepareOutgoing` pins the outgoing page to the top of its containing block,
 * which is only where it sat when nothing in flow came before it. A nested
 * boundary below a persistent app bar sat lower, and would jump up by the bar's
 * height for the whole transition. Move it back down to `slot`.
 *
 * Both reads are offsets from the same offsetParent, so the shift is a pure
 * layout delta: transforms (a mid-flight page, an animating ancestor) and
 * whichever ancestor is the containing block cancel out. `outgoing` must be in
 * the document.
 */
export const placeOutgoing = (
  outgoing: HTMLElement,
  slot: OutgoingSlot | null,
  context?: Pick<SsgoiTransitionContext, "scrollOffset">,
): void => {
  if (!slot) return;
  const scrollY = context?.scrollOffset?.y ?? 0;
  outgoing.style.top = "0px";
  const shift =
    outgoing.offsetParent === slot.offsetParent
      ? slot.top - outgoing.offsetTop
      : 0;
  outgoing.style.top = `${shift - scrollY}px`;
};
