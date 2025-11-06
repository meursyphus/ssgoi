import { getScrollingElement } from "../utils/get-scrolling-element";
import { getPositionedParent } from "../utils/get-positioned-parent";

/**
 * Creates a context manager for tracking transition-related information
 * including scroll positions and DOM element relationships
 */
export function createContextManager() {
  let scrollContainer: HTMLElement | null = null;
  let contextElement: HTMLElement | null = null;
  const scrollPositions: Map<string, { x: number; y: number }> = new Map();
  let currentPath: string | null = null;

  // Scroll listener - captures current scroll position
  const scrollListener = () => {
    if (scrollContainer && currentPath) {
      scrollPositions.set(currentPath, {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop,
      });
    }
  };

  // Initialize context with element - sets up scroll tracking and stores element for later use
  const initializeContext = (element: HTMLElement, path: string) => {
    // Store the element for positioned parent calculation
    contextElement = element;

    // Initialize scroll container once - finds the scrollable element
    if (!scrollContainer) {
      scrollContainer = getScrollingElement(element);

      // IMPORTANT: When the scrolling element is document.documentElement (html element),
      // scroll events must be attached to window, not the element itself.
      // This is because document.documentElement doesn't fire scroll events directly.
      // For all other scrollable containers, we attach the listener to the element.
      const target =
        scrollContainer === document.documentElement ? window : scrollContainer;
      target.addEventListener("scroll", scrollListener, {
        passive: true,
      });
    }

    // Update current path for scroll position tracking
    currentPath = path;
  };

  // Calculate scroll offset - computes difference between pages' scroll positions
  const calculateScrollOffset = (
    from?: string,
    to?: string,
  ): { x: number; y: number } => {
    const fromScroll =
      from && scrollPositions.has(from)
        ? scrollPositions.get(from)!
        : { x: 0, y: 0 };

    const toScroll =
      to && scrollPositions.has(to) ? scrollPositions.get(to)! : { x: 0, y: 0 };

    return {
      x: -toScroll.x + fromScroll.x,
      y: -toScroll.y + fromScroll.y,
    };
  };

  // Getter for scroll container - returns null if not initialized yet
  const getScrollContainer = () => scrollContainer;

  // Get positioned parent element - finds the nearest positioned ancestor
  const getPositionedParentElement = () => {
    if (!contextElement) return document.body;
    return getPositionedParent(contextElement);
  };

  // Get scroll position for a specific path
  const getScrollPosition = (path?: string): { x: number; y: number } => {
    return path && scrollPositions.has(path)
      ? scrollPositions.get(path)!
      : { x: 0, y: 0 };
  };

  return {
    initializeContext,
    calculateScrollOffset,
    getScrollContainer,
    getPositionedParentElement,
    getScrollPosition,
  };
}
