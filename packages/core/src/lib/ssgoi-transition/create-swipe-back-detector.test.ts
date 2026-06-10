import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSwipeBackDetector } from "./create-swipe-back-detector";

type Handler = (event: TouchEvent) => void;

const makeTouch = (identifier: number, clientX: number, clientY: number) => ({
  identifier,
  clientX,
  clientY,
});

const touchList = (touches: ReturnType<typeof makeTouch>[]) => ({
  length: touches.length,
  item: (i: number) => touches[i] ?? null,
});

describe("createSwipeBackDetector", () => {
  let handlers: Map<string, Set<Handler>>;

  const fire = (type: string, event: object) => {
    for (const handler of handlers.get(type) ?? []) {
      handler(event as TouchEvent);
    }
  };

  const swipeFromLeftEdge = () => {
    fire("touchstart", { touches: touchList([makeTouch(1, 10, 300)]) });
    fire("touchmove", { touches: touchList([makeTouch(1, 40, 302)]) });
    fire("touchend", { changedTouches: touchList([makeTouch(1, 70, 300)]) });
  };

  beforeEach(() => {
    vi.useFakeTimers();
    handlers = new Map();
    vi.stubGlobal("window", {
      innerWidth: 400,
      addEventListener: (type: string, handler: Handler) => {
        if (!handlers.has(type)) handlers.set(type, new Set());
        handlers.get(type)!.add(handler);
      },
      removeEventListener: (type: string, handler: Handler) => {
        handlers.get(type)?.delete(handler);
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("initialize is idempotent and destroy removes every listener", () => {
    const detector = createSwipeBackDetector();
    detector.initialize();
    detector.initialize();

    const types = ["touchstart", "touchmove", "touchend", "touchcancel"];
    for (const type of types) {
      expect(handlers.get(type)?.size).toBe(1);
    }

    detector.destroy();
    for (const type of types) {
      expect(handlers.get(type)?.size).toBe(0);
    }
  });

  it("re-arms after destroy (provider remount cycle)", () => {
    const detector = createSwipeBackDetector();
    detector.initialize();
    detector.destroy();
    detector.initialize();

    expect(handlers.get("touchstart")?.size).toBe(1);
    swipeFromLeftEdge();
    expect(detector.isSwipeBack()).toBe(true);
  });

  it("detects an edge swipe and clears after onPageEnter", () => {
    const detector = createSwipeBackDetector();
    detector.initialize();

    expect(detector.isSwipeBack()).toBe(false);
    swipeFromLeftEdge();
    expect(detector.isSwipeBack()).toBe(true);

    detector.onPageEnter();
    // stickyActive lives one extra macrotask so an OUT/IN pair queued
    // together reads the same value.
    expect(detector.isSwipeBack()).toBe(true);
    vi.advanceTimersByTime(0);
    expect(detector.isSwipeBack()).toBe(false);
  });

  it("ignores center-screen and vertical gestures", () => {
    const detector = createSwipeBackDetector();
    detector.initialize();

    // Start away from both edges.
    fire("touchstart", { touches: touchList([makeTouch(1, 200, 300)]) });
    fire("touchend", { changedTouches: touchList([makeTouch(1, 260, 300)]) });
    expect(detector.isSwipeBack()).toBe(false);

    // Edge start, but vertically dominant movement (scrolling).
    fire("touchstart", { touches: touchList([makeTouch(2, 10, 300)]) });
    fire("touchmove", { touches: touchList([makeTouch(2, 14, 400)]) });
    fire("touchend", { changedTouches: touchList([makeTouch(2, 50, 500)]) });
    expect(detector.isSwipeBack()).toBe(false);
  });

  it("destroy clears a pending swipe flag", () => {
    const detector = createSwipeBackDetector();
    detector.initialize();
    swipeFromLeftEdge();
    detector.destroy();
    expect(detector.isSwipeBack()).toBe(false);
  });
});
