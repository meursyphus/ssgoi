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

  it("yields to an app-driven scroll during the restore window", () => {
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

    // Return while the page is still short: restore clamps and keeps retrying.
    documentElement.scrollHeight = 760;
    documentElement.scrollTop = 0;
    manager.initializeContext(returningFeedPage, "/feed");
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(160);

    // Content arrives AND the page scrolls itself somewhere deliberate
    // (anchor / useEffect scrollTo). The restore loop must yield, not drag
    // the container back to the saved 900.
    documentElement.scrollHeight = 2000;
    documentElement.scrollTop = 300;
    flushAnimationFrames(1);
    expect(documentElement.scrollTop).toBe(300);

    const callsAfterYield = documentElement.scrollTo.mock.calls.length;
    flushAnimationFrames(10);
    expect(documentElement.scrollTop).toBe(300);
    expect(documentElement.scrollTo.mock.calls.length).toBe(callsAfterYield);
  });

  it("yields to a scroll that lands before the first restore frame", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const page = createFakeElement({ parentElement: body });

    // Previous page's stale position at init time…
    documentElement.scrollTop = 320;
    manager.initializeContext(page, "/feed");
    // …then the entering page scrolls itself during commit (useLayoutEffect
    // timing), BEFORE our first frame runs.
    documentElement.scrollTop = 600;

    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(600);
    expect(documentElement.scrollTo).not.toHaveBeenCalled();
  });

  it("treats a layout clamp as passive, not as an external scroll", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const page = createFakeElement({ parentElement: body });

    // Stale position from the previous page; the new page's shorter layout
    // clamps it down before our first frame. That's the browser, not intent —
    // the fresh page must still arrive at the top.
    documentElement.scrollTop = 480;
    manager.initializeContext(page, "/feed");
    documentElement.scrollHeight = 760;
    documentElement.scrollTop = 160;

    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(0);
  });

  it("re-fights a router top reset even after the target was reached", () => {
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
    flushAnimationFrames(1);
    expect(documentElement.scrollTop).toBe(480);

    // A router-side reset (e.g. afterNavigate) lands AFTER we already
    // restored. A jump to exactly (0,0) is the one movement we re-fight.
    documentElement.scrollTop = 0;
    flushAnimationFrames(1);
    expect(documentElement.scrollTop).toBe(480);

    // Restoration writes are pinned to instant so a page-level
    // `scroll-behavior: smooth` can't turn them into animations.
    const lastCall = documentElement.scrollTo.mock.calls.at(-1)![0];
    expect(lastCall).toMatchObject({ behavior: "instant" });
  });

  it("cancels a live restore loop when a newer navigation initializes", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const feedPage = createFakeElement({ parentElement: body });
    const detailPage = createFakeElement({ parentElement: body });
    const returningFeedPage = createFakeElement({ parentElement: body });
    const nextPage = createFakeElement({ parentElement: body });

    manager.initializeContext(feedPage, "/feed");
    flushAnimationFrames(11);

    documentElement.scrollTop = 900;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail");
    flushAnimationFrames(11);

    // Return to /feed with the page still short: the loop stays alive
    // waiting for layout to grow toward the saved 900.
    documentElement.scrollHeight = 760;
    documentElement.scrollTop = 0;
    manager.initializeContext(returningFeedPage, "/feed");
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(160);

    // Navigate again mid-loop. The old loop must die with its generation —
    // even once 900 becomes reachable, only the new target may be applied.
    const callsBeforeNext = documentElement.scrollTo.mock.calls.length;
    manager.initializeContext(nextPage, "/next");
    documentElement.scrollHeight = 2000;
    flushAnimationFrames(12);

    const staleWrites = documentElement.scrollTo.mock.calls
      .slice(callsBeforeNext)
      .filter(([options]) => (options as ScrollToOptions).top === 900);
    expect(staleWrites).toHaveLength(0);
    expect(documentElement.scrollTop).toBe(0);
  });

  it("keys scroll off resolvePath so aliased/rewritten routes share one position", () => {
    const manager = createContextManager({
      preserveScroll: true,
      // Mirror a config `middleware` that aliases a mobile-only route to its
      // canonical id (e.g. `/m-p/[id]` → `/p/[id]`).
      resolvePath: (path) => path.replace(/^\/m-p\//, "/p/"),
    });
    const mobilePost = createFakeElement({ parentElement: body });
    const away = createFakeElement({ parentElement: body });
    const canonicalPost = createFakeElement({ parentElement: body });

    // Scroll the page while on the ALIAS path.
    manager.initializeContext(mobilePost, "/m-p/123");
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
    manager.initializeContext(away, "/external");
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(0);

    manager.initializeContext(canonicalPost, "/p/123");
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(540);
  });
});
