import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import m from "mithril";
import {
  Animation,
  type AnimationDisposal,
  type SsgoiConfig,
} from "@ssgoi/core";
import { Ssgoi, createSsgoi } from "./index";
import { SsgoiRouteBoundary } from "./router";

class TestAnimation extends Animation {
  isAnimating = false;
  isPaused = false;
  isComplete = false;
  isReversing = false;
  progress = 0;
  play = vi.fn(() => {
    this.isAnimating = true;
  });
  pause() {
    this.isPaused = true;
  }
  reverse() {
    this.isReversing = true;
  }
  complete() {
    this.isComplete = true;
    this.isAnimating = false;
    this.onComplete?.();
  }
  cancel = vi.fn((_context: AnimationDisposal) => {
    this.isAnimating = false;
  });
  getPose() {
    return [];
  }
  getTimeline() {
    return [];
  }
  matchInto() {}
  findTimeForProgress() {
    return null;
  }
}

const roots: HTMLElement[] = [];
function root() {
  const element = document.createElement("main");
  document.body.append(element);
  roots.push(element);
  return element;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 40));
function motion() {
  const runs: { from: HTMLElement; to: HTMLElement; run: TestAnimation }[] = [];
  const config: SsgoiConfig = {
    scrollLock: false,
    transitions: [
      {
        on: "/**",
        transition: {
          animation: ({ from, to }) => {
            const run = new TestAnimation();
            runs.push({ from, to, run });
            return run;
          },
        },
      },
    ],
  };
  return { runs, config };
}

beforeAll(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  HTMLElement.prototype.scrollTo = vi.fn();
  window.scrollTo = vi.fn();
});

afterEach(async () => {
  for (const element of roots.splice(0)) {
    m.mount(element, null);
    element.remove();
  }
  await flush();
});

describe("Mithril lifecycle with the real core", () => {
  it("renders the root route at a bare URL without a hash prefix", async () => {
    const element = root();
    window.history.replaceState(null, "", "/");
    m.route(element, "/", {
      "/": {
        onmatch: () => ({ view: () => m("article", "Home") }),
        render: (page) => m(Ssgoi, m(SsgoiRouteBoundary, page)),
      },
    });
    await flush();
    expect(
      element.querySelector('[data-ssgoi-transition="/"]')!.textContent,
    ).toBe("Home");
  });

  it("retains outgoing DOM and publishes reactive state until settling", async () => {
    const element = root();
    const controller = createSsgoi();
    const { runs, config } = motion();
    let path = "/a";
    m.mount(element, {
      view: () =>
        m(Ssgoi, { config, controller }, [
          m("output", controller.getTransitionState().status),
          m(
            SsgoiRouteBoundary,
            { path },
            m("article", [m("input", { value: path }), path]),
          ),
        ]),
    });
    await flush();
    const outgoing = element.querySelector(
      "[data-ssgoi-transition]",
    ) as HTMLElement;
    outgoing.querySelector("input")!.value = "edited";
    path = "/b";
    m.redraw.sync();
    await flush();
    expect(runs).toHaveLength(1);
    expect(runs[0].from).toBe(outgoing);
    expect(outgoing.textContent).toBe("/a");
    expect(outgoing.querySelector("input")!.value).toBe("edited");
    expect(outgoing.isConnected).toBe(true);
    expect(element.querySelector("output")!.textContent).toBe("transitioning");
    runs[0].run.complete();
    await flush();
    expect(outgoing.isConnected).toBe(false);
    expect(element.querySelector("output")!.textContent).toBe("idle");
    path = "/a";
    m.redraw.sync();
    await flush();
    expect(runs).toHaveLength(2);
    m.mount(element, null);
    expect(runs[1].run.cancel).toHaveBeenCalled();
    expect(controller.getTransitionState().status).toBe("idle");
  });

  it("keys reused parameter routes while preserving query/hash-only page lifetime", async () => {
    const element = root();
    const controller = createSsgoi();
    const { config, runs } = motion();
    let mounts = 0;
    const Item: m.Component<{ id: string }> = {
      oninit: () => {
        mounts++;
      },
      view: ({ attrs }) => m("article", `Item ${attrs.id}`),
    };
    window.history.replaceState(null, "", "#!/items/1");
    m.route(element, "/items/1", {
      "/items/:id": {
        onmatch: () => Item,
        render: (page) =>
          m(Ssgoi, { controller, config }, m(SsgoiRouteBoundary, page)),
      },
    });
    await flush();
    const original = element.querySelector("[data-ssgoi-transition]")!;
    m.route.set("/items/1?tab=details#content");
    await flush();
    expect(element.querySelector("[data-ssgoi-transition]")).toBe(original);
    expect(mounts).toBe(1);
    expect(runs).toHaveLength(0);
    m.route.set("/items/2");
    await flush();
    expect(mounts).toBe(2);
    expect(runs).toHaveLength(1);
    expect(runs[0].from).toBe(original);
    expect(original.textContent).toBe("Item 1");
    expect(runs[0].to.textContent).toBe("Item 2");
    expect(controller.getTransitionState()).toMatchObject({
      from: "/items/1",
      to: "/items/2",
    });
    runs[0].run.complete();
    await flush();
    expect(element.querySelectorAll("[data-ssgoi-transition]")).toHaveLength(1);
  });

  it("isolates nested providers and their state without a global context", async () => {
    const element = root();
    const outer = createSsgoi();
    const inner = createSsgoi();
    const outerMotion = motion();
    const innerMotion = motion();
    let path = "/a";
    m.mount(element, {
      view: () =>
        m(
          Ssgoi,
          { controller: outer, config: outerMotion.config },
          m(
            Ssgoi,
            { controller: inner, config: innerMotion.config },
            m(SsgoiRouteBoundary, { path }, path),
          ),
        ),
    });
    await flush();
    path = "/b";
    m.redraw.sync();
    await flush();
    expect(outerMotion.runs).toHaveLength(0);
    expect(outer.getTransitionState().status).toBe("idle");
    expect(innerMotion.runs).toHaveLength(1);
    expect(inner.getTransitionState().status).toBe("transitioning");
  });

  it("replaces provider config and controller while releasing previous work", async () => {
    const element = root();
    const original = createSsgoi();
    const replacement = createSsgoi();
    const first = motion();
    const second = motion();
    let controller = original;
    let config = first.config;
    let path = "/a";
    m.mount(element, {
      view: () =>
        m(Ssgoi, { controller, config }, m(SsgoiRouteBoundary, { path }, path)),
    });
    await flush();
    path = "/b";
    m.redraw.sync();
    await flush();
    config = second.config;
    m.redraw.sync();
    await flush();
    expect(first.runs[0].run.cancel).toHaveBeenCalled();
    expect(original.getTransitionState().status).toBe("idle");
    controller = replacement;
    m.redraw.sync();
    await flush();
    path = "/c";
    m.redraw.sync();
    await flush();
    expect(second.runs).toHaveLength(1);
    expect(original.getTransitionState().status).toBe("idle");
    expect(replacement.getTransitionState().status).toBe("transitioning");
  });

  it("rejects sharing one controller between simultaneous roots", () => {
    const controller = createSsgoi();
    const first = root();
    controller.attach(first);
    expect(() => controller.attach(root())).toThrow("own controller");
    controller.detach();
  });
});
