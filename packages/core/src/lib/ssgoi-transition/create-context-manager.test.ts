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
    const manager = createContextManager({
      preserveScroll: true,
    });
    const page = createFakeElement({
      parentElement: body,
    });

    documentElement.scrollTop = 320;

    manager.initializeContext(page, "/feed");
    flushAnimationFrames(2);

    expect(documentElement.scrollTop).toBe(0);
  });

  it("scrolls to top for non-preserved paths' initial restore", () => {
    const manager = createContextManager({
      preserveScroll: false,
    });
    const page = createFakeElement({
      parentElement: body,
    });

    documentElement.scrollTop = 320;

    manager.initializeContext(page, "/feed");
    flushAnimationFrames(2);

    // Non-preserved path: arrives at top regardless of prior browser scroll.
    expect(documentElement.scrollTop).toBe(0);
  });

  it("shares a saved scroll position across paths with the same key", () => {
    const manager = createContextManager({
      preserveScroll: { key: "profile-tabs" },
    });
    const gridPage = createFakeElement({ parentElement: body });
    const reelsPage = createFakeElement({ parentElement: body });

    manager.initializeContext(gridPage, "/profile");
    flushAnimationFrames(11);

    documentElement.scrollTop = 420;
    emitWindowScroll();

    manager.initializeContext(reelsPage, "/profile/reels");
    flushAnimationFrames(2);

    expect(documentElement.scrollTop).toBe(420);
    expect(manager.getScrollPosition("/profile/reels")).toEqual({
      x: 0,
      y: 420,
    });
    expect(manager.calculateScrollOffset("/profile", "/profile/reels")).toEqual(
      {
        x: 0,
        y: 0,
      },
    );
  });

  it("leaves current scroll alone for shared-key paths without a saved value", () => {
    const manager = createContextManager({
      preserveScroll: { key: "profile-tabs" },
    });
    const page = createFakeElement({ parentElement: body });

    documentElement.scrollTop = 320;

    manager.initializeContext(page, "/profile");
    flushAnimationFrames(2);

    expect(documentElement.scrollTop).toBe(320);
  });

  it("suppresses scroll capture during the transition settle window", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const feedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed");

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
    const manager = createContextManager({
      preserveScroll: true,
    });
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed");
    flushAnimationFrames(11);

    documentElement.scrollTop = 480;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail");
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(0);

    manager.initializeContext(returningFeedPage, "/feed");
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(480);
  });

  it("retries restore until the saved target becomes reachable", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed");
    flushAnimationFrames(11);

    documentElement.scrollTop = 900;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail");
    flushAnimationFrames(11);

    // Page hasn't grown enough to reach 900 yet.
    documentElement.scrollHeight = 760;
    documentElement.scrollTop = 0;

    manager.initializeContext(returningFeedPage, "/feed");
    flushAnimationFrames(5);
    // Container clamps to maxY=160 until layout grows.
    expect(documentElement.scrollTop).toBe(160);

    documentElement.scrollHeight = 2000;
    flushAnimationFrames(1);
    expect(documentElement.scrollTop).toBe(900);
  });

  it("stops calling scrollTo once the saved target has been reached", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed");
    flushAnimationFrames(11);

    documentElement.scrollTop = 480;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail");
    flushAnimationFrames(11);

    documentElement.scrollTop = 0;

    manager.initializeContext(returningFeedPage, "/feed");

    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(480);
    const callsAfterReached = documentElement.scrollTo.mock.calls.length;

    flushAnimationFrames(20);
    expect(documentElement.scrollTo.mock.calls.length).toBe(callsAfterReached);
  });

  it("invalidates an older settle when a new init starts", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed");
    // Halfway through /feed's settle window, a new init starts.
    flushAnimationFrames(5);
    manager.initializeContext(detailPage, "/detail");

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

  it("excludes paths matched by preserveScroll.exclude", () => {
    const manager = createContextManager({
      preserveScroll: { exclude: ["/feed"] },
    });
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed");
    flushAnimationFrames(11);

    documentElement.scrollTop = 480;
    emitWindowScroll();
    // /feed IS captured (listener doesn't gate by shouldPreserve), but the
    // restore on return ignores it because /feed is excluded.
    expect(manager.getScrollPosition("/feed")).toEqual({ x: 0, y: 480 });

    manager.initializeContext(detailPage, "/detail");
    flushAnimationFrames(11);

    documentElement.scrollTop = 0;
    manager.initializeContext(returningFeedPage, "/feed");
    flushAnimationFrames(2);

    expect(documentElement.scrollTop).toBe(0);
  });

  it("evicts the least-recently-scrolled path beyond the LRU cap", () => {
    const manager = createContextManager({ preserveScroll: true });

    // 51 distinct paths each capture one scroll — one over the cap of 50.
    for (let i = 0; i <= 50; i++) {
      const page = createFakeElement({ parentElement: body });
      manager.initializeContext(page, `/page-${i}`);
      flushAnimationFrames(11);
      documentElement.scrollTop = 100 + i;
      emitWindowScroll();
    }

    expect(manager.getScrollPosition("/page-0")).toEqual({ x: 0, y: 0 });
    expect(manager.getScrollPosition("/page-1")).toEqual({ x: 0, y: 101 });
    expect(manager.getScrollPosition("/page-50")).toEqual({ x: 0, y: 150 });
  });

  it("refreshes recency on re-scroll so active paths survive eviction", () => {
    const manager = createContextManager({ preserveScroll: true });

    // Fill exactly to the cap.
    for (let i = 0; i < 50; i++) {
      const page = createFakeElement({ parentElement: body });
      manager.initializeContext(page, `/page-${i}`);
      flushAnimationFrames(11);
      documentElement.scrollTop = 100 + i;
      emitWindowScroll();
    }

    // Revisit the oldest path — its entry moves to the recent end.
    const revisited = createFakeElement({ parentElement: body });
    manager.initializeContext(revisited, "/page-0");
    flushAnimationFrames(11);
    documentElement.scrollTop = 300;
    emitWindowScroll();

    // One more path pushes the map over the cap: /page-1 is now the oldest.
    const fresh = createFakeElement({ parentElement: body });
    manager.initializeContext(fresh, "/page-new");
    flushAnimationFrames(11);
    documentElement.scrollTop = 555;
    emitWindowScroll();

    expect(manager.getScrollPosition("/page-0")).toEqual({ x: 0, y: 300 });
    expect(manager.getScrollPosition("/page-1")).toEqual({ x: 0, y: 0 });
    expect(manager.getScrollPosition("/page-2")).toEqual({ x: 0, y: 102 });
    expect(manager.getScrollPosition("/page-new")).toEqual({ x: 0, y: 555 });
  });

  it("never evicts a shared scroll entry for per-path churn", () => {
    // Excluded paths still capture under path:<path> keys but are only
    // cleaned up when a transition runs — heavy churn on them must not push
    // the long-lived shared:<key> singleton out of the cap.
    const manager = createContextManager({
      preserveScroll: { key: "tabs", exclude: ["/detail/*"] },
    });

    const home = createFakeElement({ parentElement: body });
    manager.initializeContext(home, "/home");
    flushAnimationFrames(11);
    documentElement.scrollTop = 400;
    emitWindowScroll();

    for (let i = 0; i <= 55; i++) {
      const page = createFakeElement({ parentElement: body });
      manager.initializeContext(page, `/detail/${i}`);
      flushAnimationFrames(11);
      documentElement.scrollTop = 100 + i;
      emitWindowScroll();
    }

    // The shared entry survived; old per-path entries were evicted instead.
    expect(manager.getScrollPosition("/home")).toEqual({ x: 0, y: 400 });
    expect(manager.getScrollPosition("/detail/0")).toEqual({ x: 0, y: 0 });
  });

  it("destroy() detaches scroll tracking and a later init re-attaches", () => {
    const manager = createContextManager({ preserveScroll: true });
    const page = createFakeElement({ parentElement: body });

    manager.initializeContext(page, "/feed");
    flushAnimationFrames(11);
    documentElement.scrollTop = 100;
    emitWindowScroll();
    expect(manager.getScrollPosition("/feed")).toEqual({ x: 0, y: 100 });

    manager.destroy();
    documentElement.scrollTop = 200;
    emitWindowScroll();
    // Listener detached — the scroll after destroy is not captured.
    expect(manager.getScrollPosition("/feed")).toEqual({ x: 0, y: 100 });

    const remounted = createFakeElement({ parentElement: body });
    manager.initializeContext(remounted, "/feed");
    flushAnimationFrames(11);
    documentElement.scrollTop = 300;
    emitWindowScroll();
    expect(manager.getScrollPosition("/feed")).toEqual({ x: 0, y: 300 });
  });
});
