import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Animation } from "../animation/animation";
import { MultiAnimation } from "../animation/multi-animation";
import type { AnyTransitionConfig, PrepareArgs } from "@types";
import { HostAnimation } from "../animation/host-animation";

const lifecycle = vi.hoisted(() => ({ active: 0, options: [] as boolean[] }));

type VisibilityHandlers = { onHide: () => void; onShow: () => void };

const activity = vi.hoisted(() => ({
  handlers: new WeakMap<object, VisibilityHandlers>(),
}));

vi.mock("./visibility-observer", () => ({
  watchVisibility: (element: FakeElement, handlers: VisibilityHandlers) => {
    activity.handlers.set(element, handlers);
    return {
      get isHidden() {
        return (
          element.style.getPropertyValue("display") === "none" &&
          element.style.getPropertyPriority("display") === "important"
        );
      },
      setDisplay(value: string | null, important = false) {
        if (value === null) element.style.removeProperty("display");
        else {
          element.style.setProperty(
            "display",
            value,
            important ? "important" : "",
          );
        }
      },
      sync() {},
      stop() {},
    };
  },
}));

vi.mock("./create-context-manager", () => ({
  createContextManager: () => ({
    initializeContext: () => () => {},
    beginTransition: (enabled: boolean) => {
      lifecycle.active++;
      lifecycle.options.push(enabled);
      let released = false;
      return () => {
        if (!released) lifecycle.active--;
        released = true;
      };
    },
    disconnect: () => {},
    calculateScrollOffset: () => ({ x: 0, y: 0 }),
    evictScrollPosition: () => {},
    getScrollContainer: () => null,
    getPositionedParentElement: () => null,
    getScrollPosition: () => ({ x: 0, y: 0 }),
    getIsMobile: () => false,
  }),
}));

vi.mock("./unmount-observer", () => ({
  watchUnmount: () => () => {},
}));

import { createSggoiTransitionContext } from "./create-ssgoi-transition-context";

class FakeStyle {
  private values = new Map<string, { value: string; priority: string }>();

  get cssText(): string {
    return JSON.stringify(Array.from(this.values));
  }

  set cssText(value: string) {
    this.values = new Map(JSON.parse(value));
  }

  getPropertyValue(name: string): string {
    return this.values.get(name)?.value ?? "";
  }

  getPropertyPriority(name: string): string {
    return this.values.get(name)?.priority ?? "";
  }

  setProperty(name: string, value: string, priority = ""): void {
    if (!value) {
      this.values.delete(name);
      return;
    }
    this.values.set(name, {
      value,
      priority: priority === "important" ? "important" : "",
    });
  }

  removeProperty(name: string): void {
    this.values.delete(name);
  }

  get position(): string {
    return this.getPropertyValue("position");
  }
  set position(value: string) {
    this.setProperty("position", value);
  }

  get width(): string {
    return this.getPropertyValue("width");
  }
  set width(value: string) {
    this.setProperty("width", value);
  }

  get left(): string {
    return this.getPropertyValue("left");
  }
  set left(value: string) {
    this.setProperty("left", value);
  }
}

class FakeElement {
  readonly style = new FakeStyle();
  parentNode: FakeElement | null = null;
  parentElement: FakeElement | null = null;
  nextSibling: FakeElement | null = null;
  nextElementSibling: FakeElement | null = null;
  private attributes = new Map<string, string>();

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  contains(element: FakeElement): boolean {
    return element === this;
  }
}

function reactHide(element: FakeElement): void {
  element.style.setProperty("display", "none", "important");
  activity.handlers.get(element)?.onHide();
}

function reactShow(element: FakeElement): void {
  element.style.removeProperty("display");
  activity.handlers.get(element)?.onShow();
}

