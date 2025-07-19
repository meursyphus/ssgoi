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
    if (overflow.includes('auto') || overflow.includes('scroll')) {
      return current;
    }
    
    // Also check if element has scroll even without explicit overflow
    if (current.scrollHeight > current.clientHeight || 
        current.scrollWidth > current.clientWidth) {
      return current;
    }
    
    current = current.parentElement;
  }
  
  // Return document element as fallback (handles body/html scrolling)
  return document.documentElement;
};
