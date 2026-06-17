import type {
  AnyTransitionConfig,
  SsgoiConfig,
  SsgoiContext,
  SsgoiPathTransition,
  SsgoiPathTransitionInput,
  SsgoiTransitionsFn,
  SsgoiTransitionContext,
  PrepareArgs,
  CreateElement,
} from "@types";
import { prepareOutgoing, promiseAll } from "@utils";
import { processSymmetricTransitions } from "./process-symmetric-transitions";
import { createContextManager } from "./create-context-manager";
import { createSwipeBackDetector } from "./create-swipe-back-detector";
import { findMatchingTransition } from "./find-matching-transition";
import { createNavigationDetector } from "./navigation-detector-strategy";
import { watchUnmount, type UnmountAnchor } from "./unmount-observer";
import { watchVisibility, type VisibilityHandle } from "./visibility-observer";
import { HostAnimation } from "../animation/host-animation";

function isTransitionGroup(
  transition: SsgoiPathTransitionInput,
): transition is readonly SsgoiPathTransitionInput[] {
  return Array.isArray(transition);
}

function flattenTransitions(
  transitions: readonly SsgoiPathTransitionInput[],
): SsgoiPathTransition[] {
  const flattened: SsgoiPathTransition[] = [];
  for (const transition of transitions) {
    if (isTransitionGroup(transition)) {
      flattened.push(...flattenTransitions(transition));
    } else {
      flattened.push(transition);
    }
  }
  return flattened;
}

type TransitionMode = "unmount" | "hidden";

type PendingSide = {
  element: HTMLElement;
  parent: Node | null;
  nextSibling: Node | null;
  /**
   * How the outgoing page left (meaningful on the OUT side only):
   *  - "unmount": real DOM removal (SPA frameworks, Next without
   *    cacheComponents). The detached real node is reinserted for the OUT
   *    animation, then removed on settle.
   *  - "hidden":  React `<Activity>` / Next `cacheComponents` toggled it to
   *    `display:none`. The REAL node is reused (page state preserved) and
   *    re-hidden on settle.
   * Absent on the IN side; defaults to "unmount".
   */
  mode?: TransitionMode;
};

type ElementAnchor = {
  parent: Node | null;
  nextSibling: Node | null;
};

/**
 * Page-level transition context.
 *
 * Pure promise plumbing: the framework adapter calls `in(element)` on mount
 * and `out(element)` on unmount; the dispatcher pairs them by path via
 * NavigationDetector, then `.then`-chains the prepare result, the `from`
 * element, and the `to` element. `animation()` runs once the chain resolves —
 * never via blocking `await` — so a follow-up navigation can start its own pair
 * while a prior one is still building.
 */
export interface CreateSsgoiTransitionContextOptions {
  /**
   * Long-lived host that owns playback state across consecutive transitions.
   * Pass one in to drive play/pause/rate from the outside (e.g. dev tools).
   * Omit it and the context spins up its own internal host.
   */
  host?: HostAnimation;
}