beforeEach(() => {
  lifecycle.active = 0;
  lifecycle.options = [];
  vi.stubGlobal("getComputedStyle", () => ({ display: "block" }));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("createSggoiTransitionContext Activity cleanup", () => {
  it("restores React visibility when no transition rule matches", async () => {
    const pageA = new FakeElement();
    const pageB = new FakeElement();
    pageA.setAttribute("data-ssgoi-transition", "/a");
    pageB.setAttribute("data-ssgoi-transition", "/b");
    pageB.style.setProperty("display", "none", "important");

    const context = createSggoiTransitionContext({ transitions: [] });
    context.register("/a", pageA as unknown as HTMLElement);
    context.register("/b", pageB as unknown as HTMLElement);

    // Activity hides A first. SSGOI reveals and takes it out of flow for OUT,
    // even though route matching has not established an animation rule yet.
    reactHide(pageA);
    expect(pageA.style.getPropertyValue("display")).toBe("block");
    expect(pageA.style.getPropertyPriority("display")).toBe("important");
    expect(pageA.style.position).toBe("absolute");

    reactShow(pageB);
    await Promise.resolve();

    // An unmatched pair must settle that temporary reveal back to React's
    // intent instead of leaving both Activity pages visible and out of flow.
    expect(pageA.style.getPropertyValue("display")).toBe("none");
    expect(pageA.style.getPropertyPriority("display")).toBe("important");
    expect(pageA.style.position).toBe("");
    expect(pageA.style.width).toBe("");
    expect(pageA.style.left).toBe("");
    expect(pageB.style.getPropertyValue("display")).toBe("");
  });

  it("keeps the outgoing route when usePathname updates a visible boundary", async () => {
    const pageA = new FakeElement();
    const pageB = new FakeElement();
    pageA.setAttribute("data-ssgoi-transition", "/a");
    pageB.setAttribute("data-ssgoi-transition", "/b");
    pageB.style.setProperty("display", "none", "important");

    const middleware = vi.fn((from: string, to: string) => ({ from, to }));
    const context = createSggoiTransitionContext({
      transitions: [],
      middleware,
    });
    context.register("/a", pageA as unknown as HTMLElement);
    context.register("/b", pageB as unknown as HTMLElement);

    // Seed a completed A -> B Activity navigation.
    reactHide(pageA);
    reactShow(pageB);
    await Promise.resolve();
    middleware.mockClear();

    // Hidden boundaries can also re-render with the global pathname. Returning
    // to A updates both attributes before React's hide/show mutations arrive.
    pageA.setAttribute("data-ssgoi-transition", "/b");
    context.register("/b", pageA as unknown as HTMLElement);
    pageA.setAttribute("data-ssgoi-transition", "/a");
    context.register("/a", pageA as unknown as HTMLElement);
    pageB.setAttribute("data-ssgoi-transition", "/a");
    context.register("/a", pageB as unknown as HTMLElement);

    reactHide(pageB);
    reactShow(pageA);
    await Promise.resolve();

    // The visible page was still /b when this commit began. Reading its new
    // DOM attribute at hide time would incorrectly produce /a -> /a and the
    // navigation detector would discard the transition as a duplicate.
    expect(middleware).toHaveBeenCalledOnce();
    expect(middleware).toHaveBeenCalledWith("/b", "/a");
    expect(pageB.style.getPropertyValue("display")).toBe("none");
    expect(pageB.style.getPropertyPriority("display")).toBe("important");
    expect(pageA.style.getPropertyValue("display")).toBe("");
  });
});

/** Opaque driver outside the disposal contract: only reports completion. */
class FakeAnimation extends Animation {
  private done = false;
  constructor(private readonly instant = false) {
    super();
  }
  play(): void {
    if (this.instant) this.complete();
  }
  pause(): void {}
  reverse(): void {}
  complete(): void {
    this.done = true;
    this.onComplete?.();
  }
  getPose() {
    return [];
  }
  getTimeline() {
    return [];
  }
  matchInto(): void {}
  get isAnimating() {
    return false;
  }
  get isPaused() {
    return false;
  }
  get isComplete() {
    return this.done;
  }
  get isReversing() {
    return false;
  }
  get progress() {
    return 0;
  }
  findTimeForProgress() {
    return null;
  }
}

function animation(instant = false): Animation {
  return new FakeAnimation(instant);
}

async function flushPromises() {
  for (let i = 0; i < 30; i++) await Promise.resolve();
}

function activityPages() {
  const pages = ["/a", "/b", "/c"].map((path, i) => {
    const page = new FakeElement();
    page.setAttribute("data-ssgoi-transition", path);
    if (i) page.style.setProperty("display", "none", "important");
    return page;
  });
  return pages as [FakeElement, FakeElement, FakeElement];
}

function navigation(transition: AnyTransitionConfig, scrollLock?: boolean) {
  const pages = activityPages();
  const host = new HostAnimation();
  const context = createSggoiTransitionContext(
    { transitions: [{ on: "/**", transition }], scrollLock },
    { host },
  );
  pages.forEach((page, i) =>
    context.register(["/a", "/b", "/c"][i]!, page as unknown as HTMLElement),
  );
  const go = (from: number, to: number) => {
    reactHide(pages[from]!);
    reactShow(pages[to]!);
  };
  return { pages, context, host, go };
}

describe("transition scroll lifetime", () => {
  it("holds through preparation and paused playback; hands off without unlocking", async () => {
    const runs: Animation[] = [];
    const state = navigation({
      animation: () => {
        const run = animation();
        runs.push(run);
        return run;
      },
    });
    state.host.pause();
    state.go(0, 1);
    await flushPromises();
    expect(lifecycle.active).toBe(1);
    expect(lifecycle.options).toEqual([true]);
    state.go(1, 2);
    await flushPromises();
    expect(runs).toHaveLength(2);
    expect(lifecycle.active).toBe(1);
    state.host.complete();
    expect(lifecycle.active).toBe(0);
    expect(state.pages[1]!.style.getPropertyValue("display")).toBe("none");
    state.context.disconnect?.();
  });

  it.each(["throw", "reject", "animation"])(
    "releases and reconciles pages after %s failure",
    async (failure) => {
      const error = new Error("test failure");
      const report = vi.spyOn(console, "error").mockImplementation(() => {});
      const state = navigation({
        prepare: () => {
          if (failure === "throw") throw error;
          if (failure === "reject") return Promise.reject(error);
          return {};
        },
        animation: () => {
          throw error;
        },
      });
      state.go(0, 1);
      await flushPromises();
      expect(lifecycle.active).toBe(0);
      expect(state.pages[0]!.style.position).toBe("");
      expect(state.pages[0]!.style.getPropertyValue("display")).toBe("none");
      expect(report).toHaveBeenCalledWith(
        "[SSGOI] Page transition failed",
        error,
      );
      state.context.disconnect?.();
      report.mockRestore();
    },
  );

  it("discards a superseded async preparation without unlocking the new run", async () => {
    let resolve!: (value: object) => void;
    const oldPrepare = new Promise<object>((done) => {
      resolve = done;
    });
    let count = 0;
    const factory = vi.fn(() => animation());
    const state = navigation({
      prepare: () => (++count === 1 ? oldPrepare : {}),
      animation: factory,
    });
    state.go(0, 1);
    await flushPromises();
    state.go(1, 2);
    await flushPromises();
    expect(lifecycle.active).toBe(1);
    resolve({});
    await flushPromises();
    expect(factory).toHaveBeenCalledTimes(1);
    state.context.disconnect?.();
    expect(lifecycle.active).toBe(0);
  });

  it("disconnects during async preparation and ignores its late result", async () => {
    let resolve!: (value: object) => void;
    const factory = vi.fn(() => animation());
    const state = navigation({
      prepare: () =>
        new Promise<object>((done) => {
          resolve = done;
        }),
      animation: factory,
    });
    state.go(0, 1);
    await flushPromises();
    expect(lifecycle.active).toBe(1);
    state.context.disconnect?.();
    expect(lifecycle.active).toBe(0);
    resolve({});
    await flushPromises();
    expect(factory).not.toHaveBeenCalled();
  });

  it("bounds abandoned preparation without timing out paused playback", async () => {
    vi.useFakeTimers();
    const report = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = navigation({
      prepare: () => new Promise(() => {}),
      animation: () => animation(),
    });
    state.go(0, 1);
    await flushPromises();
    expect(lifecycle.active).toBe(1);
    await vi.advanceTimersByTimeAsync(5000);
    expect(lifecycle.active).toBe(0);
    expect(report).toHaveBeenCalledOnce();
    state.context.disconnect?.();
    report.mockRestore();

    const paused = navigation({ animation: () => animation() });
    paused.host.pause();
    paused.go(0, 1);
    await flushPromises();
    await vi.advanceTimersByTimeAsync(10000);
    expect(lifecycle.active).toBe(1);
    paused.context.disconnect?.();
    expect(lifecycle.active).toBe(0);
  });

  it("releases on synchronous completion and supports opting out", async () => {
    const state = navigation({ animation: () => animation(true) }, false);
    state.go(0, 1);
    await flushPromises();
    expect(lifecycle.options).toEqual([false]);
    expect(lifecycle.active).toBe(0);
    state.context.disconnect?.();
  });

  it("releases even when the user's completion hook throws", async () => {
    const run = animation();
    run.onComplete = () => {
      throw new Error("completion");
    };
    const state = navigation({ animation: () => run });
    state.go(0, 1);
    await flushPromises();
    expect(() => state.host.complete()).toThrow("completion");
    expect(lifecycle.active).toBe(0);
    run.onComplete = undefined;
    state.context.disconnect?.();
  });
});

describe("preparation ownership", () => {
  it("aborts stale preparation and never lets a late result replace the latest navigation", async () => {
    const [a, b, c] = activityPages();
    let resolveFirst!: (value: object) => void;
    const first = new Promise<object>((resolve) => {
      resolveFirst = resolve;
    });
    const cleanup = vi.fn(),
      signals: AbortSignal[] = [];
    let count = 0;
    const prepare = vi.fn((args: PrepareArgs) => {
      signals.push(args.signal!);
      if (count++ === 0) {
        args.onCleanup?.(cleanup);
        return first;
      }
      return {};
    });
    const animation = vi.fn(() => new MultiAnimation([]));
    const context = createSggoiTransitionContext({
      transitions: [{ on: "/**", transition: { prepare, animation } }],
    });
    for (const page of [a, b, c])
      context.register(
        page.getAttribute("data-ssgoi-transition")!,
        page as unknown as HTMLElement,
        { enter: false },
      );
    reactHide(a);
    reactShow(b);
    await flushPromises();
    expect(prepare).toHaveBeenCalledOnce();
    reactHide(b);
    reactShow(c);
    await flushPromises();
    expect(signals[0]?.aborted).toBe(true);
    expect(cleanup).toHaveBeenCalledOnce();
    expect(animation).toHaveBeenCalledOnce();
    resolveFirst({});
    await flushPromises();
    expect(animation).toHaveBeenCalledOnce();
    expect(a.style.getPropertyValue("display")).toBe("none");
    expect(b.style.getPropertyValue("display")).toBe("none");
    expect(c.style.getPropertyValue("display")).not.toBe("none");
    context.disconnect?.();
  });
  it("releases rejected and disconnected preparations without an unhandled rejection", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const [a, b] = activityPages();
    const cleanup = vi.fn();
    const context = createSggoiTransitionContext({
      transitions: [
        {
          on: "/**",
          transition: {
            prepare(args) {
              args.onCleanup?.(cleanup);
              return Promise.reject(new Error("load failed"));
            },
            animation: () => new MultiAnimation([]),
          },
        },
      ],
    });
    context.register("/a", a as unknown as HTMLElement, { enter: false });
    context.register("/b", b as unknown as HTMLElement, { enter: false });
    reactHide(a);
    reactShow(b);
    await flushPromises();
    expect(cleanup).toHaveBeenCalledOnce();
    expect(a.style.getPropertyValue("display")).toBe("none");
    expect(b.style.getPropertyValue("display")).not.toBe("none");
    expect(error).toHaveBeenCalledOnce();
    context.disconnect?.();
    error.mockRestore();
  });
});
