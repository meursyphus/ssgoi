/**
 * Gets the scrolling element that contains the given element
 * Returns the first scrollable parent element or document.documentElement
 */
export const getScrollingElement = (element: HTMLElement): HTMLElement => {
  let current = element.parentElement;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflow = style.overflow + style.overflowY + style.overflowX;

    // Check if element is scrollable
    if (overflow.includes("auto") || overflow.includes("scroll")) {
      return current;
    }

    // Also check if element has scroll even without explicit overflow
    if (
      current.scrollHeight > current.clientHeight ||
      current.scrollWidth > current.clientWidth
    ) {
      return current;
    }

    current = current.parentElement;
  }

  // Return document element as fallback (handles body/html scrolling)
  return document.documentElement;
};

/**
 * Delays execution for a specified amount of milliseconds
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
