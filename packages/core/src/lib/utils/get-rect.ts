/**
 * Get the relative position of an element to its root container
 * Returns a DOMRect with position relative to the root element
 * Uses offset properties instead of getBoundingClientRect to avoid transform issues
 */
export function getRect(root: HTMLElement, el: HTMLElement): DOMRect {
  function getAbsolutePosition(element: HTMLElement) {
    let top = 0;
    let left = 0;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    
    // Walk up the offsetParent chain to get absolute position
    let current: HTMLElement | null = element;
    while (current) {
      top += current.offsetTop;
      left += current.offsetLeft;
      
      // Move to offsetParent
      current = current.offsetParent as HTMLElement | null;
    }
    
    // Subtract scroll position to get viewport-relative coordinates
    top -= window.scrollY;
    left -= window.scrollX;
    
    return { top, left, width, height };
  }
  
  // Get absolute positions for both elements
  const rootPos = getAbsolutePosition(root);
  const elPos = getAbsolutePosition(el);
  
  // Calculate relative position (el relative to root)
  return new DOMRect(
    elPos.left - rootPos.left,
    elPos.top - rootPos.top,
    elPos.width,
    elPos.height
  );
}