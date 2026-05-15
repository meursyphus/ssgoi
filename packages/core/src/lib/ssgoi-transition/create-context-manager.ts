import type { PreserveScrollOption, PreserveScrollFn } from "../types";
import { getScrollingElement } from "../utils/get-scrolling-element";
import { getPositionedParent } from "../utils/get-positioned-parent";
import { matchPath } from "./find-matching-transition";

const MOBILE_BREAKPOINT_PX = 768;
const RESTORE_MAX_RETRIES = 10;
const TRANSITION_SETTLE_FRAMES = 10;

type ScrollPosition = { x: number; y: number };

export type ContextManagerOptions = {
  /**
   * Scroll preservation policy. See SsgoiConfig.preserveScroll for full semantics.
   * @default (isMobile) => isMobile
   */
  preserveScroll?: PreserveScrollOption;
  /**
   * Explicit scroll container resolver. When provided and it returns an
   * element, it takes precedence over the parent traversal heuristic.
   */
  getScrollContainer?: () => HTMLElement | null;
};

export function createContextManager(options: ContextManagerOptions = {}) {
  const {
    preserveScroll = (isMobile: boolean) => isMobile,
    getScrollContainer: resolveScrollContainer,
  } = options;

  const resolvePreserve: PreserveScrollFn =
    typeof preserveScroll === "function"
      ? preserveScroll
      : () => preserveScroll;

  let scrollContainer: HTMLElement | null = null;

  // Mobile detection is based on the scroll container's width (not the
  // viewport) so an iPhone-frame demo embedded in a desktop page still
  // triggers mobile behavior. Cached + refreshed via ResizeObserver so reads
  // on the hot path don't synchronously force layout.
  let cachedIsMobile = false;
  let isMobileMeasured = false;

  const measureIsMobile = (): boolean => {
    // Fall back to viewport width when the container hasn't been laid out
    // yet (clientWidth === 0). Without this, an early measurement on a
    // not-yet-visible container caches `false` (desktop) and breaks the
    // default `(isMobile) => isMobile` predicate on actual mobile devices.
    const containerWidth = scrollContainer?.clientWidth ?? 0;
    const width =
      containerWidth > 0
        ? containerWidth
        : typeof window !== "undefined"
          ? window.innerWidth
          : 0;
    return width > 0 && width < MOBILE_BREAKPOINT_PX;
  };

  const detectIsMobile = (): boolean => {
    if (!isMobileMeasured) {
      cachedIsMobile = measureIsMobile();
      isMobileMeasured = true;
    }
    return cachedIsMobile;
  };

  const shouldPreserve = (path: string): boolean => {
    const value = resolvePreserve(detectIsMobile());
    if (value === false) return false;
    if (value === true) return true;
    return !value.exclude.some((pattern) => matchPath(path, pattern));
  };

  let contextElement: HTMLElement | null = null;
  const scrollPositions: Map<string, ScrollPosition> = new Map();
  let currentPath: string | null = null;
  // Suppress scroll capture during the transition window so OUT scrolls of
  // an already-unmounted page don't bleed into IN under a wrong currentPath.
  let isTransitioning = false;
  // Generation token so a fresh init invalidates older settles. Without it,
  // rapid navigations can leave an earlier settle running that flips
  // isTransitioning back to false mid-way through a newer transition.
  let initGeneration = 0;

  const scrollListener = () => {
    if (scrollContainer && currentPath && !isTransitioning) {
      scrollPositions.set(currentPath, {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop,
      });
    }
  };

  // Restore scroll position for the given path. For non-preserved paths the
  // arrival starts at the top; for preserved paths with a saved value we
  // re-apply for up to 10 frames or until the target is reached, whichever
  // comes first. Stops on success so we don't fight subsequent user scrolls.
  const restoreScrollPosition = (path: string) => {
    if (!scrollContainer) return;

    // Resolve the target: saved value if preservation is on AND we have one,
    // otherwise (0, 0). All three cases — non-preserved, preserved-but-empty,
    // preserved-with-value — go through the same retry loop so a router-side
    // scroll restore (e.g., SvelteKit's `afterNavigate`) running after our
    // first scrollTo can be overridden within the retry window.
    const target: ScrollPosition =
      shouldPreserve(path) && scrollPositions.has(path)
        ? scrollPositions.get(path)!
        : { x: 0, y: 0 };

    let retryCount = 0;
    const tryRestore = () => {
      if (!scrollContainer) return;

      scrollContainer.scrollTo({
        top: target.y,
        left: target.x,
      });

      const targetReached =
        Math.abs(scrollContainer.scrollTop - target.y) < 1 &&
        Math.abs(scrollContainer.scrollLeft - target.x) < 1;

      if (!targetReached && retryCount < RESTORE_MAX_RETRIES) {
        retryCount++;
        requestAnimationFrame(tryRestore);
      }
    };

    requestAnimationFrame(tryRestore);
  };

  const initializeContext = (element: HTMLElement, path: string) => {
    isTransitioning = true;
    const myGeneration = ++initGeneration;
    contextElement = element;

    if (!scrollContainer) {
      scrollContainer =
        resolveScrollContainer?.() ?? getScrollingElement(element);

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

      // IMPORTANT: When the scrolling element is document.documentElement,
      // scroll events must be attached to window, not the element itself.
      // For all other scrollable containers, attach to the element directly.
      const target =
        scrollContainer === document.documentElement ? window : scrollContainer;
      target.addEventListener("scroll", scrollListener, {
        passive: true,
      });
    }

    currentPath = path;
    restoreScrollPosition(path);

    // Re-enable scroll capture after the transition window settles. Spans
    // ~10 frames (~167ms) — long enough for most page transitions and any
    // router-driven scroll reset to land before we start trusting the
    // listener again.
    let settleCount = 0;
    const trySettle = () => {
      // A newer init started its own settle; this older one must not be the
      // one to flip the flag back, otherwise it'd unlock listener captures
      // mid-way through the newer transition.
      if (myGeneration !== initGeneration) return;
      settleCount++;
      if (settleCount >= TRANSITION_SETTLE_FRAMES) {
        isTransitioning = false;
      } else {
        requestAnimationFrame(trySettle);
      }
    };
    requestAnimationFrame(trySettle);
  };

  // Calculate scroll offset between two pages so transitions can use it as a
  // delta. Non-preserved 'to' paths are treated as fresh (0,0).
  const calculateScrollOffset = (
    from?: string,
    to?: string,
  ): { x: number; y: number } => {
    const fromScroll =
      from && scrollPositions.has(from)
        ? scrollPositions.get(from)!
        : { x: 0, y: 0 };

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
  // for paths where preservation is disabled, so stale values don't leak
  // across navigations.
  const evictScrollPosition = (path: string) => {
    scrollPositions.delete(path);
  };

  const getScrollContainer = () => scrollContainer;

  const getPositionedParentElement = () => {
    if (!contextElement) return document.body;
    return getPositionedParent(contextElement);
  };

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
