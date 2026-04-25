import type { PreserveScrollOption, PreserveScrollFn } from "../types";
import { getScrollingElement } from "../utils/get-scrolling-element";
import { getPositionedParent } from "../utils/get-positioned-parent";
import { matchPath } from "./find-matching-transition";

const MOBILE_BREAKPOINT_PX = 768;

export type ContextManagerOptions = {
  /**
   * Scroll preservation policy. See SsgoiConfig.preserveScroll for full semantics.
   * @default (isMobile) => isMobile
   */
  preserveScroll?: PreserveScrollOption;
};

/**
 * Creates a context manager for tracking transition-related information
 * including scroll positions and DOM element relationships
 */
export function createContextManager(options: ContextManagerOptions = {}) {
  const { preserveScroll = (isMobile: boolean) => isMobile } = options;

  // Normalize all forms (boolean, { exclude }, function) to a function call.
  const resolvePreserve: PreserveScrollFn =
    typeof preserveScroll === "function"
      ? preserveScroll
      : () => preserveScroll;

  let scrollContainer: HTMLElement | null = null;

  // "Mobile" is inferred from the scroll container's own width, not the
  // viewport. This way an iPhone-frame demo embedded in a desktop page (a
  // 390px-wide container) still triggers mobile-style scroll preservation.
  // The value is cached and refreshed via ResizeObserver so reads on the
  // hot path don't trigger synchronous layout.
  let cachedIsMobile = false;
  let isMobileMeasured = false;

  const measureIsMobile = (): boolean => {
    const width =
      scrollContainer?.clientWidth ??
      (typeof window !== "undefined" ? window.innerWidth : 0);
    return width > 0 && width < MOBILE_BREAKPOINT_PX;
  };

  const detectIsMobile = (): boolean => {
    if (!isMobileMeasured) {
      cachedIsMobile = measureIsMobile();
      isMobileMeasured = true;
    }
    return cachedIsMobile;
  };

  // A path is preserved when the resolved value is enabled AND the path is
  // not in the exclude list. Eviction (not scrollTo) is what actually
  // distinguishes preserved vs non-preserved at navigation time.
  const shouldPreserve = (path: string): boolean => {
    const value = resolvePreserve(detectIsMobile());
    if (value === false) return false;
    if (value === true) return true;
    return !value.exclude.some((pattern) => matchPath(path, pattern));
  };
  let contextElement: HTMLElement | null = null;
  const scrollPositions: Map<string, { x: number; y: number }> = new Map();
  let currentPath: string | null = null;

  const scrollListener = () => {
    if (!scrollContainer || !currentPath) return;
    scrollPositions.set(currentPath, {
      x: scrollContainer.scrollLeft,
      y: scrollContainer.scrollTop,
    });
  };

  const restoreScrollPosition = (path: string) => {
    if (!scrollContainer) return;
    const savedPosition = scrollPositions.get(path) ?? { x: 0, y: 0 };
    scrollContainer.scrollTo({
      top: savedPosition.y,
      left: savedPosition.x,
    });
  };

  // Initialize context with element - sets up scroll tracking and stores element for later use
  const initializeContext = (element: HTMLElement, path: string) => {
    contextElement = element;

    if (!scrollContainer) {
      scrollContainer = getScrollingElement(element);

      // Re-measure now that the real container is known; subsequent updates
      // come from the ResizeObserver below, which fires asynchronously after
      // layout (no synchronous reflow on shouldPreserve calls).
      cachedIsMobile = measureIsMobile();
      isMobileMeasured = true;
      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(() => {
          cachedIsMobile = measureIsMobile();
        });
        observer.observe(scrollContainer);
      }

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

    currentPath = path;
    restoreScrollPosition(path);
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

    // If 'to' is not preserved, treat as 0 (arrival starts fresh)
    const toScroll =
      to && shouldPreserve(to) && scrollPositions.has(to)
        ? scrollPositions.get(to)!
        : { x: 0, y: 0 };

    return {
      x: -toScroll.x + fromScroll.x,
      y: -toScroll.y + fromScroll.y,
    };
  };

  // Evict a saved scroll position. Caller invokes after OUT context is built
  // for paths where preservation is disabled, so stale values don't leak across
  // navigations.
  const evictScrollPosition = (path: string) => {
    scrollPositions.delete(path);
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
    evictScrollPosition,
    shouldPreserve,
    getScrollContainer,
    getPositionedParentElement,
    getScrollPosition,
  };
}
