// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { Animation } from "../animation/animation";
import { HostAnimation } from "../animation/host-animation";
import type { SsgoiContext } from "@types";

/**
 * A page React hides whose successor has not arrived yet (its segment is
 * still on the wire) must be placed at the offset the user left it at right
 * away, not when the pair resolves: the router scrolls the emptied container
 * to the top meanwhile.
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

const boundary = (path: string) => {
  const el = document.createElement("div");
  el.setAttribute(ID, path);
  return el;
};
const reactHide = (el: HTMLElement) =>
  el.style.setProperty("display", "none", "important");

afterEach(() => {
  document.body.innerHTML = "";
  scrollTo.mockClear();
});

describe("a hidden page whose successor is still loading", () => {
  it("is placed at its last scroll offset at once and the container reset to the top", async () => {
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

    const lounge = boundary("/lounge");
    root.appendChild(lounge);
    await flush();

    // The router hides the lounge; no incoming page exists yet.
    reactHide(lounge);
    await flush();
    expect(lounge.style.position).toBe("absolute");
    expect(lounge.style.top).toBe("-850px");
    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // A round trip later the detail mounts: the run keeps the same offset.
    const detail = boundary("/blog/x");
    root.appendChild(detail);
    await flush();
    expect(lounge.style.top).toBe("-850px");
    host.complete();
    await flush();
    // Settled back to React's intent, with no placement left behind.
    expect(lounge.style.top).toBe("");
    expect(lounge.style.getPropertyValue("display")).toBe("none");

    stop();
  });
});
