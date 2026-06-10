import { describe, expect, it } from "vitest";
import type { Pose, Timeline } from "@types";
import { Animation } from "./animation";
import { HostAnimation } from "./host-animation";

class FakeAnimation extends Animation {
  poses: Pose[];
  received: Pose[][] = [];
  playCount = 0;
  reverseCount = 0;
  pauseCount = 0;
  completeCount = 0;

  constructor(poses: Pose[] = []) {
    super();
    this.poses = poses;
  }
  play(): void {
    this.playCount++;
  }
  reverse(): void {
    this.reverseCount++;
  }
  pause(): void {
    this.pauseCount++;
  }
  complete(): void {
    this.completeCount++;
    this.onComplete?.();
  }
  getPose(): Pose[] {
    return this.poses;
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
    return this.completeCount > 0;
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

describe("HostAnimation.attach", () => {
  it("plays the first attached animation without a handoff", () => {
    const host = new HostAnimation();
    const first = new FakeAnimation();
    host.attach(first);
    expect(first.playCount).toBe(1);
    expect(first.received).toEqual([]);
  });

  it("hands the prior child's live pose to the next and completes it", () => {
    const host = new HostAnimation();
    const pose: Pose = {
      element: {} as HTMLElement,
      value: 0.7,
      velocity: -2,
      key: "out",
    };
    const first = new FakeAnimation([pose]);
    const second = new FakeAnimation();

    host.attach(first);
    host.attach(second);

    expect(first.completeCount).toBe(1);
    expect(second.received).toEqual([[pose]]);
    expect(second.playCount).toBe(1);
    expect(host.activeChild).toBe(second);
  });

  it("carries the host playbackRate onto attached children", () => {
    const host = new HostAnimation();
    host.playbackRate = 2;
    const child = new FakeAnimation();
    host.attach(child);
    expect(child.playbackRate).toBe(2);
  });

  it("keeps a paused host paused across a handoff", () => {
    const host = new HostAnimation();
    const first = new FakeAnimation();
    host.attach(first);
    host.pause();
    const second = new FakeAnimation();
    host.attach(second);
    expect(second.pauseCount).toBe(1);
    expect(second.playCount).toBe(0);
  });

  it("supports a two-step flush → attach handoff", () => {
    // The dispatcher flushes the interrupted run BEFORE building the next
    // animation (so the settled run's style cleanups land first), then
    // hands the captured poses to attach.
    const host = new HostAnimation();
    const pose: Pose = {
      element: {} as HTMLElement,
      value: 0.4,
      velocity: 1,
      key: "in",
    };
    const first = new FakeAnimation([pose]);
    host.attach(first);

    const poses = host.flush();
    expect(poses).toEqual([pose]);
    expect(first.completeCount).toBe(1);
    expect(host.activeChild).toBeNull();

    const second = new FakeAnimation();
    host.attach(second, poses);
    expect(second.received).toEqual([[pose]]);
    // Host state survived the flush — it was not reset to idle.
    expect(second.playCount).toBe(1);
  });

  it("returns to idle once the active child settles", () => {
    const host = new HostAnimation();
    const child = new FakeAnimation();
    host.attach(child);
    child.complete();
    expect(host.activeChild).toBeNull();
    expect(host.isComplete).toBe(true);
  });
});
