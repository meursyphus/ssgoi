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
