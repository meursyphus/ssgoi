import { getScrollingElement } from "../utils/get-scrolling-element";
import { getPositionedParent } from "../utils/get-positioned-parent";

/**
 * Options for the context manager
 */
export type ContextManagerOptions = {
  /**
   * Automatically restore scroll position when navigating to a previously visited page
   * @default false
   */
  preserveScroll?: boolean;
};

/**
 * Creates a context manager for tracking transition-related information
 * including scroll positions and DOM element relationships
 */
export function createContextManager(options: ContextManagerOptions = {}) {
  const { preserveScroll = false } = options;

  let scrollContainer: HTMLElement | null = null;
  let contextElement: HTMLElement | null = null;
  const scrollPositions: Map<string, { x: number; y: number }> = new Map();
  let currentPath: string | null = null;
  let isTransitioning = false; // Prevent saving scroll during transition

  // Scroll listener - captures current scroll position
  const scrollListener = () => {
    // Don't save scroll position during page transition
    if (scrollContainer && currentPath && !isTransitioning) {
      scrollPositions.set(currentPath, {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop,
      });
    }
  };

  // Restore scroll position for the given path
  const restoreScrollPosition = (path: string) => {
    if (!scrollContainer || !preserveScroll) return;

    const savedPosition = scrollPositions.get(path);
    if (!savedPosition) return;

    const maxRetries = 10;
    let retryCount = 0;

    const tryRestore = () => {
      if (!scrollContainer) return;

      scrollContainer.scrollTo({
        top: savedPosition.y,
        left: savedPosition.x,
      });

      // Retry if scroll position wasn't applied (DOM might not be ready)
      const currentY = scrollContainer.scrollTop;
      const currentX = scrollContainer.scrollLeft;
      const targetReached =
        Math.abs(currentY - savedPosition.y) < 1 &&
        Math.abs(currentX - savedPosition.x) < 1;

      if (!targetReached && retryCount < maxRetries) {
        retryCount++;
        requestAnimationFrame(tryRestore);
      }
    };

    requestAnimationFrame(tryRestore);
  };

  // Initialize context with element - sets up scroll tracking and stores element for later use
  const initializeContext = (element: HTMLElement, path: string) => {
    // Prevent scroll listener from saving during transition
    isTransitioning = true;

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

    // Restore scroll position if preserveScroll is enabled
    // For first visits (no saved position), scroll to top
    if (preserveScroll && scrollContainer) {
      const savedPosition = scrollPositions.get(path);
      if (savedPosition) {
        restoreScrollPosition(path);
      } else {
        // First visit - scroll to top (SPA doesn't auto-reset scroll)
        scrollContainer.scrollTo({ top: 0, left: 0 });
      }
    }

    // Re-enable scroll listener after transition settles
    const maxTransitionRetries = 10;
    let transitionRetryCount = 0;

    const tryEnableListener = () => {
      transitionRetryCount++;
      if (transitionRetryCount >= maxTransitionRetries) {
        isTransitioning = false;
      } else {
        requestAnimationFrame(tryEnableListener);
      }
    };

    requestAnimationFrame(tryEnableListener);
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
