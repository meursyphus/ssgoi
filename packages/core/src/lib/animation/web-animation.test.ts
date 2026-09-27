import { afterEach, describe, expect, it, vi } from "vitest";
import type { Integrator } from "./integrator";
import { WebAnimation } from "./web-animation";

const testIntegrator: Integrator = {
  step(state, target, dt) {
    const direction = Math.sign(target - state.position);
    if (direction === 0) return { position: target, velocity: 0 };
    const velocity = direction * 10;
    const position = state.position + velocity * dt;
    const reached = direction > 0 ? position >= target : position <= target;
    return {
      position: reached ? target : position,
      velocity: reached ? 0 : velocity,
    };
  },
  isSettled(state, target) {
    return Math.abs(state.position - target) < 0.001;
  },
};

function createReady<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function createFakeElement(waapi: globalThis.Animation) {
  const style: Record<string, string> = { opacity: "0" };
  const element = {
    style,
    animate: vi.fn(() => waapi),
  } as unknown as HTMLElement;
  return { element, style };
}

function createFakeWaapi() {
  const ready = createReady<globalThis.Animation>();
  const calls: string[] = [];
  let currentTime: CSSNumberish | null = 0;
  let running = true;
  const waapi = {
    get currentTime() {
      return currentTime;
    },
    set currentTime(value: CSSNumberish | null) {
      calls.push("seek");
      currentTime = value;
    },
    playbackRate: 1,
    ready: ready.promise,
    onfinish: null,
    play: vi.fn(() => {
      calls.push("play");
      running = true;
    }),
    pause: vi.fn(() => {
      calls.push("pause");
      running = false;
    }),
    cancel: vi.fn(),
  } as unknown as globalThis.Animation;
  return {
    waapi,
    ready,
    calls,
    advance(ms: number) {
      if (running && typeof currentTime === "number") {
        currentTime += ms * waapi.playbackRate;
      }
    },
  };
}

function installAnimationFrameHarness() {
  let now = 0;
  let nextId = 0;
  let queue = new Map<number, FrameRequestCallback>();

  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      const id = nextId++;
      queue.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((id: number) => {
      queue.delete(id);
    }),
  );

  return {
    get pending() {
      return queue.size;
    },
    flush(delta = 1000 / 60) {
      const callbacks = [...queue.values()];
      queue = new Map();
      now += delta;
      for (const callback of callbacks) callback(now);
    },
  };
}

describe("WebAnimation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("plays natively from creation, one nominal frame in, and clears the inline start style at once", () => {
    const frames = installAnimationFrameHarness();
    const { waapi, calls, advance } = createFakeWaapi();
    const { element, style } = createFakeElement(waapi);
    const animation = new WebAnimation({
      element,
      integrator: testIntegrator,
      style: (t) => ({ opacity: t }),
    });

    animation.play();

    // Element.animate() auto-plays; nothing pauses it, nothing waits on a
    // frame clock, and the effect owns the start style from now on.
    expect(calls).toEqual(["seek"]);
    expect(waapi.pause).not.toHaveBeenCalled();
    expect(waapi.play).not.toHaveBeenCalled();
    expect(waapi.currentTime).toBeCloseTo(1000 / 60);
    expect(style.opacity).toBe("");
    expect(frames.pending).toBe(0);
    expect(animation.isAnimating).toBe(true);

    advance(16);
    const [pose] = animation.getPose();
    expect(pose?.value).toBeGreaterThan(0.31);
    expect(pose?.value).toBeLessThan(0.34);
  });

  it("scales the initial seek by the playback rate", () => {
    installAnimationFrameHarness();
    const { waapi, calls } = createFakeWaapi();
    const { element } = createFakeElement(waapi);
    const animation = new WebAnimation({
      element,
      integrator: testIntegrator,
      style: (t) => ({ opacity: t }),
    });
    animation.playbackRate = 2;
    animation.play();
    expect(waapi.playbackRate).toBe(2);
    expect(calls).toEqual(["seek"]);
    expect(waapi.currentTime).toBeCloseTo(1000 / 30);
  });

  it("starts a negative playback rate through play() so WAAPI rewinds to the end", () => {
    installAnimationFrameHarness();
    const { waapi, calls } = createFakeWaapi();
    const { element } = createFakeElement(waapi);
    const animation = new WebAnimation({
      element,
      integrator: testIntegrator,
      style: (t) => ({ opacity: t }),
    });
    animation.playbackRate = -1;
    animation.play();
    expect(waapi.playbackRate).toBe(-1);
    expect(calls).toEqual(["play"]);
  });

  it("resumes the same WAAPI run after a pause", () => {
    installAnimationFrameHarness();
    const { waapi, calls, advance } = createFakeWaapi();
    const { element } = createFakeElement(waapi);
    const animation = new WebAnimation({
      element,
      integrator: testIntegrator,
      style: (t) => ({ opacity: t }),
    });
    animation.play();
    advance(20);
    animation.pause();
    expect(animation.isPaused).toBe(true);
    animation.play();
    expect(calls).toEqual(["seek", "pause", "play"]);
    expect(element.animate).toHaveBeenCalledTimes(1);
    expect(animation.isAnimating).toBe(true);
  });

  it("samples live pose from WAAPI currentTime", () => {
    const { waapi } = createFakeWaapi();
    const { element } = createFakeElement(waapi);
    const animation = new WebAnimation({
      element,
      integrator: testIntegrator,
      style: (t) => ({ opacity: t }),
    });

    animation.play();
    waapi.currentTime = 50;

    const [pose] = animation.getPose();

    expect(pose?.value).toBeGreaterThan(0.45);
    expect(pose?.value).toBeLessThan(0.55);
  });
});
