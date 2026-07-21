import type { PreserveScrollOption, PreserveScrollFn } from "@types";
import { getScrollingElement } from "@utils";
import { getPositionedParent } from "@utils";
import { matchPath } from "./find-matching-transition";

const MOBILE_BREAKPOINT_PX = 768;
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

  /* ── Scroll restoration ──────────────────────────────────────────────────
   *
   * Restoration is a small reconciler, not a polling loop. A session opens at
   * init with a target (saved value, or top for non-preserved paths) and a
   * pre-write baseline; `superviseRestore` is then invoked only when something
   * actually happens:
   *  - one deferred kick on the next frame (the entering page needs a layout
   *    before the first write can stick),
   *  - every scroll event during the transition window (the same listener that
   *    captures positions outside it),
   *  - the entering page resizing (ResizeObserver) — growth is what makes a
   *    clamped target reachable.
   *
   * Each invocation classifies how the container moved since OUR last write:
   *  - unmoved, or merely clamped by a shorter layout: our write hasn't stuck /
   *    isn't reachable yet — re-apply.
   *  - moved to (0,0) while we hold a non-top target: a router-style top reset
   *    (e.g. SvelteKit's `afterNavigate`) — the one movement we fight —
   *    re-apply.
   *  - moved anywhere else: a deliberate scroll by the entering page (anchor,
   *    `useEffect` scrollTo, scroll-to-bottom) or by the user — yield and
   *    never touch scroll again for this navigation.
   * The baseline is read synchronously at init, before the first write, so a
   * scroll landing between commit and the first frame (`useLayoutEffect`
   * timing) is classified the same way instead of being overwritten.
   *
   * The session closes when the settle countdown flips `isTransitioning` off —
   * one shared window for capture suppression and restoration alike.
   * ──────────────────────────────────────────────────────────────────────── */

  type RestoreSession = {
    target: ScrollPosition;
    // Last position WE put the container at (seeded with the pre-write
    // baseline). Re-read after every write because the browser clamps writes
    // to the scrollable extent.
    lastApplied: ScrollPosition;
    yielded: boolean;
  };

  let restoreSession: RestoreSession | null = null;
  // Lazily created, reused across sessions; watches the entering page element
  // so content growth (images, async data) re-triggers reconciliation.
  let restoreObserver: ResizeObserver | null = null;

  const superviseRestore = () => {
    const session = restoreSession;
    if (!session || session.yielded || !scrollContainer) return;

    const current: ScrollPosition = {
      x: scrollContainer.scrollLeft,
      y: scrollContainer.scrollTop,
    };
    // Where lastApplied passively sits after any layout shrink — clamping
    // moves nobody deliberately, so landing exactly there is not a scroll.
    const expected: ScrollPosition = {
      x: Math.min(
        session.lastApplied.x,
        Math.max(0, scrollContainer.scrollWidth - scrollContainer.clientWidth),
      ),
      y: Math.min(
        session.lastApplied.y,
        Math.max(
          0,
          scrollContainer.scrollHeight - scrollContainer.clientHeight,
        ),
      ),
    };

    const movedExternally =
      Math.abs(current.x - expected.x) >= 1 ||
      Math.abs(current.y - expected.y) >= 1;

    if (movedExternally) {
      const movedToTop = current.x < 1 && current.y < 1;
      const targetIsTop = session.target.x < 1 && session.target.y < 1;
      // Only a top reset while we hold a saved position gets fought; any
      // other movement is someone's intent — stop competing with it.
      if (!movedToTop || targetIsTop) {
        session.yielded = true;
        restoreObserver?.disconnect();
        return;
      }
    }

    const atTarget =
      Math.abs(current.x - session.target.x) < 1 &&
      Math.abs(current.y - session.target.y) < 1;
    if (atTarget) return;

    // behavior:"instant" pins the write against a page-level
    // `scroll-behavior: smooth`, which would otherwise turn restoration into
    // a visible crawl and leave the read-back below mid-animation.
    scrollContainer.scrollTo({
      top: session.target.y,
      left: session.target.x,
      behavior: "instant",
    });
    session.lastApplied = {
      x: scrollContainer.scrollLeft,
      y: scrollContainer.scrollTop,
    };
  };

  const endRestoreSession = () => {
    restoreObserver?.disconnect();
    restoreSession = null;
  };

  const startRestoreSession = (path: string, element: HTMLElement) => {
    // A newer navigation supersedes any live session — two sessions with
    // different targets must never fight over one container.
    endRestoreSession();
    if (!scrollContainer) return;

    const policy = getScrollPolicy(path);
    // Shared-key paths without a saved value: leave the current scroll alone,
    // a parent transition context may own it.
    if (
      policy.preserves &&
      policy.shared &&
      !scrollPositions.has(policy.storageKey)
    ) {
      return;
    }

    restoreSession = {
      target:
        policy.preserves && scrollPositions.has(policy.storageKey)
          ? scrollPositions.get(policy.storageKey)!
          : { x: 0, y: 0 },
      lastApplied: {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop,
      },
      yielded: false,
    };

    if (typeof ResizeObserver !== "undefined") {
      restoreObserver ??= new ResizeObserver(() => superviseRestore());
      restoreObserver.observe(element);
    }

    // First write is deferred one frame so the entering page has a layout to
    // scroll against. A stale kick from a superseded navigation is harmless:
    // the reconciler only ever acts on the CURRENT session.
    requestAnimationFrame(superviseRestore);
  };

  const scrollListener = () => {
    if (!scrollContainer || !currentPath) return;
    // During the transition window the listener supervises restoration instead
    // of capturing: OUT scrolls of an unmounted page must not be recorded, but
    // they are exactly the signals the reconciler classifies.
    if (isTransitioning) {
      superviseRestore();
      return;
    }
    scrollPositions.set(getScrollPolicy(currentPath).storageKey, {
      x: scrollContainer.scrollLeft,
      y: scrollContainer.scrollTop,
    });
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
    }

    currentPath = path;
    startRestoreSession(path, element);

    // Close the transition window after ~10 frames (~167ms) — long enough for
    // most page transitions and any router-driven scroll reset to land. One
    // countdown bounds both halves of the window: the restore session ends and
    // scroll capture resumes.
    let settleCount = 0;
    const trySettle = () => {
      // A newer init started its own settle; this older one must not be the
      // one to flip the flag back, otherwise it'd unlock listener captures
      // mid-way through the newer transition.
      if (myGeneration !== initGeneration) return;
      settleCount++;
      if (settleCount >= TRANSITION_SETTLE_FRAMES) {
        endRestoreSession();
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
