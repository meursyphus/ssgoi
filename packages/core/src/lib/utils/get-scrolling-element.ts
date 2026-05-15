const SCROLLABLE_OVERFLOW_VALUES = new Set(["auto", "scroll", "overlay"]);

/**
 * Gets the scrolling element that contains the given element
 * Returns the first scrollable parent element or document.documentElement
 */
export const getScrollingElement = (element: HTMLElement): HTMLElement => {
  let current = element.parentElement;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);

    if (
      SCROLLABLE_OVERFLOW_VALUES.has(style.overflowY) ||
      SCROLLABLE_OVERFLOW_VALUES.has(style.overflowX)
    ) {
      return current;
    }

    current = current.parentElement;
  }

  // Return document element as fallback (handles body/html scrolling)
  return document.documentElement;
};
