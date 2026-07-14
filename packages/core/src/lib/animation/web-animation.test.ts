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

  it("frame-paces startup before handing playback to WAAPI", async () => {
    const frames = installAnimationFrameHarness();
    const { waapi, ready, calls, advance } = createFakeWaapi();
    const { element, style } = createFakeElement(waapi);
    const animation = new WebAnimation({
      element,
      integrator: testIntegrator,
      style: (t) => ({ opacity: t }),
    });

    animation.play();

    expect(calls).toEqual(["seek", "pause"]);
    expect(waapi.pause).toHaveBeenCalledTimes(1);
    expect(waapi.currentTime).toBe(0);
    expect(waapi.play).not.toHaveBeenCalled();
    expect(style.opacity).toBe("0");

    advance(1000);
    expect(waapi.currentTime).toBe(0);

    ready.resolve(waapi);
    await Promise.resolve();

    expect(frames.pending).toBe(1);
    frames.flush();
    expect(frames.pending).toBe(1);
    advance(1000);
    expect(waapi.currentTime).toBe(0);
    expect(waapi.play).not.toHaveBeenCalled();
    expect(style.opacity).toBe("0");

    frames.flush();
    await Promise.resolve();

    expect(style.opacity).toBe("");
    expect(waapi.play).not.toHaveBeenCalled();
    expect(waapi.currentTime).toBe(0);

    frames.flush();
    expect(waapi.play).not.toHaveBeenCalled();
    expect(waapi.currentTime).toBeCloseTo(1000 / 60);

    frames.flush();
    expect(waapi.play).toHaveBeenCalledTimes(1);
    expect(waapi.currentTime).toBeCloseTo(1000 / 30);

    advance(16);
    const [pose] = animation.getPose();
    expect(pose?.value).toBeGreaterThan(0.48);
    expect(pose?.value).toBeLessThan(0.5);
  });

  it("does not charge a long startup frame to animation progress", async () => {
    const frames = installAnimationFrameHarness();
    const { waapi, ready } = createFakeWaapi();
    const { element } = createFakeElement(waapi);
    const animation = new WebAnimation({
      element,
      integrator: testIntegrator,
      style: (t) => ({ opacity: t }),
    });

    animation.play();
    ready.resolve(waapi);
    await Promise.resolve();
    frames.flush();
    frames.flush();
    await Promise.resolve();

    frames.flush();
    expect(waapi.currentTime).toBeCloseTo(1000 / 60);

    frames.flush(1000);
    expect(waapi.currentTime).toBeCloseTo(50);
    expect(waapi.play).not.toHaveBeenCalled();

    frames.flush();
    expect(waapi.play).not.toHaveBeenCalled();
    frames.flush();
    expect(waapi.play).toHaveBeenCalledTimes(1);
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
