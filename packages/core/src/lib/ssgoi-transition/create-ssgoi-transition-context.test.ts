import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
  vi.stubGlobal("getComputedStyle", () => ({ display: "block" }));
});

afterEach(() => {
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
