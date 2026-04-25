import type { PreserveScrollOption, PreserveScrollFn } from "../types";
import { getScrollingElement } from "../utils/get-scrolling-element";
import { getPositionedParent } from "../utils/get-positioned-parent";
import { matchPath } from "./find-matching-transition";

const MOBILE_BREAKPOINT_PX = 768;
const RESTORE_RETRY_WINDOW_MS = 1000;

type ScrollPosition = { x: number; y: number };

type PendingRestoreState = {
  container: HTMLElement;
  path: string;
  position: ScrollPosition;
};

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
  let pendingContextElement: HTMLElement | null = null;
  const scrollPositions: Map<string, ScrollPosition> = new Map();
  let currentPath: string | null = null;
  let lockedOutgoingPath: string | null = null;
  let restoringPath: string | null = null;
  let pendingRestoreFrame: number | null = null;
  let pendingRestoreState: PendingRestoreState | null = null;

  const getNow = () =>
    typeof performance !== "undefined" ? performance.now() : Date.now();
  let pendingRestoreDeadline = 0;

  const scrollListener = () => {
    if (!scrollContainer || !currentPath) return;
    if (currentPath === lockedOutgoingPath || currentPath === restoringPath) {
      return;
    }
    scrollPositions.set(currentPath, {
      x: scrollContainer.scrollLeft,
      y: scrollContainer.scrollTop,
    });
  };

  const captureScrollPosition = (path: string) => {
    if (!scrollContainer) return;
    scrollPositions.set(path, {
      x: scrollContainer.scrollLeft,
      y: scrollContainer.scrollTop,
    });
  };

  const cancelPendingRestore = (
    options: { commitCurrentScroll?: boolean } = {},
  ) => {
    const { commitCurrentScroll = true } = options;

    if (pendingRestoreFrame !== null) {
      cancelAnimationFrame(pendingRestoreFrame);
      pendingRestoreFrame = null;
    }

    if (
      commitCurrentScroll &&
      restoringPath &&
      currentPath === restoringPath &&
      scrollContainer
    ) {
      captureScrollPosition(restoringPath);
    }

    pendingRestoreState = null;
    pendingRestoreDeadline = 0;
    restoringPath = null;
  };

  const applyScrollPosition = (
    container: HTMLElement,
    position: ScrollPosition,
  ) => {
    const maxX = Math.max(0, container.scrollWidth - container.clientWidth);
    const maxY = Math.max(0, container.scrollHeight - container.clientHeight);
    const targetX = Math.max(0, Math.min(position.x, maxX));
    const targetY = Math.max(0, Math.min(position.y, maxY));

    if (container.scrollLeft === targetX && container.scrollTop === targetY) {
      return;
    }

    container.scrollTo({
      left: targetX,
      top: targetY,
    });
  };

  const restoreScrollPosition = (path: string) => {
    if (!scrollContainer) return;
    cancelPendingRestore();

    const container = scrollContainer;
    const savedPosition =
      shouldPreserve(path) && scrollPositions.has(path)
        ? scrollPositions.get(path)!
        : { x: 0, y: 0 };

    scrollPositions.set(path, savedPosition);
    restoringPath = path;
    pendingRestoreState = {
      container,
      path,
      position: savedPosition,
    };
    pendingRestoreDeadline = getNow() + RESTORE_RETRY_WINDOW_MS;

    // Some frameworks mount the new page before layout is final or apply
    // their own scroll reset a little later. Keep asserting the target scroll
    // for a short window so both out-first and in-first adapters converge.
    const keepRestoring = () => {
      const restoreState = pendingRestoreState;
      if (!restoreState) return;

      if (
        scrollContainer !== restoreState.container ||
        currentPath !== restoreState.path
      ) {
        cancelPendingRestore({ commitCurrentScroll: false });
        return;
      }

      applyScrollPosition(restoreState.container, restoreState.position);

      if (getNow() >= pendingRestoreDeadline) {
        cancelPendingRestore();
        return;
      }

      pendingRestoreFrame = requestAnimationFrame(keepRestoring);
    };

    pendingRestoreFrame = requestAnimationFrame(keepRestoring);
  };

  // Prepare incoming context with element. Activation is deferred until the
  // navigation pair is resolved so frameworks with different out/in ordering
  // still preserve the correct outgoing scroll state.
  const initializeContext = (element: HTMLElement, path: string) => {
    pendingContextElement = element;

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
    if (currentPath && currentPath !== path) {
      captureScrollPosition(currentPath);
      lockedOutgoingPath = currentPath;
    }
  };

  const activateContext = (
    path: string,
    options: { restoreScroll?: boolean } = {},
  ) => {
    if (
      currentPath &&
      currentPath !== path &&
      currentPath !== lockedOutgoingPath
    ) {
      captureScrollPosition(currentPath);
    }

    cancelPendingRestore();

    if (pendingContextElement) {
      contextElement = pendingContextElement;
      pendingContextElement = null;
    }

    lockedOutgoingPath = null;
    currentPath = path;

    if (options.restoreScroll) {
      restoreScrollPosition(path);
    }
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
    activateContext,
    calculateScrollOffset,
    evictScrollPosition,
    shouldPreserve,
    getScrollContainer,
    getPositionedParentElement,
    getScrollPosition,
  };
}
