// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { Animation } from "../animation/animation";
import { HostAnimation } from "../animation/host-animation";
import type { SsgoiContext } from "@types";

/**
 * A page React hides follows the same lifecycle as a node the framework
 * removed: it stays off screen while its successor is still loading and
 * while the run is prepared, then is placed out of flow at the offset the
 * user left it at and revealed — in the same microtask as a same-commit IN,
 * so nothing paints in between.
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
  it("stays hidden until the run is prepared, then is revealed at its last offset", async () => {
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

    // The router hides the lounge; no incoming page exists yet. Nothing is
    // put on screen for it, exactly like a node the framework removed.
    reactHide(lounge);
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("none");
    expect(lounge.style.getPropertyPriority("display")).toBe("important");
    expect(lounge.style.position).toBe("");
    expect(lounge.style.top).toBe("");
    expect(scrollTo).not.toHaveBeenCalled();

    // A round trip later the detail mounts: the pair resolves, the plan is
    // prepared, and the lounge is placed and revealed for its out-animation.
    const detail = boundary("/blog/x");
    root.appendChild(detail);
    await flush();
    expect(lounge.style.getPropertyValue("display")).toBe("block");
    expect(lounge.style.getPropertyPriority("display")).toBe("important");
    expect(lounge.style.position).toBe("absolute");
    expect(lounge.style.top).toBe("-850px");

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

    stop();
  });
});
