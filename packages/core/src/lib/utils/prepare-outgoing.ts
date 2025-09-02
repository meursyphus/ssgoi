/**
 * Applies common styles for outgoing page elements
 * Makes the element absolute positioned to allow the incoming page to take its place
 */
export const prepareOutgoing = (element: HTMLElement): void => {
  element.style.position = "absolute";
  element.style.width = "100%";
  element.style.top = "0";
  element.style.left = "0";
};
