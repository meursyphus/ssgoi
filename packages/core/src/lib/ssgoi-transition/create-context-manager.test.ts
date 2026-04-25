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
      this.scrollLeft = options.left ?? this.scrollLeft;
      this.scrollTop = options.top ?? this.scrollTop;
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

  it("does not restore scroll on the initial mount", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const page = createFakeElement({
      parentElement: body,
    });

    documentElement.scrollTop = 320;

    manager.initializeContext(page, "/feed");
    manager.activateContext("/feed");
    flushAnimationFrames(5);

    expect(documentElement.scrollTo).not.toHaveBeenCalled();
  });

  it("freezes the outgoing path until the incoming page is activated", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const feedPage = createFakeElement({
      parentElement: body,
    });
    const detailPage = createFakeElement({
      parentElement: body,
    });
    const feedPageAgain = createFakeElement({
      parentElement: body,
    });

    manager.initializeContext(feedPage, "/feed");
    manager.activateContext("/feed");

    documentElement.scrollTop = 480;
    emitWindowScroll();
    expect(manager.getScrollPosition("/feed")).toEqual({
      x: 0,
      y: 480,
    });

    manager.initializeContext(detailPage, "/detail");

    documentElement.scrollTop = 0;
    emitWindowScroll();

    expect(manager.getScrollPosition("/feed")).toEqual({
      x: 0,
      y: 480,
    });

    manager.activateContext("/detail", {
      restoreScroll: true,
    });
    flushAnimationFrames(2);
    expect(documentElement.scrollTop).toBe(0);

    manager.initializeContext(feedPageAgain, "/feed");
    manager.activateContext("/feed", {
      restoreScroll: true,
    });
    flushAnimationFrames(2);

    expect(documentElement.scrollTop).toBe(480);
  });

  it("keeps retrying until the saved target becomes reachable", () => {
    const manager = createContextManager({
      preserveScroll: true,
    });
    const feedPage = createFakeElement({
      parentElement: body,
    });
    const detailPage = createFakeElement({
      parentElement: body,
    });
    const returningFeedPage = createFakeElement({
      parentElement: body,
    });

    manager.initializeContext(feedPage, "/feed");
    manager.activateContext("/feed");

    documentElement.scrollTop = 900;
    emitWindowScroll();

    manager.initializeContext(detailPage, "/detail");
    manager.activateContext("/detail", {
      restoreScroll: true,
    });
    flushAnimationFrames(2);

    documentElement.scrollHeight = 760;
    documentElement.scrollTop = 0;

    manager.initializeContext(returningFeedPage, "/feed");
    manager.activateContext("/feed", {
      restoreScroll: true,
    });

    flushAnimationFrames(10);
    expect(documentElement.scrollTop).toBe(160);

    documentElement.scrollHeight = 2000;
    flushAnimationFrames(1);

    expect(documentElement.scrollTop).toBe(900);
  });
});
