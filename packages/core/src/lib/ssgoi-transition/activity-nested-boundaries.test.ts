// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { Animation } from "../animation/animation";
import { HostAnimation } from "../animation/host-animation";
import type { SsgoiContext } from "@types";

/**
 * Nested Activity boundaries, driven through the REAL observers
 * (observeSsgoiTransitions, the visibility observer and the unmount observer)
 * with React's DOM writes simulated in jsdom.
 *
 * Shape (Next.js Cache Components, `SsgoiPageBoundary` on group layouts AND on
 * pages):
 *
 *   root
 *   ├── A  (top-level) group boundary
 *   │   ├── P1  /lounge page boundary
 *   │   └── P2  /showcase page boundary   (mounted on the last navigation)
 *   └── B  (detail) group boundary
 *       └── PB  /updates page boundary
 *
 * React's Activity writes `display:none !important` on the top-most host node
 * it hides and resets `display` to reveal it. Re-entering group A from B hides
 * B, reveals A, and — inside the revealed A — hides P1 and mounts P2, all in one
 * commit.
 */

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

import { createSggoiTransitionContext } from "./create-ssgoi-transition-context";
import { observeSsgoiTransitions } from "./observe-ssgoi-transitions";

const ID = "data-ssgoi-transition";

/** Opaque driver outside the disposal contract: settles on completion. */
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

/** Let every MutationObserver callback and the promise chains behind it run. */
async function flush() {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (let j = 0; j < 30; j++) await Promise.resolve();
  }
}

function boundary(path: string): HTMLDivElement {
  const el = document.createElement("div");
  el.setAttribute(ID, path);
  return el;
}

const reactHide = (el: HTMLElement) =>
  el.style.setProperty("display", "none", "important");
const reactReveal = (el: HTMLElement) => {
  el.style.display = "";
};

const TEMPORARY = ["position", "width", "left", "top"] as const;

/** No library-owned reveal / out-of-flow placement is left on the node. */
function expectSettled(el: HTMLElement, hidden: boolean) {
  for (const prop of TEMPORARY) {
    expect(el.style.getPropertyValue(prop), `${prop} on ${el.id}`).toBe("");
  }
  if (hidden) {
    expect(el.style.getPropertyValue("display"), el.id).toBe("none");
    expect(el.style.getPropertyPriority("display"), el.id).toBe("important");
  } else {
    expect(el.style.getPropertyValue("display"), el.id).toBe("");
  }
}

type Pair = { from: HTMLElement; to: HTMLElement };

function setup() {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const host = new HostAnimation();
  const pairs: Pair[] = [];
  const context: SsgoiContext = createSggoiTransitionContext(
    {
      transitions: [
        {
          on: "/**",
          transition: {
            animation: ({ from, to }) => {
              pairs.push({ from: from as HTMLElement, to: to as HTMLElement });
              return new FakeAnimation();
            },
          },
        },
      ],
    },
    { host },
  );
  const stop = observeSsgoiTransitions(root, context);
  const teardown = () => {
    stop();
    root.remove();
  };
  return { root, host, pairs, context, teardown };
}

afterEach(() => {
  document.body.innerHTML = "";
});

// The order React's mutation phase reaches these nodes is not part of any
// contract, and the visibility observer dispatches in record order.
const ORDERS = [
  ["hideB", "revealA", "hideP1", "mountP2"],
  ["hideP1", "mountP2", "revealA", "hideB"],
  ["revealA", "hideP1", "mountP2", "hideB"],
  ["mountP2", "hideB", "hideP1", "revealA"],
] as const;

const CASES = ORDERS.flatMap((order) =>
  (["mounts", "is revealed"] as const).map((p2) => [p2, ...order] as const),
);

