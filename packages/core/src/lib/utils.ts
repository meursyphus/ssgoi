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

/**
 * Calculates optimal spring animation parameters for a desired settling time
 * @param settlingTime - Desired settling time in seconds (e.g., 0.1 for 100ms)
 * @returns Spring parameters with stiffness and damping values for critically damped motion
 */
export const timeToSpring = (settlingTime: number): { stiffness: number; damping: number } => {
  // Using mass = 1 internally for calculations
  const mass = 1;
  
  // Calculate stiffness from settling time
  // Formula: settling_time ≈ 3 / sqrt(stiffness) for critically damped spring
  // Therefore: stiffness = (3 / settling_time)²
  const stiffness = Math.pow(3 / settlingTime, 2);
  
  // Calculate damping for critically damped condition
  // Formula: damping = 2 * sqrt(stiffness * mass)
  const damping = 2 * Math.sqrt(stiffness * mass);
  
  return {
    stiffness,
    damping
  };
};

/**
 * Delays execution for a specified amount of milliseconds
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
