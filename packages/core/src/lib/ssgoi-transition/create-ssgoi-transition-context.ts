import type {
  AnyTransitionConfig,
  SsgoiConfig,
  SsgoiContext,
  SsgoiPathTransition,
  SsgoiPathTransitionInput,
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
import { watchUnmount } from "./unmount-observer";
import {
  pauseVisibility,
  resumeVisibility,
  watchVisibility,
} from "./visibility-observer";
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

type PendingSide = {
  element: HTMLElement;
  parent: Element | null;
  nextSibling: Element | null;
  /**
   * True when this side was triggered by a `display: none` toggle (React
   * Activity / Next.js Cache Components) rather than a real
   * mount/unmount. The original element stays in the DOM, so the exit path
   * animates it in place instead of operating on a clone.
   */
  isVisibility?: boolean;
};

type ElementAnchor = {
  parent: Element | null;
  nextSibling: Element | null;
};

/**
 * Page-level transition context.
 *
 * Pure promise plumbing: the framework adapter calls `in(element)` on mount
 * and `out(element)` on unmount; the dispatcher pairs them by path via
 * NavigationDetector, then `.then`-chains the prepare result, the cloned
 * `from` element, and the `to` element. `animation()` runs once the chain
 * resolves — never via blocking `await` — so a follow-up navigation can
 * start its own pair while a prior one is still building.
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
  const processedTransitions = processSymmetricTransitions(
    flattenTransitions(transitions),
  );

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
  } = createContextManager({ preserveScroll });

  let pendingOut: PendingSide | null = null;
  let pendingIn: PendingSide | null = null;

  const elementAnchors = new WeakMap<HTMLElement, ElementAnchor>();

  const captureAnchor = (element: HTMLElement) => {
    elementAnchors.set(element, {
      parent: element.parentElement,
      nextSibling: element.nextElementSibling,
    });
  };

  const readAnchor = (element: HTMLElement): ElementAnchor => {
    const cached = elementAnchors.get(element);
    if (cached) return cached;
    return {
      parent: element.parentElement,
      nextSibling: element.nextElementSibling,
    };
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
    const isVisibilityOut = outSide.isVisibility === true;

    const { parent, nextSibling } = outSide.parent
      ? { parent: outSide.parent, nextSibling: outSide.nextSibling }
      : readAnchor(fromOriginal);

    // Activity-hidden elements stay in place — animate the original so we
    // never duplicate React-owned state into a detached clone. The unmount
    // path still clones because the host framework will detach the original
    // immediately after `out()` returns.
    const fromForAnimation: HTMLElement = isVisibilityOut
      ? fromOriginal
      : (fromOriginal.cloneNode(true) as HTMLElement);
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

    // Auto-applied for every transition — outgoing page goes absolute so the
    // incoming page can take its slot. Style only; insertion is deferred
    // until after `prepare` so any pre-paint styling settles first.
    prepareOutgoing(fromForAnimation, ssgoiContext);

    if (!shouldPreserve(fromPath)) evictScrollPosition(fromPath);

    const fromPromise: Promise<HTMLElement> = Promise.resolve(fromForAnimation);
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
      // built), drop the outgoing clone into place. Visibility-out skips
      // this — the original was never detached, so re-insertion would be a
      // double-mount. Order is: prepare → out insert → animation create/play
      if (!isVisibilityOut && parent) {
        if (nextSibling && parent.contains(nextSibling)) {
          parent.insertBefore(fromForAnimation, nextSibling);
        } else {
          parent.appendChild(fromForAnimation);
        }
      }

      const animation = config.animation({
        from: resolvedFrom,
        to: resolvedTo,
        context: ssgoiContext,
        ...(extras as Record<string, unknown>),
      });

      // Per-transition cleanup. Wire this BEFORE attach — host.attach hooks
      // onComplete itself and chains through prior hooks, so cleanup still
      // fires once the run settles.
      const prevOnComplete = animation.onComplete;
      animation.onComplete = () => {
        prevOnComplete?.();
        if (isVisibilityOut) {
          // Original stays mounted — clear the inline positioning we
          // injected and re-hide the element so React's intended hidden
          // state holds. resumeVisibility resyncs the observer so a future
          // React-driven show still triggers the in side.
          fromForAnimation.style.position = "";
          fromForAnimation.style.width = "";
          fromForAnimation.style.top = "";
          fromForAnimation.style.left = "";
          fromForAnimation.style.display = "none";
          resumeVisibility(fromForAnimation);
        } else if (fromForAnimation.parentElement) {
          fromForAnimation.parentElement.removeChild(fromForAnimation);
        }
        for (const extra of createdElements) {
          if (extra.parentElement) extra.parentElement.removeChild(extra);
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
        processedTransitions,
      );

      const outSide = pendingOut;
      const inSide = pendingIn;
      pendingOut = null;
      pendingIn = null;

      if (!config || !outSide || !inSide) return;

      runTransition(config, transformedFrom, transformedTo, outSide, inSide);
    });
  };

  const handleRemoval = (element: HTMLElement, path: string) => {
    const anchor = readAnchor(element);
    pendingOut = {
      element,
      parent: anchor.parent,
      nextSibling: anchor.nextSibling,
    };
    // Read the latest id from the DOM rather than the closure-captured path
    // so a mid-life id change (re-render with a new id prop on the same
    // element) leaves with its current identity, not the one it mounted with.
    const currentPath = element.getAttribute("data-ssgoi-transition") ?? path;
    handleArrival(currentPath, "out");
  };

  /**
   * React Activity / Next.js Cache Components hide a subtree by setting
   * `display: none` on its host element while leaving the DOM intact. Treat
   * that as the exit trigger: pause the observer (so our own restore writes
   * don't bounce back through onHide/onShow), clear the inline display so
   * the element paints during the animation, and stash it as pendingOut
   * with isVisibility set so runTransition skips the clone path.
   */
  const handleHide = (element: HTMLElement, path: string) => {
    pauseVisibility(element);
    element.style.display = "";
    pendingOut = {
      element,
      parent: element.parentElement,
      nextSibling: element.nextElementSibling,
      isVisibility: true,
    };
    const currentPath = element.getAttribute("data-ssgoi-transition") ?? path;
    handleArrival(currentPath, "out");
  };

  /** Counterpart to handleHide — `display: none` was just cleared. */
  const handleShow = (element: HTMLElement, path: string) => {
    pendingIn = {
      element,
      parent: element.parentElement,
      nextSibling: element.nextElementSibling,
      isVisibility: true,
    };
    const currentPath = element.getAttribute("data-ssgoi-transition") ?? path;
    handleArrival(currentPath, "in");
  };

  // Dedupe so the dispatcher tolerates repeat registers for the same node —
  // either from React re-firing a ref or a host that bounces in/out under
  // strict-mode double-mount.
  const registered = new WeakSet<HTMLElement>();

  const register: SsgoiContext["register"] = (path, element) => {
    if (registered.has(element)) return;
    registered.add(element);

    captureAnchor(element);
    initializeContext(element, path);
    pendingIn = {
      element,
      parent: element.parentElement,
      nextSibling: element.nextElementSibling,
    };
    handleArrival(path, "in");

    watchUnmount(element, () => handleRemoval(element, path));
    watchVisibility(element, {
      onHide: () => handleHide(element, path),
      onShow: () => handleShow(element, path),
    });
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
