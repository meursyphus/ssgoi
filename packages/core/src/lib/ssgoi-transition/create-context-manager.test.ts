import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createContextManager } from "./create-context-manager";

type FakeElement = HTMLElement & {
  parentElement: HTMLElement | null;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollTo: ReturnType<typeof vi.fn>;
};

type ListenerMap = Map<string, Set<EventListenerOrEventListenerObject>>;

const emitEvent = (listeners: ListenerMap, type: string) => {
  const event = { type } as Event;
  for (const listener of listeners.get(type) ?? []) {
    if (typeof listener === "function") {
      listener(event);
    } else {
      listener.handleEvent(event);
    }
  }
};

const createFakeElement = (
  overrides: Partial<FakeElement> = {},
): FakeElement => {
  const element = {
    parentElement: null,
    clientWidth: 1024,
    clientHeight: 600,
    scrollWidth: 1024,
    scrollHeight: 2000,
    scrollLeft: 0,
    scrollTop: 0,
    scrollTo: vi.fn(function (this: FakeElement, options: ScrollToOptions) {
      // Mirror browser behavior: scroll values clamp to the scrollable extent.
      const maxX = Math.max(0, this.scrollWidth - this.clientWidth);
      const maxY = Math.max(0, this.scrollHeight - this.clientHeight);
      const requestedX = options.left ?? this.scrollLeft;
      const requestedY = options.top ?? this.scrollTop;
      this.scrollLeft = Math.max(0, Math.min(requestedX, maxX));
      this.scrollTop = Math.max(0, Math.min(requestedY, maxY));
    }),
    ...overrides,
  } as unknown as FakeElement;

  return element;
};

