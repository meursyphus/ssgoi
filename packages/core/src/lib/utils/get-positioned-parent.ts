/**
 * Gets the positioned parent element that serves as the containing block for absolute positioning
 * Returns the nearest ancestor with position: relative, absolute, fixed, or sticky
 * Falls back to document.body if no positioned ancestor is found
 */
export const getPositionedParent = (element: HTMLElement): HTMLElement => {
  let parent = element.parentElement;

  while (parent && parent !== document.body) {
    const position = window.getComputedStyle(parent).position;

    // Check if parent is positioned (not static)
    if (
      position === "relative" ||
      position === "absolute" ||
      position === "fixed" ||
      position === "sticky"
    ) {
      return parent;
    }

    parent = parent.parentElement;
  }

  // Return document.body as fallback (default containing block)
  return document.body;
};
