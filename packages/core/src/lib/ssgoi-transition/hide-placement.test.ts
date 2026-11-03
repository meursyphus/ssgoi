// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { Animation } from "../animation/animation";
import { HostAnimation } from "../animation/host-animation";
import type { SsgoiContext } from "@types";

/**
 * A page the framework takes off screen (React hides it, or removes it from
 * the DOM) is put back on screen at once, out of flow at the offset the user
 * left it, and waits there for its successor: a slow route paints neither a
 * blank nor the page from its top. How it is kept on screen is a strategy
 * chosen at that edge; the run only re-expresses the offset and settles it.
 */

const container = document.createElement("main");
const scrollTo = vi.fn();
(container as unknown as { scrollTo: typeof scrollTo }).scrollTo = scrollTo;
const calculateScrollOffset = vi.fn(() => ({ x: 0, y: 850 }));

vi.mock("./create-context-manager", () => ({
  createContextManager: () => ({
    initializeContext: () => () => {},
    beginTransition: () => () => {},
    beginLeaving: () => () => {},
    disconnect: () => {},
    calculateScrollOffset,
    evictScrollPosition: () => {},
    getScrollContainer: () => container,
    getPositionedParentElement: () => null,
    getScrollPosition: () => ({ x: 0, y: 850 }),
    getIsMobile: () => false,
  }),
}));

import { createSggoiTransitionContext } from "./create-ssgoi-transition-context";
import { observeSsgoiTransitions } from "./observe-ssgoi-transitions";

const ID = "data-ssgoi-transition";
const PRESENCE_TIMEOUT_MS = 5000;

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

// Timers are faked (timeouts only, so rAF/MutationObserver stay real): a
// macrotask turn is an advance by 0.
async function flush() {
  for (let i = 0; i < 3; i++) {
    await vi.advanceTimersByTimeAsync(0);
    for (let j = 0; j < 30; j++) await Promise.resolve();
  }
}

const boundary = (path: string) => {
  const el = document.createElement("div");
  el.setAttribute(ID, path);
  return el;
};
const reactHide = (el: HTMLElement) =>
  el.style.setProperty("display", "none", "important");

function setup() {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const root = document.createElement("div");
  document.body.appendChild(root);
  const host = new HostAnimation();
  const context: SsgoiContext = createSggoiTransitionContext(
    {
      transitions: [
        {
          on: "/**",
          transition: { animation: () => new FakeAnimation() },
        },
      ],
    },
    { host },
  );
  const stop = observeSsgoiTransitions(root, context);
  return { root, host, stop };
}

afterEach(() => {
  document.body.innerHTML = "";
  scrollTo.mockClear();
  vi.useRealTimers();
});

const expectPresented = (el: HTMLElement) => {
  expect(el.style.position).toBe("absolute");
  expect(el.style.top).toBe("-850px");
};

describe("a hidden page whose successor is still loading", () => {
  it("is revealed at its last offset the moment React hides it", async () => {
    const { root, host, stop } = setup();
    const lounge = boundary("/lounge");
    root.appendChild(lounge);
    await flush();

    // The router hides the lounge and scrolls the emptied container to the
    // top; no incoming page exists yet. The lounge is put back on screen
    // where the user left it, over React's hide.
    reactHide(lounge);
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("block");
    expect(lounge.style.getPropertyPriority("display")).toBe("important");
    expectPresented(lounge);
    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // A round trip later the detail mounts: the pair resolves and the run
    // starts from the same placement.
    const detail = boundary("/blog/x");
    root.appendChild(detail);
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("block");
    expectPresented(lounge);

    // A duplicate React hide while the run plays keeps it on screen.
    reactHide(lounge);
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("block");

    host.complete();
    await flush();
    // Settled back to React's intent, with no placement left behind.
    expect(lounge.style.top).toBe("");
    expect(lounge.style.position).toBe("");
    expect(lounge.style.getPropertyValue("display")).toBe("none");
    expect(lounge.style.getPropertyPriority("display")).toBe("important");

    stop();
  });

  it("is withdrawn when no successor comes, and presented again by a late pair", async () => {
    const { root, host, stop } = setup();
    const lounge = boundary("/lounge");
    root.appendChild(lounge);
    await flush();

    reactHide(lounge);
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("block");

    // Nothing arrives: the page must not stay on screen as a ghost.
    await vi.advanceTimersByTimeAsync(PRESENCE_TIMEOUT_MS);
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("none");
    expect(lounge.style.getPropertyPriority("display")).toBe("important");
    expect(lounge.style.position).toBe("");
    expect(lounge.style.top).toBe("");

    // The OUT is still pending; a successor pairs with it and the run puts
    // the page back on screen for its out-animation.
    const detail = boundary("/blog/x");
    root.appendChild(detail);
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("block");
    expectPresented(lounge);

    host.complete();
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("none");
    expect(lounge.style.position).toBe("");

    stop();
  });
});

describe("a removed page whose successor is still loading", () => {
  it("is reinserted at its last offset the moment the framework removes it", async () => {
    const { root, host, stop } = setup();
    const lounge = boundary("/lounge");
    const after = document.createElement("footer");
    root.append(lounge, after);
    await flush();

    // The framework removes the lounge; no incoming page exists yet. The
    // real node is put back at its old anchor, out of flow where the user
    // left it.
    lounge.remove();
    await flush();
    expect(lounge.parentNode).toBe(root);
    expect(lounge.nextSibling).toBe(after);
    expectPresented(lounge);
    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const detail = boundary("/blog/x");
    root.insertBefore(detail, after);
    await flush();
    expect(lounge.parentNode).toBe(root);
    expectPresented(lounge);

    host.complete();
    await flush();
    expect(lounge.parentNode).toBeNull();
    expect(detail.parentNode).toBe(root);

    stop();
  });

  it("is removed again when no successor comes, and reinserted by a late pair", async () => {
    const { root, host, stop } = setup();
    const lounge = boundary("/lounge");
    root.append(lounge);
    await flush();

    lounge.remove();
    await flush();
    expect(lounge.parentNode).toBe(root);

    await vi.advanceTimersByTimeAsync(PRESENCE_TIMEOUT_MS);
    await flush();
    expect(lounge.parentNode).toBeNull();

    const detail = boundary("/blog/x");
    root.append(detail);
    await flush();
    expect(lounge.parentNode).toBe(root);
    expectPresented(lounge);

    host.complete();
    await flush();
    expect(lounge.parentNode).toBeNull();

    stop();
  });
});