describe("createContextManager", () => {
  let now = 0;
  let nextAnimationFrameId = 0;
  let animationFrameQueue = new Map<number, FrameRequestCallback>();
  let windowListeners: ListenerMap;
  let documentElement: FakeElement;
  let body: FakeElement;

  const flushAnimationFrames = (count = 1) => {
    for (let index = 0; index < count; index += 1) {
      const callbacks = [...animationFrameQueue.values()];
      animationFrameQueue = new Map();
      now += 16;

      for (const callback of callbacks) {
        callback(now);
      }
    }
  };

  const emitWindowScroll = () => {
    emitEvent(windowListeners, "scroll");
  };

  beforeEach(() => {
    now = 0;
    nextAnimationFrameId = 0;
    animationFrameQueue = new Map();
    windowListeners = new Map();

    documentElement = createFakeElement({
      clientWidth: 1024,
      clientHeight: 600,
      scrollWidth: 1024,
      scrollHeight: 2000,
    });
    body = createFakeElement();

    vi.spyOn(performance, "now").mockImplementation(() => now);

    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        const id = nextAnimationFrameId;
        nextAnimationFrameId += 1;
        animationFrameQueue.set(id, callback);
        return id;
      }),
    );
    vi.stubGlobal(
      "cancelAnimationFrame",
      vi.fn((id: number) => {
        animationFrameQueue.delete(id);
      }),
    );
    vi.stubGlobal("window", {
      innerWidth: 1024,
      addEventListener: vi.fn(
        (type: string, listener: EventListenerOrEventListenerObject) => {
          if (!windowListeners.has(type)) {
            windowListeners.set(type, new Set());
          }
          windowListeners.get(type)!.add(listener);
        },
      ),
      removeEventListener: vi.fn(
        (type: string, listener: EventListenerOrEventListenerObject) => {
          windowListeners.get(type)?.delete(listener);
        },
      ),
      getComputedStyle: vi.fn(() => ({
        overflow: "visible",
        overflowX: "visible",
        overflowY: "visible",
      })),
    } as unknown as Window);
    vi.stubGlobal("document", {
      body,
      documentElement,
    } as unknown as Document);
    vi.stubGlobal("ResizeObserver", undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("scrolls to top on first visit when preservation is enabled but nothing saved", () => {
    const manager = createContextManager();
    const page = createFakeElement({
      parentElement: body,
    });

    documentElement.scrollTop = 320;

    manager.initializeContext(page, "/feed", true);
    flushAnimationFrames(2);

    expect(documentElement.scrollTop).toBe(0);
  });

  it("scrolls to top by default", () => {
    const manager = createContextManager();
    const page = createFakeElement({
      parentElement: body,
    });

    documentElement.scrollTop = 320;

    manager.initializeContext(page, "/feed");
    flushAnimationFrames(2);

    // Non-preserved path: arrives at top regardless of prior browser scroll.
    expect(documentElement.scrollTop).toBe(0);
  });

  it("suppresses scroll capture during the transition settle window", () => {
    const manager = createContextManager();
    const feedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed", true);

    // Within the settle window, scroll events must not be captured —
    // otherwise an OUT-side router scroll reset could write 0 under /feed.
    documentElement.scrollTop = 0;
    emitWindowScroll();
    expect(manager.getScrollPosition("/feed")).toEqual({ x: 0, y: 0 });

    // After the settle window, captures resume.
    flushAnimationFrames(11);
    documentElement.scrollTop = 480;
    emitWindowScroll();
    expect(manager.getScrollPosition("/feed")).toEqual({ x: 0, y: 480 });
  });

  it("restores a saved scroll position on return navigation", () => {
    const manager = createContextManager();
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed", true);
    flushAnimationFrames(11);

    documentElement.scrollTop = 480;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail", false);
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(0);

    manager.initializeContext(returningFeedPage, "/feed", true);
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(480);
  });

  it("keeps OUT scroll intact while applying reset only to IN", () => {
    const manager = createContextManager();
    const listPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });

    manager.initializeContext(listPage, "/list", true);
    flushAnimationFrames(11);
    documentElement.scrollTop = 640;
    emitWindowScroll();

    // The rule is not known at registration time. Resolving it selects reset
    // for the incoming detail page.
    const applyDetailPolicy = manager.initializeContext(detailPage, "/detail");
    applyDetailPolicy(false);

    // Before IN reset runs, transition preparation can still read the original
    // outgoing position and build the correct absolute-page offset.
    expect(manager.calculateScrollOffset("/list", "/detail", false)).toEqual({
      x: 0,
      y: 640,
    });
    expect(manager.getScrollPosition("/list")).toEqual({ x: 0, y: 640 });

    flushAnimationFrames(1);
    expect(documentElement.scrollTop).toBe(0);
    expect(manager.getScrollPosition("/list")).toEqual({ x: 0, y: 640 });
  });

  it("retries restore until the saved target becomes reachable", () => {
    const manager = createContextManager();
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed", true);
    flushAnimationFrames(11);

    documentElement.scrollTop = 900;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail", false);
    flushAnimationFrames(11);

    // Page hasn't grown enough to reach 900 yet.
    documentElement.scrollHeight = 760;
    documentElement.scrollTop = 0;

    manager.initializeContext(returningFeedPage, "/feed", true);
    flushAnimationFrames(5);
    // Container clamps to maxY=160 until layout grows.
    expect(documentElement.scrollTop).toBe(160);

    documentElement.scrollHeight = 2000;
    flushAnimationFrames(1);
    expect(documentElement.scrollTop).toBe(900);
  });

  it("stops calling scrollTo once the saved target has been reached", () => {
    const manager = createContextManager();
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed", true);
    flushAnimationFrames(11);

    documentElement.scrollTop = 480;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail", false);
    flushAnimationFrames(11);

    documentElement.scrollTop = 0;

    manager.initializeContext(returningFeedPage, "/feed", true);

    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(480);
    const callsAfterReached = documentElement.scrollTo.mock.calls.length;

    flushAnimationFrames(20);
    expect(documentElement.scrollTo.mock.calls.length).toBe(callsAfterReached);
  });

  it("invalidates an older settle when a new init starts", () => {
    const manager = createContextManager();
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed", true);
    // Halfway through /feed's settle window, a new init starts.
    flushAnimationFrames(5);
    manager.initializeContext(detailPage, "/detail", false);

    // Burn enough frames that the OLD settle would have fired by now if it
    // were still alive (5 + 6 = 11). With the generation guard, only the
    // newer settle counts toward unlocking the listener.
    flushAnimationFrames(6);
    documentElement.scrollTop = 999;
    emitWindowScroll();
    // Listener must still be suppressed — newer settle hasn't elapsed.
    expect(manager.getScrollPosition("/detail")).toEqual({ x: 0, y: 0 });

    // After the newer settle window also elapses, captures resume.
    flushAnimationFrames(6);
    documentElement.scrollTop = 320;
    emitWindowScroll();
    expect(manager.getScrollPosition("/detail")).toEqual({ x: 0, y: 320 });
  });

  it("uses the current transition's IN policy for the same path", () => {
    const manager = createContextManager();
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed", true);
    flushAnimationFrames(11);

    documentElement.scrollTop = 480;
    emitWindowScroll();
    // Positions are captured independently from the policy that will be chosen
    // by a later transition.
    expect(manager.getScrollPosition("/feed")).toEqual({ x: 0, y: 480 });

    manager.initializeContext(detailPage, "/detail", false);
    flushAnimationFrames(11);

    documentElement.scrollTop = 0;
    // This transition brings the same /feed path IN with reset semantics.
    manager.initializeContext(returningFeedPage, "/feed", false);
    flushAnimationFrames(2);

    expect(documentElement.scrollTop).toBe(0);
    expect(manager.getScrollPosition("/feed")).toEqual({ x: 0, y: 0 });
  });

  it("lets a late rule decision replace the provisional IN reset", () => {
    const manager = createContextManager();
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed", true);
    flushAnimationFrames(11);
    documentElement.scrollTop = 480;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail", false);
    flushAnimationFrames(11);

    const applyReturnPolicy = manager.initializeContext(
      returningFeedPage,
      "/feed",
    );
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(0);

    // A delayed OUT/IN pair can resolve after the first frame. The rule's
    // decision still wins and uses the snapshot captured at IN registration.
    applyReturnPolicy(true);
    flushAnimationFrames(1);
    expect(documentElement.scrollTop).toBe(480);
  });

  it("shares one rule decision across nested IN boundaries for the same path", () => {
    const manager = createContextManager();
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningOuter = createFakeElement({ parentElement: body });
    const returningInner = createFakeElement({ parentElement: returningOuter });

    manager.initializeContext(feedPage, "/feed", true);
    flushAnimationFrames(11);
    documentElement.scrollTop = 480;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail", false);
    flushAnimationFrames(11);

    const applyOuterPolicy = manager.initializeContext(returningOuter, "/feed");
    manager.initializeContext(returningInner, "/feed");
    applyOuterPolicy(true);
    flushAnimationFrames(2);

    // The nested registration's fallback must not replace the winning outer
    // boundary's restore decision.
    expect(documentElement.scrollTop).toBe(480);
  });

  it("keys scroll off resolvePath so aliased/rewritten routes share one position", () => {
    const manager = createContextManager({
      // Mirror a config `middleware` that aliases a mobile-only route to its
      // canonical id (e.g. `/m-p/[id]` → `/p/[id]`).
      resolvePath: (path) => path.replace(/^\/m-p\//, "/p/"),
    });
    const mobilePost = createFakeElement({ parentElement: body });
    const away = createFakeElement({ parentElement: body });
    const canonicalPost = createFakeElement({ parentElement: body });

    // Scroll the page while on the ALIAS path.
    manager.initializeContext(mobilePost, "/m-p/123", true);
    flushAnimationFrames(11);
    documentElement.scrollTop = 540;
    emitWindowScroll();

    // Stored under the RESOLVED key — visible through either spelling.
    expect(manager.getScrollPosition("/m-p/123")).toEqual({ x: 0, y: 540 });
    expect(manager.getScrollPosition("/p/123")).toEqual({ x: 0, y: 540 });

    // Outgoing offset leaving the alias keeps the prior scroll (no top-snap):
    // the regression was this resolving to 0 because the lookup key missed.
    expect(manager.calculateScrollOffset("/m-p/123", "/external")).toEqual({
      x: 0,
      y: 540,
    });

    // Return via the CANONICAL path — scroll restores from the shared key.
    manager.initializeContext(away, "/external", false);
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(0);

    manager.initializeContext(canonicalPost, "/p/123", true);
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(540);
  });
});
