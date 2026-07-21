import type { PreserveScrollOption, PreserveScrollFn } from "@types";
import { getScrollingElement } from "@utils";
import { getPositionedParent } from "@utils";
import { matchPath } from "./find-matching-transition";
import {
  installDocumentScrollGuard,
  releaseDocumentScrollGuard,
} from "./document-scroll-guard";

const MOBILE_BREAKPOINT_PX = 768;
const RESTORE_MAX_RETRIES = 10;
const TRANSITION_SETTLE_FRAMES = 10;

type ScrollPosition = { x: number; y: number };
type ScrollPolicy = {
  preserves: boolean;
  shared: boolean;
  storageKey: string;
};

export type ContextManagerOptions = {
  /**
   * Scroll preservation policy. See SsgoiConfig.preserveScroll for full semantics.
   * @default (isMobile) => isMobile
   */
  preserveScroll?: PreserveScrollOption;
  /**
   * Resolves a raw path to the identity used for ALL scroll bookkeeping
   * (record, restore, offset, evict). Defaults to the path unchanged.
   *
   * Wire this to the config `middleware` so a rewritten/aliased route records and
   * restores its scroll under the SAME key the transition matcher resolves it to.
   * Without it, scroll is stored under the raw `data-ssgoi-transition` id while the
   * offset is looked up under the middleware-rewritten id (or vice-versa); the keys
   * miss each other and the outgoing page snaps to the top mid-transition.
   */
  resolvePath?: (path: string) => string;
};

export function createContextManager(options: ContextManagerOptions = {}) {
  const {
    preserveScroll = (isMobile: boolean) => isMobile,
    resolvePath = (path: string) => path,
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

  const getScrollPolicy = (rawPath: string): ScrollPolicy => {
    // Every scroll-key derivation funnels through here (record, restore, offset,
    // evict), so resolving the path once at the top normalizes ALL of them to a
    // single middleware-aware identity — no caller can sneak a raw path past it.
    const path = resolvePath(rawPath);
    const value = resolvePreserve(detectIsMobile());

    if (value === false) {
      return { preserves: false, shared: false, storageKey: `path:${path}` };
    }

    if (value === true) {
      return { preserves: true, shared: false, storageKey: `path:${path}` };
    }

    const excluded =
      value.exclude?.some((pattern) => matchPath(path, pattern)) ?? false;
    const shared = !excluded && Boolean(value.key);

    return {
      preserves: !excluded,
      shared,
      storageKey: shared ? `shared:${value.key}` : `path:${path}`,
    };
  };

  const shouldPreserve = (path: string): boolean => {
    return getScrollPolicy(path).preserves;
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
      scrollPositions.set(getScrollPolicy(currentPath).storageKey, {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop,
      });
    }
  };

  // Restore scroll position for the given path. For non-preserved paths the
  // arrival starts at the top; for shared-key paths without a saved value, leave
  // the current scroll alone because a parent transition context may own it.
  // Saved targets are re-applied for up to 10 frames or until reached.
  const restoreScrollPosition = (path: string) => {
    if (!scrollContainer) return;

    // Resolve the target: saved value if preservation is on AND we have one,
    // otherwise (0, 0). These cases go through the same retry loop so a
    // router-side scroll restore (e.g., SvelteKit's `afterNavigate`) running
    // after our first scrollTo can be overridden within the retry window.
    const policy = getScrollPolicy(path);
    if (
      policy.preserves &&
      policy.shared &&
      !scrollPositions.has(policy.storageKey)
    ) {
      return;
    }

    const target: ScrollPosition =
      policy.preserves && scrollPositions.has(policy.storageKey)
        ? scrollPositions.get(policy.storageKey)!
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

      if (targetReached) {
        if (scrollContainer === document.documentElement) {
          releaseDocumentScrollGuard(document);
        }
      } else if (retryCount < RESTORE_MAX_RETRIES) {
        retryCount++;
        requestAnimationFrame(tryRestore);
      } else if (scrollContainer === document.documentElement) {
        // Do not leave a stale floor behind when an async page never grows
        // enough to make the saved target reachable. The guard also owns a
        // safety timeout, but releasing here keeps the normal path prompt.
        releaseDocumentScrollGuard(document);
      }
    };

    requestAnimationFrame(tryRestore);
  };

  const initializeContext = (element: HTMLElement, path: string) => {
    isTransitioning = true;
    const myGeneration = ++initGeneration;
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

      // IMPORTANT: When the scrolling element is document.documentElement,
      // scroll events must be attached to window, not the element itself.
      // For all other scrollable containers, attach to the element directly.
      const target =
        scrollContainer === document.documentElement ? window : scrollContainer;
      target.addEventListener("scroll", scrollListener, {
        passive: true,
      });
      if (scrollContainer === document.documentElement) {
        installDocumentScrollGuard(document);
      }
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
    const fromKey = from ? getScrollPolicy(from).storageKey : null;
    const fromScroll =
      fromKey && scrollPositions.has(fromKey)
        ? scrollPositions.get(fromKey)!
        : { x: 0, y: 0 };

    const toPolicy = to ? getScrollPolicy(to) : null;
    const toKey = toPolicy?.preserves ? toPolicy.storageKey : null;
    const toScroll =
      toKey && scrollPositions.has(toKey)
        ? scrollPositions.get(toKey)!
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
    scrollPositions.delete(getScrollPolicy(path).storageKey);
  };

  const getScrollContainer = () => scrollContainer;

  const getPositionedParentElement = () => {
    if (!contextElement) return document.body;
    return getPositionedParent(contextElement);
  };

  const getScrollPosition = (path?: string): { x: number; y: number } => {
    const key = path ? getScrollPolicy(path).storageKey : null;
    return key && scrollPositions.has(key)
      ? scrollPositions.get(key)!
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
    // Same measurement that drives `preserveScroll`'s `isMobile`, exposed so a
    // functional `transitions` config can branch on it too.
    getIsMobile: detectIsMobile,
  };
}
