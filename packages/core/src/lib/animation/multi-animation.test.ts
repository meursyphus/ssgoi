import { afterEach, describe, expect, it, vi } from "vitest";
import type { Pose, Timeline } from "@types";
import { Animation } from "./animation";
import { MultiAnimation } from "./multi-animation";

class FakeAnimation extends Animation {
  value = 0;
  animating = false;
  completeState = false;
  play = vi.fn(() => {
    this.animating = true;
  });
  reverse = vi.fn(() => {
    this.animating = true;
  });
  pause = vi.fn(() => {
    this.animating = false;
  });
  complete = vi.fn(() => {
    this.animating = false;
    this.completeState = true;
    this.value = 1;
    this.onComplete?.();
  });
  getPose(): Pose[] {
    return [];
  }
  getTimeline(): Timeline[] {
    return [];
  }
  matchInto(): void {}
  get isAnimating(): boolean {
    return this.animating;
  }
  get isPaused(): boolean {
    return !this.animating && !this.completeState;
  }
  get isComplete(): boolean {
    return this.completeState;
  }
  get isReversing(): boolean {
    return false;
  }
  get progress(): number {
    return this.value;
  }
  findTimeForProgress(): number | null {
    return 100;
  }
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
    flush(delta = 1000 / 60) {
      const callbacks = [...queue.values()];
      queue = new Map();
      now += delta;
      for (const callback of callbacks) callback(now);
    },
  };
}

describe("MultiAnimation", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("starts staggered children from actual progress, not wall time", () => {
    vi.useFakeTimers();
    const frames = installAnimationFrameHarness();
    const first = new FakeAnimation();
    const second = new FakeAnimation();
    const animation = new MultiAnimation([first, second], {
      mode: "parallel",
      startAt: [0, 0.5],
    });

    animation.play();
    expect(first.play).toHaveBeenCalledTimes(1);
    expect(second.play).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(second.play).not.toHaveBeenCalled();

    first.value = 0.5;
    frames.flush();
    expect(second.play).toHaveBeenCalledTimes(1);
  });
});

describe("named start conditions", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("does not dilute progress with empty optional groups", () => {
    const main = new FakeAnimation();
    const animation = new MultiAnimation({
      main,
      optional: new MultiAnimation({ nested: new MultiAnimation([]) }),
    });
    expect(animation.progress).toBe(0);
    main.value = 0.4;
    expect(animation.progress).toBe(0.4);
    main.complete();
    expect(animation.progress).toBe(1);
  });

  it("distinguishes first crossing at 1 from actual settling", () => {
    const frames = installAnimationFrameHarness();
    const outgoing = new FakeAnimation();
    const crossing = new FakeAnimation();
    const settled = new FakeAnimation();
    const animation = new MultiAnimation({ outgoing, crossing, settled });
    crossing.set({ startAt: { after: outgoing, at: 1 } });
    settled.set({ startAt: { after: outgoing, at: "settled" } });
    animation.play();
    outgoing.value = 1;
    frames.flush();
    expect(crossing.play).toHaveBeenCalledTimes(1);
    expect(settled.play).not.toHaveBeenCalled();
    outgoing.complete();
    frames.flush();
    expect(settled.play).toHaveBeenCalledTimes(1);
    animation.complete();
  });

  it("supports sibling dependencies independently of insertion order", () => {
    const frames = installAnimationFrameHarness();
    const first = new FakeAnimation();
    const second = new FakeAnimation();
    const animation = new MultiAnimation({ first, second });
    first.set({ startAt: { after: second, at: 0.3 } });
    animation.play();
    expect(first.play).not.toHaveBeenCalled();
    expect(second.play).toHaveBeenCalledTimes(1);
    second.value = 0.3;
    frames.flush();
    expect(first.play).toHaveBeenCalledTimes(1);
    animation.complete();
  });

  it("retains legacy chained zero offsets after a stagger", () => {
    const frames = installAnimationFrameHarness();
    const first = new FakeAnimation(),
      second = new FakeAnimation(),
      third = new FakeAnimation();
    const animation = new MultiAnimation([first, second, third], {
      startAt: [0, 0.4, 0],
    });
    animation.play();
    expect(second.play).not.toHaveBeenCalled();
    expect(third.play).not.toHaveBeenCalled();
    first.value = 0.4;
    frames.flush();
    expect(second.play).toHaveBeenCalledTimes(1);
    expect(third.play).toHaveBeenCalledTimes(1);
    animation.complete();
  });

  it("rejects cycles and references outside the parent before starting", () => {
    const first = new FakeAnimation(),
      second = new FakeAnimation(),
      foreign = new FakeAnimation();
    const animation = new MultiAnimation({ first, second });
    first.set({ startAt: { after: second, at: 0.5 } });
    second.set({ startAt: { after: first, at: 0.5 } });
    expect(() => animation.play()).toThrow("cycle");
    expect(first.play).not.toHaveBeenCalled();
    second.set({ startAt: null });
    first.set({ startAt: { after: foreign, at: 0.5 } });
    expect(() => animation.play()).toThrow("sibling");
    expect(() => first.set({ startAt: { after: second, at: NaN } })).toThrow(
      "progress",
    );
    expect(() => first.set({ startAt: { after: first, at: 0 } })).toThrow(
      "itself",
    );
  });

  it("does not accumulate completion callbacks across replay or forced completion", () => {
    const first = new FakeAnimation(),
      second = new FakeAnimation();
    const animation = new MultiAnimation({ first, second });
    const childComplete = vi.fn(),
      complete = vi.fn();
    first.onComplete = childComplete;
    animation.onComplete = complete;
    animation.play();
    first.complete();
    second.complete();
    expect(complete).toHaveBeenCalledTimes(1);
    expect(first.onComplete).toBe(childComplete);
    animation.play();
    first.complete();
    expect(complete).toHaveBeenCalledTimes(1);
    second.complete();
    expect(complete).toHaveBeenCalledTimes(2);
    animation.play();
    animation.complete();
    expect(complete).toHaveBeenCalledTimes(3);
    expect(childComplete).toHaveBeenCalledTimes(3);
  });
});