export function createSggoiTransitionContext(
  options: SsgoiConfig,
  contextOptions: CreateSsgoiTransitionContextOptions = {},
): SsgoiContext {
  const {
    transitions = [],
    middleware = (from, to) => ({ from, to }),
    preserveScroll = (isMobile: boolean) => isMobile,
  } = options;

  const host = contextOptions.host ?? new HostAnimation();

  const detector = createNavigationDetector();

  // Normalize both accepted shapes to the functional form up front so the rest
  // of the file deals with exactly one shape: a static list becomes a function
  // that ignores its args and returns that list. No `typeof transitions` branch
  // ever leaks past this line.
  const resolveTransitions: SsgoiTransitionsFn =
    typeof transitions === "function" ? transitions : () => transitions;

  const swipeDetector = createSwipeBackDetector();
  swipeDetector.initialize();

  const {
    initializeContext,
    calculateScrollOffset,
    evictScrollPosition,
    shouldPreserve,
    getScrollContainer,
    getPositionedParentElement,
    getScrollPosition,
    getIsMobile,
  } = createContextManager({ preserveScroll });

  // Resolve + flatten + process the path-transition list lazily. `isMobile` is
  // only reliable once the scroll container is known (measured on the first IN),
  // which always precedes findMatchingTransition. Memoized per device class so a
  // static list is processed at most once per `isMobile` value and the resolver
  // never runs on the hot path more than necessary.
  const processedByIsMobile = new Map<boolean, SsgoiPathTransition[]>();
  const getProcessedTransitions = (): SsgoiPathTransition[] => {
    const isMobile = getIsMobile();
    let processed = processedByIsMobile.get(isMobile);
    if (!processed) {
      processed = processSymmetricTransitions(
        flattenTransitions(resolveTransitions({ isMobile })),
      );
      processedByIsMobile.set(isMobile, processed);
    }
    return processed;
  };

  let pendingOut: PendingSide | null = null;
  let pendingIn: PendingSide | null = null;

  const elementAnchors = new WeakMap<HTMLElement, ElementAnchor>();

  const captureAnchor = (element: HTMLElement) => {
    elementAnchors.set(element, {
      parent: element.parentNode,
      nextSibling: element.nextSibling,
    });
  };

  const readAnchor = (element: HTMLElement): ElementAnchor => {
    const cached = elementAnchors.get(element);
    if (cached) return cached;
    return {
      parent: element.parentNode,
      nextSibling: element.nextSibling,
    };
  };

  // ── Hidden-mode bookkeeping (React <Activity> / Next cacheComponents) ───────
  //
  // In hidden mode a page element is registered ONCE (first mount) and then
  // toggled between visible and display:none forever; OUT/IN are driven by the
  // visibility-observer rather than mount/unmount. Repeated, interruptible
  // navigation stays correct via three pieces of state:
  //
  //  - `owner` / `transitionEpoch`: every hidden run stamps the real nodes it
  //    drives with a monotonically increasing epoch. On settle a run only
  //    restores a node it STILL owns, so when a follow-up navigation re-claims
  //    the same nodes mid-flight (A: OUT→IN, B: IN→OUT) the interrupted run's
  //    cleanup is skipped and the live run owns the final resting state — no
  //    vanished or stuck-hidden pages.
  //  - `hiddenState`: per-element resting bookkeeping. `savedCss` is the clean
  //    inline cssText snapshot taken on idle→active entry (so every style a
  //    transition leaks onto a reused node is wiped on settle); `intent` is
  //    React's latest visible/hidden intent; `visibleDisplay` is the inline
  //    display to restore to when resting visible (possibly "" for class-driven
  //    display); `computedDisplay` is a concrete value used to reveal a hidden
  //    node for its out-animation.
  type HiddenState = {
    vis: VisibilityHandle;
    savedCss: string | null;
    intent: "visible" | "hidden";
    visibleDisplay: string;
    computedDisplay: string;
  };
  const hiddenState = new WeakMap<HTMLElement, HiddenState>();
  const owner = new WeakMap<HTMLElement, number>();
  let transitionEpoch = 0;

  const readComputedDisplay = (el: HTMLElement): string => {
    const d =
      typeof getComputedStyle !== "undefined"
        ? getComputedStyle(el).display
        : "";
    return d && d !== "none" ? d : "block";
  };

  // Capture the element's resting visible display while it IS visible: the
  // inline value (what React restores on reveal, possibly "") plus a concrete
  // computed value (needed to reveal it later, where "" is not a legal write).
  const captureVisibleDisplay = (el: HTMLElement, state: HiddenState): void => {
    state.visibleDisplay = el.style.getPropertyValue("display");
    state.computedDisplay = readComputedDisplay(el);
  };

  // Reconcile a reused (hidden-mode) real node to its final resting state — but
  // only if this run still owns it (a newer run re-claiming it wins). Wipes all
  // transition-leaked inline styles via the clean cssText snapshot, then sets
  // display to match React's latest intent.
  const reconcileResting = (el: HTMLElement, epoch: number): void => {
    if (owner.get(el) !== epoch) return; // superseded by a newer run
    owner.delete(el);
    const state = hiddenState.get(el);
    if (!state) return;
    if (state.savedCss !== null) {
      el.style.cssText = state.savedCss;
      state.savedCss = null;
    }
    if (state.intent === "hidden") {
      // Match React's own hidden form so a later React reveal is observable.
      state.vis.setDisplay("none", true);
    } else if (state.visibleDisplay) {
      state.vis.setDisplay(state.visibleDisplay, false);
      captureVisibleDisplay(el, state);
    } else {
      // React drives visibility via a class / UA default (no inline display).
      state.vis.setDisplay(null);
      captureVisibleDisplay(el, state);
    }
  };

  const runTransition = (
    config: AnyTransitionConfig,
    fromPath: string,
    toPath: string,
    outSide: PendingSide,
    inSide: PendingSide,
  ): void => {
    const fromOriginal = outSide.element;
    const toElement = inSide.element;
    const outMode: TransitionMode = outSide.mode ?? "unmount";
    const isHidden = outMode === "hidden";

    const { parent, nextSibling } = outSide.parent
      ? { parent: outSide.parent, nextSibling: outSide.nextSibling }
      : readAnchor(fromOriginal);

    const scrollOffset = calculateScrollOffset(fromPath, toPath);

    const ssgoiContext: SsgoiTransitionContext = {
      scrollOffset,
      from: { scroll: getScrollPosition(fromPath) },
      to: { scroll: getScrollPosition(toPath) },
      get scrollingElement() {
        return getScrollContainer() || document.documentElement;
      },
      get positionedParent() {
        return getPositionedParentElement();
      },
    };

    // The element handed to the animation as `from`:
    //  - unmount mode: the detached real node, reinserted after `prepare` and
    //    removed on settle.
    //  - hidden mode: the REAL outgoing node, already revealed + taken out of
    //    flow by `handleHide`. Reusing it keeps page state alive AND lets a
    //    follow-up navigation hand its motion back continuously (matchInto keys
    //    on element identity) — a fresh clone every nav never could.
    let fromElement: HTMLElement;
    if (isHidden) {
      fromElement = fromOriginal;
      // scrollOffset is only known now — finish the out-of-flow placement begun
      // in handleHide so the incoming page lines up with the prior scroll.
      fromElement.style.top = `${-1 * (scrollOffset?.y ?? 0)}px`;
      // Snapshot the incoming node's clean inline styles BEFORE `prepare` paints
      // starting styles onto it, so settle can wipe transition leakage off this
      // reused real node. (The outgoing node was snapshotted in handleHide.)
      const toState = hiddenState.get(toElement);
      if (toState && toState.savedCss === null) {
        toState.savedCss = toElement.style.cssText;
      }
    } else {
      // The host framework already detached the original. Reuse that exact
      // node so DOM state (input values, canvas contents, media state, etc.)
      // survives through the outgoing animation instead of being flattened by
      // cloneNode().
      fromElement = fromOriginal;
      // Outgoing page goes absolute so the incoming page can take its slot.
      // Style only; insertion is deferred until after `prepare`.
      prepareOutgoing(fromElement, ssgoiContext);
    }

    if (!shouldPreserve(fromPath)) evictScrollPosition(fromPath);

    // Stamp ownership BEFORE host.attach force-completes any prior run (below):
    // the prior run's settle checks ownership and must already see THIS run
    // owning the shared real nodes, so it skips them instead of fighting us.
    // Hidden mode reuses mounted real nodes; unmount mode reuses a detached real
    // node and removes it on settle, so ownership guards are only needed for
    // hidden mode's persistent nodes.
    const epoch = isHidden ? ++transitionEpoch : 0;
    if (isHidden) {
      owner.set(toElement, epoch);
      owner.set(fromOriginal, epoch);
    }

    const fromPromise: Promise<HTMLElement> = Promise.resolve(fromElement);
    const toPromise: Promise<HTMLElement> = Promise.resolve(toElement);

    const createdElements: HTMLElement[] = [];
    const createElement: CreateElement = ((
      id: string,
      tag: keyof HTMLElementTagNameMap = "div",
    ): HTMLElement => {
      const el = document.createElement(tag);
      el.setAttribute("data-ssgoi-id", id);
      createdElements.push(el);
      return el;
    }) as CreateElement;

    const prepareArgs: PrepareArgs = {
      from: fromPromise,
      to: toPromise,
      context: ssgoiContext,
      createElement,
    };

    const extrasPromise: Promise<object> = Promise.resolve(
      config.prepare ? config.prepare(prepareArgs) : {},
    );

    // Resolve from/to + prepare extras in parallel via promiseAll util.
    // The entire function returns synchronously; .then fires when ready.
    promiseAll({
      from: fromPromise,
      to: toPromise,
      extras: extrasPromise,
    }).then(({ from: resolvedFrom, to: resolvedTo, extras }) => {
      // Now that prepare's microtasks have all run (initial styles, extras
      // built), drop the outgoing node into place. Order is:
      //   prepare → out insert → animation create/play
      // Hidden mode skips insertion: the real node is already in place.
      if (!isHidden && parent) {
        if (nextSibling && parent.contains(nextSibling)) {
          parent.insertBefore(fromElement, nextSibling);
        } else {
          parent.appendChild(fromElement);
        }
      }

      const animation = config.animation({
        from: resolvedFrom,
        to: resolvedTo,
        context: ssgoiContext,
        ...(extras as Record<string, unknown>),
      });

      // Per-transition settle. Wire this BEFORE attach — host.attach hooks
      // onComplete itself and chains through prior hooks, so cleanup still
      // fires once the run settles (natural finish OR host force-completing it).
      const prevOnComplete = animation.onComplete;
      animation.onComplete = () => {
        prevOnComplete?.();
        if (isHidden) {
          // Reuse: re-hide the real outgoing node (or leave it visible if a
          // follow-up navigation re-claimed it as an incoming page) and wipe
          // every inline style the transition leaked onto it. Both reconciles
          // no-op if a newer run now owns the node.
          reconcileResting(fromOriginal, epoch);
          reconcileResting(toElement, epoch);
        } else if (fromElement.parentNode) {
          fromElement.parentNode.removeChild(fromElement);
        }
        for (const extra of createdElements) {
          if (extra.parentNode) extra.parentNode.removeChild(extra);
        }
      };

      // Host owns pose handoff, playbackRate carry-over, and starts the run
      // according to its own play/pause/reverse state.
      host.attach(animation);
    });
  };

  const handleArrival = (path: string, side: "in" | "out"): void => {
    const isSwipeBack = swipeDetector.isSwipeBack();
    detector.trigger(path, side);

    // .then chain — handleArrival returns immediately, dispatcher never blocks.
    detector.get(side).then((pair) => {
      if (side === "in") swipeDetector.onPageEnter();
      if (!pair) return;

      if (isSwipeBack) {
        if (side === "out" && pair.from && !shouldPreserve(pair.from)) {
          evictScrollPosition(pair.from);
        }
        pendingOut = null;
        pendingIn = null;
        return;
      }

      // Only the IN side drives the run — by then both sides have arrived.
      if (side !== "in") return;

      const { from: transformedFrom, to: transformedTo } = middleware(
        pair.from,
        pair.to,
      );

      const config = findMatchingTransition(
        transformedFrom,
        transformedTo,
        getProcessedTransitions(),
      );

      const outSide = pendingOut;
      const inSide = pendingIn;
      pendingOut = null;
      pendingIn = null;

      if (!config || !outSide || !inSide) return;

      runTransition(config, transformedFrom, transformedTo, outSide, inSide);
    });
  };

  // React drove `element` to display:none (an <Activity> went mode="hidden").
  // Reveal the REAL node immediately — synchronously, inside the observer's
  // microtask, before the browser paints — so it animates out from where it sat
  // instead of flashing away, and take it out of flow so the incoming page
  // claims its slot. The run itself starts once the IN side pairs.
  const handleHide = (element: HTMLElement, path: string) => {
    const state = hiddenState.get(element);
    if (!state) return;
    // React's <Activity> can commit the SAME hide more than once (dev re-commit
    // / follow-up render). Only the first edge of a given intent starts a
    // transition; a repeat must NOT enqueue a second OUT, or it corrupts the
    // navigation detector's pairing for the next real navigation. Real nav
    // always FLIPS intent, so it is never deduped here.
    const alreadyHidden = state.intent === "hidden";
    state.intent = "hidden";

    // Snapshot inline styles once, on idle→active entry, so settle can wipe
    // transition leakage off this reused node. These are the node's resting
    // styles except for React's just-applied `display:none` — which is fine,
    // because reconcileResting always overrides display explicitly afterward.
    // If already mid-flight (savedCss set), keep the original snapshot.
    if (state.savedCss === null) state.savedCss = element.style.cssText;

    // (Re-)reveal over React's `display:none !important`, every time — so the
    // node stays visible for its out-animation even when React re-asserts the
    // hide. A concrete computed value WITH !important keeps our reveal
    // observably distinct from React's plain `display:` reveal, so an
    // interrupting React reveal is still caught.
    state.vis.setDisplay(state.computedDisplay || "block", true);
    element.style.position = "absolute";
    element.style.width = "100%";
    element.style.left = "0";

    if (alreadyHidden) return; // duplicate hide — kept revealed, don't re-pair

    const anchor = readAnchor(element);
    pendingOut = {
      element,
      parent: anchor.parent,
      nextSibling: anchor.nextSibling,
      mode: "hidden",
    };
    const currentPath = element.getAttribute("data-ssgoi-transition") ?? path;
    handleArrival(currentPath, "out");
  };

  // React revealed `element` (an <Activity> went mode="visible"): it is entering
  // again, with its state preserved. Drive an IN exactly like a fresh mount,
  // minus the mount.
  const handleShow = (element: HTMLElement, path: string) => {
    const state = hiddenState.get(element);
    if (!state) return;
    // Dedupe redundant reveals (see handleHide): only an intent flip enters.
    if (state.intent === "visible") return;
    state.intent = "visible";
    // Capture React's visible display BEFORE the restore below mutates it.
    captureVisibleDisplay(element, state);

    // OUT→IN role swap: an in-flight outgoing node (savedCss already taken) is
    // being re-claimed as the incoming page. It still carries the out-of-flow
    // positioning handleHide imposed (position:absolute/width/left/top) plus the
    // out-transition's style leakage — normalize it back to its clean inline
    // styles so the incoming page re-enters in NORMAL flow, then re-assert the
    // visible display (the snapshot carries React's display:none from the hide).
    // savedCss is kept for the eventual settle; the spring handoff (matchInto)
    // carries motion continuity, so wiping the stale inline transform is fine.
    if (state.savedCss !== null) {
      element.style.cssText = state.savedCss;
      if (state.visibleDisplay) {
        state.vis.setDisplay(state.visibleDisplay, false);
      } else {
        state.vis.setDisplay(null);
      }
    }

    initializeContext(element, path);
    pendingIn = {
      element,
      parent: element.parentElement,
      nextSibling: element.nextElementSibling,
    };
    const currentPath = element.getAttribute("data-ssgoi-transition") ?? path;
    handleArrival(currentPath, "in");
  };

  const handleRemoval = (
    element: HTMLElement,
    path: string,
    removalAnchor?: UnmountAnchor,
  ) => {
    const state = hiddenState.get(element);
    if (state) {
      state.vis.stop();
      hiddenState.delete(element);
      owner.delete(element);
      // An Activity page evicted WHILE hidden (e.g. dropped from Next's bfcache)
      // is just GC, not a navigation — don't animate it out. Drop any pending
      // side that still points at this now-gone node so it can't mis-pair a
      // later arrival onto a detached element.
      if (state.intent === "hidden") {
        if (pendingOut?.element === element) pendingOut = null;
        if (pendingIn?.element === element) pendingIn = null;
        return;
      }
    }

    const anchor = removalAnchor ?? readAnchor(element);
    pendingOut = {
      element,
      parent: anchor.parent,
      nextSibling: anchor.nextSibling,
      mode: "unmount",
    };
    // Read the latest id from the DOM rather than the closure-captured path
    // so a mid-life id change (re-render with a new id prop on the same
    // element) leaves with its current identity, not the one it mounted with.
    const currentPath = element.getAttribute("data-ssgoi-transition") ?? path;
    handleArrival(currentPath, "out");
  };

  // Dedupe so the dispatcher tolerates repeat registers for the same node —
  // either from React re-firing a ref or a host that bounces in/out under
  // strict-mode double-mount.
  const registered = new WeakSet<HTMLElement>();

  const register: SsgoiContext["register"] = (path, element) => {
    if (registered.has(element)) return;
    registered.add(element);

    captureAnchor(element);

    // Watch React <Activity> / cacheComponents display toggles for this node for
    // the rest of its life. The node is registered ONCE; subsequent OUT/IN come
    // from these handlers (display:none flips), not from mount/unmount.
    const vis = watchVisibility(element, {
      onHide: () => handleHide(element, path),
      onShow: () => handleShow(element, path),
    });
    const state: HiddenState = {
      vis,
      savedCss: null,
      intent: vis.isHidden ? "hidden" : "visible",
      visibleDisplay: "",
      computedDisplay: "block",
    };
    hiddenState.set(element, state);

    // A node that mounts already hidden (e.g. an inactive Activity sibling) is
    // not "entering" — set it up but don't fire an IN until React reveals it.
    if (!vis.isHidden) {
      captureVisibleDisplay(element, state);
      initializeContext(element, path);
      pendingIn = {
        element,
        parent: element.parentElement,
        nextSibling: element.nextElementSibling,
      };
      handleArrival(path, "in");
    }

    watchUnmount(element, (anchor) => handleRemoval(element, path, anchor));
  };

  // Per-path ref callbacks are cached so adapters can drop `refFor(path)`
  // straight into `ref={…}` and React won't see a fresh function on every
  // render (no detach/attach churn).
  const refCallbacks = new Map<string, (element: HTMLElement | null) => void>();

  const refFor: SsgoiContext["refFor"] = (path) => {
    let cb = refCallbacks.get(path);
    if (!cb) {
      cb = (element) => {
        if (element) register(path, element);
      };
      refCallbacks.set(path, cb);
    }
    return cb;
  };

  return { register, refFor };
}
