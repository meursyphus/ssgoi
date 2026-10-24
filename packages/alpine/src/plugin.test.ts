import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import Alpine from "alpinejs";
import { Animation, type AnimationDisposal } from "@ssgoi/core";
import ssgoi from "./index";

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

async function flush() {
  for (let i = 0; i < 5; i++)
    await new Promise((resolve) => setTimeout(resolve, 0));
}

function mount(html: string, data: Record<string, unknown>) {
  Alpine.data("testState", () => data);
  const container = document.createElement("div");
  container.innerHTML = html;
  const root = container.firstElementChild as HTMLElement;
  document.body.append(root);
  Alpine.initTree(root);
  return { root, state: Alpine.$data(root) as Record<string, any> };
}

beforeAll(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  window.scrollTo = vi.fn();
  HTMLElement.prototype.scrollTo = vi.fn();
  Alpine.plugin(ssgoi);
  Alpine.start();
});

afterEach(async () => {
  for (const root of [...document.body.children])
    Alpine.destroyTree(root as HTMLElement);
  document.body.replaceChildren();
  await flush();
});

describe("Alpine plugin with real core", () => {
  it("pairs repeated x-if swaps and preserves the outgoing DOM until settlement", async () => {
    const runs: { from: HTMLElement; to: HTMLElement; run: TestAnimation }[] =
      [];
    const config = {
      scrollLock: false,
      transitions: [
        {
          on: "/**",
          transition: {
            animation: ({
              from,
              to,
            }: {
              from: HTMLElement;
              to: HTMLElement;
            }) => {
              const run = new TestAnimation();
              runs.push({ from, to, run });
              return run;
            },
          },
        },
      ],
    };
    const { root, state } = mount(
      `<main x-data="testState" x-ssgoi="config">
      <output x-text="$ssgoi.status"></output>
      <template x-if="page === 'a'"><article x-ssgoi-page="'/a'"><input value="A"><span x-text="page"></span></article></template>
      <template x-if="page === 'b'"><article x-ssgoi-page="'/b'">B</article></template>
    </main>`,
      { page: "a", config },
    );
    await flush();
    const original = root.querySelector("article")!;
    original.querySelector("input")!.value = "edited";
    state.page = "b";
    await flush();
    expect(runs).toHaveLength(1);
    expect(runs[0].from).toBe(original);
    expect(original.isConnected).toBe(true);
    expect(original.querySelector("input")!.value).toBe("edited");
    expect(original.querySelector("span")!.textContent).toBe("a");
    expect(runs[0].run.play).toHaveBeenCalledOnce();
    expect(root.querySelector("output")!.textContent).toBe("transitioning");
    runs[0].run.complete();
    await flush();
    expect(original.isConnected).toBe(false);
    expect(root.querySelector("output")!.textContent).toBe("idle");
    state.page = "a";
    await flush();
    expect(runs).toHaveLength(2);
    runs[1].run.complete();
    await flush();
    expect(root.querySelectorAll("article")).toHaveLength(1);
  });

  it("replaces reactive provider config, updates paths and isolates nested providers", async () => {
    const outer = vi.fn(() => new TestAnimation());
    const inner = vi.fn(() => new TestAnimation());
    const replacement = vi.fn(() => new TestAnimation());
    const configFor = (animation: typeof outer) => ({
      scrollLock: false,
      transitions: [{ on: "/**", transition: { animation } }],
    });
    const { root, state } = mount(
      `<main x-data="testState" x-ssgoi="config">
      <output data-status="outer" x-text="$ssgoi.status"></output>
      <section x-ssgoi="innerConfig">
        <output data-status="inner" x-text="$ssgoi.status"></output>
        <template x-if="page === 'a'"><article x-ssgoi-page="path">Inner A</article></template>
        <template x-if="page === 'b'"><article x-ssgoi-page="'/b'">Inner B</article></template>
      </section>
    </main>`,
      {
        page: "a",
        path: "/a",
        config: configFor(outer),
        innerConfig: configFor(inner),
      },
    );
    await flush();
    state.path = "/renamed";
    await flush();
    expect(
      root.querySelector("article")!.getAttribute("data-ssgoi-transition"),
    ).toBe("/renamed");
    state.innerConfig = configFor(replacement);
    await flush();
    state.page = "b";
    await flush();
    expect(outer).not.toHaveBeenCalled();
    expect(inner).not.toHaveBeenCalled();
    expect(replacement).toHaveBeenCalledOnce();
    expect(root.querySelector('[data-status="outer"]')!.textContent).toBe(
      "idle",
    );
    expect(root.querySelector('[data-status="inner"]')!.textContent).toBe(
      "transitioning",
    );
    Alpine.destroyTree(root);
    root.remove();
    await flush();
    expect(replacement.mock.results[0].value.cancel).toHaveBeenCalled();
  });

  it("supports keyed x-for and plain bound page markers without reinitializing retired scopes", async () => {
    const runs: { from: HTMLElement; run: TestAnimation }[] = [];
    const { root, state } = mount(
      `<main x-data="testState" x-ssgoi="config">
      <template x-for="item in [page]" :key="item">
        <article :data-ssgoi-transition="'/' + item"><span x-text="item"></span></article>
      </template>
    </main>`,
      {
        page: "a",
        config: {
          scrollLock: false,
          transitions: [
            {
              on: "/**",
              transition: {
                animation: ({ from }: { from: HTMLElement }) => {
                  const run = new TestAnimation();
                  runs.push({ from, run });
                  return run;
                },
              },
            },
          ],
        },
      },
    );
    await flush();
    state.page = "b";
    await flush();
    expect(runs).toHaveLength(1);
    expect(runs[0].from.textContent).toBe("a");
    expect(root.querySelectorAll("article")).toHaveLength(2);
    runs[0].run.complete();
    await flush();
    expect(root.querySelectorAll("article")).toHaveLength(1);
    expect(root.querySelector("article")!.textContent).toBe("b");
  });

  it("cleans up providers removed before their deferred initial DOM scan", async () => {
    const factory = vi.fn(() => new TestAnimation());
    const { root, state } = mount(
      `<main x-data="testState" x-ssgoi="config"><div x-ssgoi-page="'/a'"></div></main>`,
      {
        config: {
          transitions: [{ on: "/**", transition: { animation: factory } }],
        },
      },
    );
    Alpine.destroyTree(root);
    root.remove();
    state.config = {};
    await flush();
    expect(factory).not.toHaveBeenCalled();
    expect(root.hasAttribute("data-ssgoi-root")).toBe(false);
  });

  it("plays element factories with the correct element and disposes on update/removal", async () => {
    const first = new TestAnimation();
    const second = new TestAnimation();
    const factory = vi.fn(() => first);
    const nextFactory = vi.fn(() => second);
    const { root, state } = mount(
      `<main x-data="testState"><div x-ssgoi-motion="factory">Motion</div></main>`,
      { factory },
    );
    await flush();
    expect(factory).toHaveBeenCalledOnce();
    expect(factory).toHaveBeenCalledWith(root.firstElementChild);
    expect(first.play).toHaveBeenCalledOnce();
    state.factory = nextFactory;
    await flush();
    expect(first.cancel).toHaveBeenCalledWith(
      expect.objectContaining({ reason: "interrupted" }),
    );
    expect(second.play).toHaveBeenCalledOnce();
    root.remove();
    await flush();
    expect(second.cancel).toHaveBeenCalledWith(
      expect.objectContaining({ reason: "disposed" }),
    );
    state.factory = factory;
    await flush();
    expect(factory).toHaveBeenCalledOnce();
  });
});
