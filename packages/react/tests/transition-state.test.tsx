import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, useEffect, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Animation, HostAnimation } from "@ssgoi/core/internal";
import type { SsgoiConfig, SsgoiTransitionState } from "@ssgoi/core/types";
import { Ssgoi } from "../src/ssgoi";
import { useSsgoiTransition } from "../src/context";

/** Opaque driver: never finishes on its own, so playback stays observable. */
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

let host: HTMLDivElement;
let root: Root;
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
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  // jsdom lays nothing out and implements no scrolling; the scroll policy
  // still runs on the arriving page.
  Element.prototype.scrollTo ??= () => {};
  window.scrollTo ??= () => {};
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  playback = new HostAnimation();
  // Keep the host paused: a held animation never reaches the Web Animations
  // API, which jsdom does not implement.
  playback.pause();
  runs.length = 0;
  states.length = 0;
});
afterEach(async () => {
  await act(() => root.unmount());
  host.remove();
});

function Status() {
  const transition = useSsgoiTransition();
  useEffect(() => {
    states.push(transition);
  }, [transition]);
  return (
    <output data-status={transition.status}>
      {transition.from} → {transition.to} ({transition.direction})
    </output>
  );
}

function App({ page }: { page: string }) {
  return (
    <Ssgoi config={config} host={playback}>
      <Status />
      <div key={page} data-ssgoi-transition={page}>
        {page}
      </div>
    </Ssgoi>
  );
}

const render = async (node: ReactNode) => {
  await act(() => root.render(node));
};
const status = () => host.querySelector("output")!;
const settle = async () => {
  // MutationObserver batch, pairing, then the run's own microtasks.
  for (let i = 0; i < 20; i++) await act(() => Promise.resolve());
};

it("re-renders consumers through a matched navigation and back to idle", async () => {
  await render(<App page="/list" />);
  await settle();
  expect(status().dataset.status).toBe("idle");

  await render(<App page="/detail" />);
  await settle();
  expect(runs).toHaveLength(1);
  expect(status().dataset.status).toBe("transitioning");
  expect(status().textContent).toBe("/list → /detail (forward)");

  await act(() => playback.complete());
  expect(status().dataset.status).toBe("idle");
  expect(states.map((s) => s.status)).toEqual([
    "idle",
    "transitioning",
    "idle",
  ]);
});

it("reads idle on the server and throws outside the provider", () => {
  expect(
    renderToString(
      <Ssgoi config={config}>
        <Status />
      </Ssgoi>,
    ),
  ).toContain('data-status="idle"');

  const report = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(() => renderToString(<Status />)).toThrow(
    "useSsgoiTransition must be used within <Ssgoi>",
  );
  report.mockRestore();
});
