import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { render, hydrate, type ComponentChildren } from "preact";
import { useLayoutEffect } from "preact/hooks";
import { act } from "preact/test-utils";
import { renderToString } from "preact-render-to-string";
import { Animation, HostAnimation } from "@ssgoi/core/internal";
import type { SsgoiConfig, SsgoiTransitionState } from "@ssgoi/core/types";
import {
  Ssgoi,
  SsgoiRouteBoundary,
  SsgoiTransition,
  useSsgoiTransition,
} from "../src";

class HeldAnimation extends Animation {
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
    return 0;
  }
  findTimeForProgress() {
    return null;
  }
}

let container: HTMLDivElement;
let playback: HostAnimation;
const runs: HeldAnimation[] = [];
const states: SsgoiTransitionState[] = [];
const config: SsgoiConfig = {
  transitions: [
    {
      on: "/**",
      transition: {
        animation: () => {
          const run = new HeldAnimation();
          runs.push(run);
          return run;
        },
      },
    },
  ],
};

beforeEach(() => {
  Element.prototype.scrollTo ??= () => {};
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  container = document.createElement("div");
  document.body.append(container);
  playback = new HostAnimation();
  playback.pause();
  runs.length = 0;
  states.length = 0;
});
afterEach(() => {
  act(() => render(null, container));
  container.remove();
  vi.restoreAllMocks();
});

function Status({ name = "outer" }: { name?: string }) {
  const state = useSsgoiTransition();
  useLayoutEffect(() => {
    states.push(state);
  }, [state]);
  return (
    <output data-name={name} data-status={state.status}>
      {state.from} → {state.to}
    </output>
  );
}
function App({
  page,
  settings = config,
}: {
  page: string;
  settings?: SsgoiConfig;
}) {
  return (
    <Ssgoi config={settings} host={playback}>
      <Status />
      <SsgoiRouteBoundary id={page} as="main" class="page">
        <input defaultValue={page} />
      </SsgoiRouteBoundary>
    </Ssgoi>
  );
}
async function paint(node: ComponentChildren) {
  act(() => render(node, container));
  await settle();
}
async function settle() {
  for (let i = 0; i < 20; i++)
    await act(async () => {
      await Promise.resolve();
    });
}
const status = (name = "outer") =>
  container.querySelector<HTMLOutputElement>(`output[data-name="${name}"]`)!;

it("pairs keyed navigation, retains the outgoing page until completion, and publishes lifecycle state", async () => {
  await paint(<App page="/list" />);
  const first = container.querySelector("main");
  expect(runs).toHaveLength(0);
  await paint(<App page="/detail" />);
  expect(runs).toHaveLength(1);
  expect(status().dataset.status).toBe("transitioning");
  expect(status().textContent).toBe("/list → /detail");
  expect(
    container.querySelector('main[data-ssgoi-transition="/detail"]'),
  ).not.toBe(first);
  expect(first?.isConnected).toBe(true);
  expect(first?.querySelector("input")?.value).toBe("/list");
  act(() => playback.complete());
  await settle();
  expect(first?.isConnected).toBe(false);
  expect(status().dataset.status).toBe("idle");
  expect(states.map((state) => state.status)).toEqual([
    "idle",
    "transitioning",
    "idle",
  ]);
});

it("supports repeated forward and back navigation without stale registrations", async () => {
  await paint(<App page="/list" />);
  await paint(<App page="/detail" />);
  act(() => playback.complete());
  await settle();
  const detail = container.querySelector(
    'main[data-ssgoi-transition="/detail"]',
  );
  await paint(<App page="/list" />);
  expect(runs).toHaveLength(2);
  expect(status().textContent).toBe("/detail → /list");
  expect(detail?.isConnected).toBe(true);
  act(() => playback.complete());
  await settle();
  expect(detail?.isConnected).toBe(false);
  expect(container.querySelectorAll("main")).toHaveLength(1);
  expect(status().dataset.status).toBe("idle");
});

it("preserves the page instance on same-route rerenders", async () => {
  await paint(<App page="/list" />);
  const input = container.querySelector("input")!;
  input.value = "user edit";
  await paint(<App page="/list" />);
  expect(container.querySelector("input")).toBe(input);
  expect(input.value).toBe("user edit");
  expect(runs).toHaveLength(0);
});

it("disconnects the previous context when config changes and observes future navigation", async () => {
  await paint(<App page="/list" />);
  const changed: SsgoiConfig = { ...config };
  await paint(<App page="/list" settings={changed} />);
  await paint(<App page="/detail" settings={changed} />);
  expect(runs).toHaveLength(1);
  expect(status().dataset.status).toBe("transitioning");
});

it("disconnects observers and listeners on unmount during playback", async () => {
  await paint(<App page="/list" />);
  await paint(<App page="/detail" />);
  const detachedRoot = container.firstElementChild!;
  await paint(null);
  const stateCount = states.length;
  detachedRoot.append(
    Object.assign(document.createElement("div"), { textContent: "detached" }),
  );
  act(() => playback.complete());
  await settle();
  expect(container.innerHTML).toBe("");
  expect(runs).toHaveLength(1);
  expect(states).toHaveLength(stateCount);
});

it("isolates nested provider boundaries and transition state", async () => {
  const innerPlayback = new HostAnimation();
  innerPlayback.pause();
  const tree = (page: string) => (
    <Ssgoi config={config} host={playback}>
      <Status />
      <Ssgoi config={config} host={innerPlayback}>
        <Status name="inner" />
        <SsgoiRouteBoundary id={page}>{page}</SsgoiRouteBoundary>
      </Ssgoi>
    </Ssgoi>
  );
  await paint(tree("/one"));
  await paint(tree("/two"));
  expect(runs).toHaveLength(1);
  expect(status().dataset.status).toBe("idle");
  expect(status("inner").dataset.status).toBe("transitioning");
  act(() => innerPlayback.complete());
  await settle();
});

it("hydrates existing markup and then transitions normally", async () => {
  container.innerHTML = renderToString(<App page="/list" />);
  const serverPage = container.querySelector("main");
  act(() => hydrate(<App page="/list" />, container));
  await settle();
  expect(container.querySelector("main")).toBe(serverPage);
  expect(runs).toHaveLength(0);
  await paint(<App page="/detail" />);
  expect(runs).toHaveLength(1);
});

it("supports raw markers and the compatibility marker component", async () => {
  await paint(
    <Ssgoi config={config} host={playback}>
      <div key="a" data-ssgoi-transition="/a">
        a
      </div>
    </Ssgoi>,
  );
  await paint(
    <Ssgoi config={config} host={playback}>
      <SsgoiTransition key="b" id="/b" as="section" class="page">
        b
      </SsgoiTransition>
    </Ssgoi>,
  );
  expect(runs).toHaveLength(1);
  expect(
    container
      .querySelector("section.page")
      ?.getAttribute("data-ssgoi-transition"),
  ).toBe("/b");
});