describe("nested Activity boundaries", () => {
  it.each(CASES)(
    "re-entering a group from another group settles the hidden child page (P2 %s; %s, %s, %s, %s)",
    async (p2, ...order) => {
      const { root, host, pairs, teardown } = setup();

      // /lounge: group A with its tab page P1 (and, when P2 was visited
      // before, its kept-alive hidden page P2).
      const A = boundary("/lounge");
      A.id = "A";
      const P1 = boundary("/lounge");
      P1.id = "P1";
      A.appendChild(P1);
      const P2 = boundary("/showcase");
      P2.id = "P2";
      if (p2 === "is revealed") {
        reactHide(P2);
        A.appendChild(P2);
      }
      root.appendChild(A);
      await flush();

      // /lounge -> /updates: A hides, group B mounts with its page.
      const B = boundary("/updates");
      B.id = "B";
      const PB = boundary("/updates");
      PB.id = "PB";
      B.appendChild(PB);
      reactHide(A);
      root.appendChild(B);
      await flush();
      expect(pairs).toEqual([{ from: A, to: B }]);
      host.complete();
      await flush();
      expectSettled(A, true);
      expectSettled(B, false);

      // /updates -> /showcase (intercepted inside group A), one commit.
      const writes = {
        hideB: () => reactHide(B),
        revealA: () => {
          reactReveal(A);
          // SsgoiPageBoundary's layout effect catches the id up on reveal.
          A.setAttribute(ID, "/showcase");
        },
        hideP1: () => reactHide(P1),
        mountP2: () => (p2 === "mounts" ? A.appendChild(P2) : reactReveal(P2)),
      };
      for (const write of order) writes[write]();
      await flush();
      host.complete();
      await flush();

      // Nothing keeps a temporary reveal: P1 was hidden while A was hidden,
      // so it never was on screen to animate out.
      expectSettled(B, true);
      expectSettled(A, false);
      expectSettled(P1, true);
      expectSettled(P2, false);
      // The group pair owns the navigation; the child pages inside the
      // re-entering group are carried by it.
      expect(pairs.slice(1)).toEqual([{ from: B, to: A }]);

      // /showcase -> /updates pairs the groups again and settles.
      reactHide(A);
      reactReveal(B);
      await flush();
      expect(pairs.slice(2)).toEqual([{ from: A, to: B }]);
      host.complete();
      await flush();
      expectSettled(A, true);
      expectSettled(B, false);
      expectSettled(P1, true);
      expectSettled(P2, false);

      teardown();
    },
  );

  it("a child page switch inside a steady group still animates the pages", async () => {
    const { root, host, pairs, teardown } = setup();
    const A = boundary("/lounge");
    const P1 = boundary("/lounge");
    A.appendChild(P1);
    root.appendChild(A);
    await flush();

    // /lounge -> /feed inside the same visible group: A stays visible and only
    // its id follows the route; P1 hides and P2 mounts.
    const P2 = boundary("/feed");
    A.setAttribute(ID, "/feed");
    reactHide(P1);
    A.appendChild(P2);
    await flush();
    expect(pairs).toEqual([{ from: P1, to: P2 }]);
    expect(P1.style.getPropertyValue("display")).toBe("block");
    expect(P1.style.position).toBe("absolute");
    host.complete();
    await flush();
    expectSettled(P1, true);
    expectSettled(P2, false);
    expectSettled(A, false);
    teardown();
  });

  it("a page toggled inside a group that stays hidden never animates", async () => {
    const { root, pairs, teardown } = setup();
    const A = boundary("/lounge");
    const P1 = boundary("/lounge");
    A.appendChild(P1);
    const B = boundary("/updates");
    reactHide(B);
    root.append(A, B);
    await flush();

    // Prefetch / offscreen render inside the hidden group B.
    const PB = boundary("/updates/next");
    B.appendChild(PB);
    await flush();
    const PB2 = boundary("/updates");
    reactHide(PB);
    B.appendChild(PB2);
    await flush();

    expect(pairs).toEqual([]);
    expectSettled(PB, true);
    expectSettled(PB2, false);
    expectSettled(B, true);

    // The next real navigation still pairs the groups.
    reactHide(A);
    reactReveal(B);
    await flush();
    expect(pairs).toEqual([{ from: A, to: B }]);
    teardown();
  });
});

describe("boundary removed inside a hidden group", () => {
  it("is not an OUT, so the next navigation still pairs", async () => {
    const { root, host, pairs, teardown } = setup();
    const A = boundary("/lounge");
    const B = boundary("/updates");
    const PB = boundary("/updates");
    B.appendChild(PB);
    reactHide(B);
    root.append(A, B);
    await flush();

    // Next.js evicts a kept-alive page inside the hidden group.
    PB.remove();
    await flush();
    expect(pairs).toEqual([]);

    // /lounge -> /updates: the group pair, not the evicted page's stale OUT.
    reactHide(A);
    reactReveal(B);
    await flush();
    expect(pairs).toEqual([{ from: A, to: B }]);
    host.complete();
    await flush();
    expectSettled(A, true);
    expectSettled(B, false);
    teardown();
  });
});

describe("hidden OUT that never animates", () => {
  it("restores its temporary reveal when superseded by another OUT", async () => {
    const { root, context, pairs, teardown } = setup();
    const A = boundary("/a");
    root.append(A);
    // A second visible page, registered without entering (outside the root).
    const D = boundary("/d");
    document.body.appendChild(D);
    context.register("/d", D, { enter: false });
    await flush();

    // A hides with no incoming page yet: it is revealed while it waits.
    reactHide(A);
    await flush();
    expect(A.style.getPropertyValue("display")).toBe("block");
    expect(A.style.position).toBe("absolute");

    // A different-path OUT before any IN supersedes A's.
    reactHide(D);
    await flush();
    expectSettled(A, true);
    expect(pairs).toEqual([]);
    teardown();
  });

  it("restores its temporary reveal when absorbed as a late duplicate", async () => {
    const { root, host, pairs, teardown } = setup();
    const A = boundary("/a");
    const A2 = boundary("/a");
    const B = boundary("/b");
    reactHide(B);
    root.append(A, A2, B);
    await flush();

    reactHide(A);
    reactReveal(B);
    await flush();
    expect(pairs).toEqual([{ from: A, to: B }]);
    host.complete();
    await flush();

    // Another DOM instance of the route that just left reports its hide late.
    reactHide(A2);
    await flush();
    expectSettled(A2, true);
    expect(pairs).toHaveLength(1);
    teardown();
  });
});
