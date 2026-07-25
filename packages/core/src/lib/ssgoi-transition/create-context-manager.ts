import { getScrollingElement } from "@utils";
import { getPositionedParent } from "@utils";

const MOBILE_BREAKPOINT_PX = 768;
const RESTORE_MAX_RETRIES = 10;
const TRANSITION_SETTLE_FRAMES = 10;

type ScrollPosition = { x: number; y: number };

export type ContextManagerOptions = {
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
  const { resolvePath = (path: string) => path } = options;

  let scrollContainer: HTMLElement | null = null;

  // Device context for a functional `transitions` config is based on the
  // scroll container's width (not the viewport). Cached + refreshed via
  // ResizeObserver so reads on the hot path don't synchronously force layout.
  let cachedIsMobile = false;
  let isMobileMeasured = false;

  const measureIsMobile = (): boolean => {
    // Fall back to viewport width when the container hasn't been laid out
    // yet (clientWidth === 0). Without this, an early measurement on a
    // not-yet-visible container caches `false` and resolves functional
    // transition configs as desktop on actual mobile devices.
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

  const getStorageKey = (rawPath: string): string => {
    // Every scroll-key derivation funnels through here (record, restore, offset,
    // evict), so resolving the path once at the top normalizes ALL of them to a
    // single middleware-aware identity — no caller can sneak a raw path past it.
    const path = resolvePath(rawPath);
    return `path:${path}`;
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
  // A rule can resolve after the IN page registers. Each newer decision
  // invalidates an already-scheduled reset/restore for that same registration.
  let restorationGeneration = 0;
  // Nested IN boundaries for the same path share one resolved rule decision.
  let scrollPolicyDecisionGeneration = 0;

  const scrollListener = () => {
    if (scrollContainer && currentPath && !isTransitioning) {
      scrollPositions.set(getStorageKey(currentPath), {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop,
      });
    }
  };

  // Apply the policy chosen by the transition that is bringing this path IN.
  // The OUT page is never reset here; it keeps its original scroll through
  // transition preparation and playback.
  const restoreScrollPosition = (
    path: string,
    preserves: boolean,
    contextGeneration: number,
  ) => {
    if (!scrollContainer) return;

    const myRestorationGeneration = ++restorationGeneration;
    const storageKey = getStorageKey(path);

    // Resolve the target: saved value if preservation is on AND we have one,
    // otherwise (0, 0). These cases go through the same retry loop so a
    // router-side scroll restore (e.g., SvelteKit's `afterNavigate`) running
    // after our first scrollTo can be overridden within the retry window.
    const target: ScrollPosition =
      preserves && scrollPositions.has(storageKey)
        ? scrollPositions.get(storageKey)!
        : { x: 0, y: 0 };

    let retryCount = 0;
    const tryRestore = () => {
      if (
        !scrollContainer ||
        contextGeneration !== initGeneration ||
        myRestorationGeneration !== restorationGeneration
      ) {
        return;
      }

      // A reset is also the latest known position for this page. Recording it
      // prevents a later transition that opts into restoration from reviving a
      // stale position that predates this reset.
      if (!preserves) scrollPositions.set(storageKey, target);

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

  const initializeContext = (
    element: HTMLElement,
    path: string,
    preserves?: boolean,
  ) => {
    isTransitioning = true;
    // Nested boundaries for one route can register separately. They share one
    // scroll decision; only a different path starts a new scroll generation.
    const myGeneration =
      currentPath === path ? initGeneration : ++initGeneration;
    contextElement = element;

    if (!scrollContainer) {
      scrollContainer = getScrollingElement(element);

      // Re-measure now that the real container is known; subsequent updates
      // come from the ResizeObserver below, which fires asynchronously after
      // layout (no synchronous reflow while resolving transition rules).
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
    // Keep the pre-IN snapshot locally. If pairing is unusually late and the
    // fallback reset has already run, a later restore decision can still use
    // the position that existed when this page began entering.
    const storageKeyAtEntry = getStorageKey(path);
    const savedPositionAtEntry = scrollPositions.get(storageKeyAtEntry);

    const applyScrollPolicy = (shouldRestore: boolean) => {
      if (myGeneration !== initGeneration) return;
      scrollPolicyDecisionGeneration = myGeneration;
      if (shouldRestore && savedPositionAtEntry) {
        scrollPositions.set(storageKeyAtEntry, savedPositionAtEntry);
      }
      restoreScrollPosition(path, shouldRestore, myGeneration);
    };

    if (preserves !== undefined) {
      applyScrollPolicy(preserves);
    } else {
      // Pairing normally resolves in the microtask before this frame. A first
      // page (or an unmatched boundary) has no pair, so it receives the safe
      // default reset here.
      requestAnimationFrame(() => {
        if (
          scrollPolicyDecisionGeneration !== myGeneration &&
          myGeneration === initGeneration
        ) {
          applyScrollPolicy(false);
        }
      });
    }

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

    return applyScrollPolicy;
  };

  // Calculate scroll offset between two pages so transitions can use it as a
  // delta. Non-preserved 'to' paths are treated as fresh (0,0).
  const calculateScrollOffset = (
    from?: string,
    to?: string,
    preserveTo = false,
  ): { x: number; y: number } => {
    const fromKey = from ? getStorageKey(from) : null;
    const fromScroll =
      fromKey && scrollPositions.has(fromKey)
        ? scrollPositions.get(fromKey)!
        : { x: 0, y: 0 };

    const toKey = to && preserveTo ? getStorageKey(to) : null;
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
    scrollPositions.delete(getStorageKey(path));
  };

  const getScrollContainer = () => scrollContainer;

  const getPositionedParentElement = () => {
    if (!contextElement) return document.body;
    return getPositionedParent(contextElement);
  };

  const getScrollPosition = (
    path?: string,
    preserves = true,
  ): { x: number; y: number } => {
    if (!preserves) return { x: 0, y: 0 };
    const key = path ? getStorageKey(path) : null;
    return key && scrollPositions.has(key)
      ? scrollPositions.get(key)!
      : { x: 0, y: 0 };
  };

  return {
    initializeContext,
    calculateScrollOffset,
    evictScrollPosition,
    getScrollContainer,
    getPositionedParentElement,
    getScrollPosition,
    // Exposed so a functional `transitions` config can branch on device class.
    getIsMobile: detectIsMobile,
  };
}
