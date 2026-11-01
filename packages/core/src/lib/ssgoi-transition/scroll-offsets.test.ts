// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { Animation } from "../animation/animation";
import { HostAnimation } from "../animation/host-animation";
import { restoreScrollOffsets, trackScrollOffsets } from "./scroll-offsets";

/**
 * jsdom has no layout, so scrollers are modelled the way a browser treats
 * them. The offset lives on the layout box: reads return 0 and writes are
 * dropped while the node is not rendered (detached, or under `display:none`),
 * and the box, offset included, is lost when the node leaves the document
 * (`loseBox`, called where React moves or detaches a page).
 */
type Scroller = HTMLDivElement & { loseBox(): void };

function scroller(): Scroller {
  const el = document.createElement("div");
  const box = { left: 0, top: 0 };
  const rendered = () => {
    if (!el.isConnected) return false;
    for (let node: HTMLElement | null = el; node; node = node.parentElement)
      if (node.style.display === "none") return false;
    return true;
  };
  for (const [prop, key] of [
    ["scrollLeft", "left"],
    ["scrollTop", "top"],
  ] as const) {
    Object.defineProperty(el, prop, {
      configurable: true,
      get: () => (rendered() ? box[key] : 0),
      set: (value: number) => {
        if (rendered()) box[key] = value;
      },
    });
  }
  return Object.assign(el, {
    loseBox() {
      box.left = 0;
      box.top = 0;
    },
  });
}

/** The user scrolls: the offset changes, then `scroll` fires (no bubbling). */
function userScroll(el: Element, left: number, top = 0) {
  el.scrollLeft = left;
  el.scrollTop = top;
  el.dispatchEvent(new Event("scroll"));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("restoreScrollOffsets", () => {
  it("restores a descendant scroller that lost its box", () => {
    const root = document.createElement("div");
    const list = scroller();
    const pane = scroller();
    root.append(list, pane);
    document.body.appendChild(root);
    trackScrollOffsets(root);
    userScroll(list, 600);
    userScroll(pane, 0, 240);

    root.remove();
    list.loseBox();
    pane.loseBox();
    document.body.appendChild(root);
    expect(list.scrollLeft).toBe(0);

    restoreScrollOffsets(root);
    expect(list.scrollLeft).toBe(600);
    expect(pane.scrollTop).toBe(240);
  });

  it("forgets a scroller the user brought back to its start", () => {
    const root = document.createElement("div");
    const list = scroller();
    root.append(list);
    document.body.appendChild(root);
    trackScrollOffsets(root);
    userScroll(list, 600);
    userScroll(list, 0);

    list.loseBox();
    restoreScrollOffsets(root);
    expect(list.scrollLeft).toBe(0);
  });

  it("keeps the record through a scroll event read while the scroller has no box", () => {
    const root = document.createElement("div");
    const list = scroller();
    root.append(list);
    document.body.appendChild(root);
    trackScrollOffsets(root);
    userScroll(list, 600);

    // Hidden: reads are 0 and a write-back of 0 (React's focus restore) is
    // dropped. Even if a scroll event is seen now, the record must survive.
    root.style.setProperty("display", "none", "important");
    list.loseBox();
    list.scrollLeft = 0;
    list.checkVisibility = () => false;
    list.dispatchEvent(new Event("scroll"));

    root.style.display = "";
    delete (list as Partial<Scroller>).checkVisibility;
    restoreScrollOffsets(root);
    expect(list.scrollLeft).toBe(600);
  });

  it("leaves an offset the app set after the page came back", () => {
    const root = document.createElement("div");
    const list = scroller();
    root.append(list);
    document.body.appendChild(root);
    trackScrollOffsets(root);
    userScroll(list, 600, 80);

    list.loseBox();
    list.scrollLeft = 120;
    restoreScrollOffsets(root);
    expect(list.scrollLeft).toBe(120);
    // The other axis is still at 0, so it is restored.
    expect(list.scrollTop).toBe(80);
  });

  it("skips the boundary itself, the scroll container and removed scrollers", () => {
    const root = scroller();
    const container = scroller();
    const removed = scroller();
    root.append(container, removed);
    document.body.appendChild(root);
    trackScrollOffsets(root);
    trackScrollOffsets(root); // idempotent: still one listener
    userScroll(root, 0, 300);
    userScroll(container, 0, 500);
    userScroll(removed, 400);

    root.loseBox();
    container.loseBox();
    removed.remove();
    removed.loseBox();
    document.body.appendChild(removed);
    restoreScrollOffsets(root, container);
    expect(root.scrollTop).toBe(0);
    expect(container.scrollTop).toBe(0);
    expect(removed.scrollLeft).toBe(0);
  });

  it("does nothing for a boundary that never tracked", () => {
    const root = document.createElement("div");
    expect(() => restoreScrollOffsets(root)).not.toThrow();
  });
});

// ── Through the real transition context and observers ─────────────────────

vi.mock("./create-context-manager", () => ({
  createContextManager: () => ({
    initializeContext: () => () => {},
    beginTransition: () => () => {},
    disconnect: () => {},
    calculateScrollOffset: () => ({ x: 0, y: 0 }),
    evictScrollPosition: () => {},
    getScrollContainer: () => null,
    getPositionedParentElement: () => null,
    getScrollPosition: () => ({ x: 0, y: 0 }),
    getIsMobile: () => false,
  }),
}));

const { createSggoiTransitionContext } = await import(
  "./create-ssgoi-transition-context"
);
const { observeSsgoiTransitions } = await import("./observe-ssgoi-transitions");

const ID = "data-ssgoi-transition";

class FakeAnimation extends Animation {
  private done = false;
  play(): void {}
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
    return !this.done;
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
    return this.done ? 1 : 0;
  }
  findTimeForProgress() {
    return null;
  }
}

