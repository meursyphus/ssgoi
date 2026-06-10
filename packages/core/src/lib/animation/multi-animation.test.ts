import { describe, expect, it, vi } from "vitest";
import type { Pose, Timeline } from "@types";
import { Animation } from "./animation";
import { MultiAnimation } from "./multi-animation";
import { SpringIntegrator } from "./integrator";
import { WebAnimation } from "./web-animation";

class RecordingAnimation extends Animation {
  received: Pose[][] = [];
  play(): void {}
  reverse(): void {}
  pause(): void {}
  complete(): void {
    this.onComplete?.();
  }
  getPose(): Pose[] {
    return [];
  }
  getTimeline(): Timeline[] {
    return [];
  }
  matchInto(poses: Pose[]): void {
    this.received.push(poses);
  }
  get isAnimating(): boolean {
    return false;
  }
  get isPaused(): boolean {
    return false;
  }
  get isComplete(): boolean {
    return false;
  }
  get isReversing(): boolean {
    return false;
  }
  get progress(): number {
    return 0;
  }
  findTimeForProgress(): number | null {
    return null;
  }
}

const createFakeElement = () => {
  const animate = vi.fn(() => ({
    playbackRate: 1,
    onfinish: null,
    cancel: vi.fn(),
    pause: vi.fn(),
    play: vi.fn(),
  }));
  const element = { style: {}, animate } as unknown as HTMLElement;
  return { element, animate };
};

describe("MultiAnimation.matchInto", () => {
  it("fans poses out to every child", () => {
    const a = new RecordingAnimation();
    const b = new RecordingAnimation();
    const multi = new MultiAnimation([a, b]);
    const poses: Pose[] = [
      { element: {} as HTMLElement, value: 0.5, velocity: 1, key: "out" },
    ];
    multi.matchInto(poses);
    expect(a.received).toEqual([poses]);
    expect(b.received).toEqual([poses]);
  });

  it("resumes an interrupted sequence from the right stage", () => {
    // Hidden-mode reverse: A→B fade interrupted at out t=0.6 by B→A. The
    // same real nodes flip roles — A (was "out" at 0.6) is now the in side,
    // B (was "in", never started) is now the out side. Element identity +
    // role flip mirrors both: B's out child seeds at 1 − 0 = 1 (already
    // done), A's in child seeds at 1 − 0.6 = 0.4 (re-enter from where the
    // page visually is).
    const outSide = createFakeElement(); // element B
    const inSide = createFakeElement(); // element A
    const spring = () => new SpringIntegrator({ stiffness: 300, damping: 30 });

    const outAnim = new WebAnimation({
      element: outSide.element,
      key: "out",
      integrator: spring(),
      style: (_t, u) => ({ opacity: u }),
    });
    const inAnim = new WebAnimation({
      element: inSide.element,
      key: "in",
      integrator: spring(),
      style: (t) => ({ opacity: t }),
    });
    const multi = new MultiAnimation([outAnim, inAnim], { mode: "sequence" });

    const priorPoses: Pose[] = [
      { element: inSide.element, value: 0.6, velocity: 2, key: "out" },
      { element: outSide.element, value: 0, velocity: 0, key: "in" },
    ];
    multi.matchInto(priorPoses);
    multi.play();

    // Out child was seeded at its target → settled instantly; only the
    // zero-duration forwards-fill hold ran, no real WAAPI animation.
    expect(outSide.animate).toHaveBeenCalledTimes(1);
    expect(outAnim.isComplete).toBe(true);

    // In child started immediately (no sequence wait) from mirrored 0.4.
    expect(inSide.animate).toHaveBeenCalledTimes(1);
    expect(inAnim.progress).toBeCloseTo(0.4, 1);
    expect(multi.isComplete).toBe(false);
  });
});
