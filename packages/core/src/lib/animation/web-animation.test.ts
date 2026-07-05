import { describe, expect, it, vi } from "vitest";
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
  const waapi = {
    currentTime: null as CSSNumberish | null,
    playbackRate: 1,
    ready: ready.promise,
    onfinish: null,
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
  } as unknown as globalThis.Animation;
  return { waapi, ready };
}

describe("WebAnimation", () => {
  it("waits for WAAPI readiness before playing and clearing start styles", async () => {
    const { waapi, ready } = createFakeWaapi();
    const { element, style } = createFakeElement(waapi);
    const animation = new WebAnimation({
      element,
      integrator: testIntegrator,
      style: (t) => ({ opacity: t }),
    });

    animation.play();

    expect(waapi.pause).toHaveBeenCalledTimes(1);
    expect(waapi.currentTime).toBe(0);
    expect(waapi.play).not.toHaveBeenCalled();
    expect(style.opacity).toBe("0");

    ready.resolve(waapi);
    await Promise.resolve();

    expect(style.opacity).toBe("");
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
