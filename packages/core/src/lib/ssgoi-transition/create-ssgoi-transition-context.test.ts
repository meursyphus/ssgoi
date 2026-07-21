import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Animation } from "../animation/animation";
import type { HostAnimation } from "../animation/host-animation";
import { createSggoiTransitionContext } from "./create-ssgoi-transition-context";

type RemovalAnchor = { parent: Node; nextSibling: Node | null };

const testState = vi.hoisted(() => ({
  unmountCallbacks: new Map<
    object,
    (anchor?: { parent: Node; nextSibling: Node | null }) => void
  >(),
  positionedParent: null as Node | null,
  scrollingElement: null as HTMLElement | null,
}));

vi.mock("./create-context-manager", () => ({
  createContextManager: () => ({
    initializeContext: vi.fn(),
    calculateScrollOffset: (from?: string, to?: string) => ({
      x: 0,
      y: (from === "/feed" ? 3600 : 0) - (to === "/feed" ? 3600 : 0),
    }),
    evictScrollPosition: vi.fn(),
    shouldPreserve: () => true,
    getScrollContainer: () => testState.scrollingElement,
    getPositionedParentElement: () => testState.positionedParent,
    getScrollPosition: (path?: string) => ({
      x: 0,
      y: path === "/feed" ? 3600 : 0,
    }),
    getIsMobile: () => true,
  }),
}));

vi.mock("./create-swipe-back-detector", () => ({
  createSwipeBackDetector: () => ({
    initialize: vi.fn(),
    destroy: vi.fn(),
    isSwipeBack: () => false,
    onPageEnter: vi.fn(),
  }),
}));

vi.mock("./unmount-observer", () => ({
  watchUnmount: (
    element: object,
    callback: (anchor?: RemovalAnchor) => void,
  ) => {
    testState.unmountCallbacks.set(element, callback);
    return () => testState.unmountCallbacks.delete(element);
  },
}));

vi.mock("./visibility-observer", () => ({
  watchVisibility: () => ({
    isHidden: false,
    setDisplay: vi.fn(),
    sync: vi.fn(),
    stop: vi.fn(),
  }),
}));

class FakeStyle {
  cssText = "";
  display = "";
  left = "";
  opacity = "";
  position = "";
  top = "";
  width = "";

  getPropertyPriority(): string {
    return "";
  }

  getPropertyValue(name: string): string {
    return (this as unknown as Record<string, string>)[name] ?? "";
  }

  removeProperty(name: string): string {
    const values = this as unknown as Record<string, string>;
    const previous = values[name] ?? "";
    values[name] = "";
    return previous;
  }

  setProperty(name: string, value: string): void {
    (this as unknown as Record<string, string>)[name] = value;
  }
}

class FakeElement {
  readonly attributes = new Map<string, string>();
  readonly style = new FakeStyle() as unknown as CSSStyleDeclaration;
  parentNode: FakeParent | null = null;
  nextSibling: FakeElement | null = null;

  get parentElement(): HTMLElement | null {
    return this.parentNode as unknown as HTMLElement | null;
  }

  get nextElementSibling(): HTMLElement | null {
    return this.nextSibling as unknown as HTMLElement | null;
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
}

class FakeParent {
  readonly children: FakeElement[] = [];
  trackedOutgoing: FakeElement | null = null;
  readonly order: string[] = [];

  appendChild(element: FakeElement): FakeElement {
    this.detach(element);
    this.children.push(element);
    this.syncLinks();
    if (element === this.trackedOutgoing) this.order.push("insert");
    return element;
  }

  contains(node: Node | null): boolean {
    return this.children.includes(node as unknown as FakeElement);
  }

  insertBefore(element: FakeElement, sibling: Node): FakeElement {
    this.detach(element);
    const index = this.children.indexOf(sibling as unknown as FakeElement);
    this.children.splice(index < 0 ? this.children.length : index, 0, element);
    this.syncLinks();
    if (element === this.trackedOutgoing) this.order.push("insert");
    return element;
  }

  removeChild(element: FakeElement): FakeElement {
    this.detach(element);
    this.syncLinks();
    return element;
  }

  private detach(element: FakeElement): void {
    const index = this.children.indexOf(element);
    if (index >= 0) this.children.splice(index, 1);
    element.parentNode = null;
    element.nextSibling = null;
  }

  private syncLinks(): void {
    for (let index = 0; index < this.children.length; index += 1) {
      const element = this.children[index]!;
      element.parentNode = this;
      element.nextSibling = this.children[index + 1] ?? null;
    }
  }
}

async function flushMicrotasks(count = 12): Promise<void> {
  for (let index = 0; index < count; index += 1) {
    await Promise.resolve();
  }
}

describe("createSggoiTransitionContext", () => {
  beforeEach(() => {
    testState.unmountCallbacks.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reinserts the styled outgoing page without waiting for async prepare extras", async () => {
    const parent = new FakeParent();
    const scrollingElement = new FakeElement();
    const outgoing = new FakeElement();
    const incoming = new FakeElement();
    parent.appendChild(outgoing);
    parent.trackedOutgoing = outgoing;
    testState.positionedParent = parent as unknown as Node;
    testState.scrollingElement = scrollingElement as unknown as HTMLElement;

    vi.stubGlobal("document", {
      body: parent,
      documentElement: scrollingElement,
      createElement: () => new FakeElement(),
    });
    vi.stubGlobal("getComputedStyle", () => ({ display: "block" }));

    let resolveExtras!: (value: object) => void;
    const extras = new Promise<object>((resolve) => {
      resolveExtras = resolve;
    });
    const animation = {} as Animation;
    const animationFactory = vi.fn(() => animation);
    const host = { attach: vi.fn() } as unknown as HostAnimation;

    const context = createSggoiTransitionContext(
      {
        preserveScroll: true,
        transitions: [
          {
            from: "/feed",
            to: "/detail",
            transition: {
              prepare: ({ from }) => {
                from.then((element) => {
                  element.style.opacity = "1";
                  parent.order.push("style");
                });
                return extras;
              },
              animation: animationFactory,
            },
          },
        ],
      },
      { host },
    );

    context.register("/feed", outgoing as unknown as HTMLElement);

    // Mirror a framework route commit: replace the tall, scrolled feed with
    // the not-yet-laid-out detail page, register IN, then deliver OUT from the
    // shared MutationObserver.
    parent.removeChild(outgoing);
    parent.appendChild(incoming);
    context.register("/detail", incoming as unknown as HTMLElement);
    testState.unmountCallbacks.get(outgoing)?.({
      parent: parent as unknown as Node,
      nextSibling: null,
    });

    await flushMicrotasks();

    expect(parent.order).toEqual(["style", "insert"]);
    expect(parent.children).toContain(outgoing);
    expect(outgoing.style.position).toBe("absolute");
    expect(outgoing.style.top).toBe("-3600px");
    expect(animationFactory).not.toHaveBeenCalled();
    expect(host.attach).not.toHaveBeenCalled();

    resolveExtras({});
    await flushMicrotasks();

    expect(animationFactory).toHaveBeenCalledOnce();
    expect(host.attach).toHaveBeenCalledWith(animation);
  });
});