async function flush() {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (let j = 0; j < 30; j++) await Promise.resolve();
  }
}

function page(path: string): HTMLDivElement {
  const el = document.createElement("div");
  el.setAttribute(ID, path);
  return el;
}

const reactHide = (el: HTMLElement) =>
  el.style.setProperty("display", "none", "important");
const reactReveal = (el: HTMLElement) => {
  el.style.display = "";
};

/** Each run records the outgoing page's list offset when its animation starts. */
function setup(list: Scroller) {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const host = new HostAnimation();
  const outgoing: number[] = [];
  const context = createSggoiTransitionContext(
    {
      transitions: [
        {
          on: "/**",
          transition: {
            animation: ({ from }) => {
              if ((from as HTMLElement).contains(list))
                outgoing.push(list.scrollLeft);
              return new FakeAnimation();
            },
          },
        },
      ],
    },
    { host },
  );
  const stop = observeSsgoiTransitions(root, context);
  return { root, host, outgoing, teardown: () => (stop(), root.remove()) };
}

describe("inner scroll offsets across a navigation", () => {
  it("hidden mode: the outgoing page and its return keep a list moved while hidden", async () => {
    const list = scroller();
    const { root, host, outgoing, teardown } = setup(list);
    const lounge = page("/lounge");
    lounge.appendChild(list);
    root.appendChild(lounge);
    await flush();
    userScroll(list, 600);

    // /lounge -> /showcase/1 in one commit: React hides the lounge and moves
    // it past the new page while ordering the kept-alive siblings.
    const detail = page("/showcase/1");
    reactHide(lounge);
    root.prepend(detail);
    root.appendChild(lounge);
    list.loseBox();
    await flush();
    expect(outgoing).toEqual([600]);
    expect(list.scrollLeft).toBe(600);
    host.complete();
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("none");

    // Back: React moves the hidden lounge again, then reveals it.
    root.prepend(lounge);
    list.loseBox();
    reactReveal(lounge);
    reactHide(detail);
    await flush();
    expect(list.scrollLeft).toBe(600);
    teardown();
  });

  it("unmount mode: the reinserted outgoing page keeps its list offset", async () => {
    const list = scroller();
    const { root, outgoing, teardown } = setup(list);
    const lounge = page("/lounge");
    lounge.appendChild(list);
    root.appendChild(lounge);
    await flush();
    userScroll(list, 600);

    // React replaces the page; ssgoi reinserts the detached node for the OUT.
    lounge.remove();
    list.loseBox();
    root.appendChild(page("/showcase/1"));
    await flush();
    expect(outgoing).toEqual([600]);
    teardown();
  });
});
