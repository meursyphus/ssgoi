import { describe, expect, it, vi } from "vitest";
import { capturePoseFrom } from "./capture-pose";

type FakeExternalAnimation = {
  playState: AnimationPlayState;
  currentTime: number | null;
  playbackRate: number;
  cancel: ReturnType<typeof vi.fn>;
};

const createFakeAnimation = (
  currentTime: number,
  playState: AnimationPlayState = "running",
  playbackRate = 1,
): FakeExternalAnimation => ({
  playState,
  currentTime,
  playbackRate,
  cancel: vi.fn(),
});

const createElementWithAnimations = (
  animations: FakeExternalAnimation[],
): HTMLElement =>
  ({
    getAnimations: () => animations as unknown as globalThis.Animation[],
  }) as unknown as HTMLElement;

describe("capturePoseFrom", () => {
  it("returns null when the element has no running animations", () => {
    const finished = createFakeAnimation(500, "finished");
    expect(
      capturePoseFrom(createElementWithAnimations([]), { read: () => 0 }),
    ).toBeNull();
    expect(
      capturePoseFrom(createElementWithAnimations([finished]), {
        read: () => 0,
      }),
    ).toBeNull();
  });

  it("returns null when getAnimations is unavailable", () => {
    const element = {} as HTMLElement;
    expect(capturePoseFrom(element, { read: () => 0 })).toBeNull();
  });

  it("captures value and estimates velocity by rewinding playback", () => {
    const animation = createFakeAnimation(500);
    const element = createElementWithAnimations([animation]);
    // The external animation moves the value at 1 unit/sec: value = time/1000.
    const read = () => (animation.currentTime ?? 0) / 1000;

    const pose = capturePoseFrom(element, { read, key: "out" });

    expect(pose).not.toBeNull();
    expect(pose!.value).toBeCloseTo(0.5);
    expect(pose!.velocity).toBeCloseTo(1);
    expect(pose!.key).toBe("out");
    expect(pose!.lowerBound).toBe(0);
    expect(pose!.upperBound).toBe(1);
    // Playback position must be restored.
    expect(animation.currentTime).toBe(500);
    expect(animation.cancel).not.toHaveBeenCalled();
  });

  it("inverts the velocity sign for reversed playback", () => {
    // animation.reverse() → playbackRate -1: currentTime DECREASES over
    // wall time, so the visual past lives at a LATER local time.
    const animation = createFakeAnimation(500, "running", -1);
    const element = createElementWithAnimations([animation]);
    const read = () => (animation.currentTime ?? 0) / 1000;

    const pose = capturePoseFrom(element, { read });

    // On-screen value falls at 1 unit/sec.
    expect(pose!.velocity).toBeCloseTo(-1);
    expect(animation.currentTime).toBe(500);
  });

  it("scales velocity by the playback rate", () => {
    const animation = createFakeAnimation(500, "running", 2);
    const element = createElementWithAnimations([animation]);
    const read = () => (animation.currentTime ?? 0) / 1000;

    const pose = capturePoseFrom(element, { read });

    // Local value moves 1 unit/local-sec; at rate 2 that is 2 units/wall-sec.
    expect(pose!.velocity).toBeCloseTo(2);
  });

  it("treats rate-0 (frozen) animations as motionless", () => {
    // playbackRate = 0 freezes playback but playState still reports
    // "running" — sampling it would fake a velocity for a static element.
    const animation = createFakeAnimation(500, "running", 0);
    const element = createElementWithAnimations([animation]);
    const pose = capturePoseFrom(element, { read: () => 0.5 });

    expect(pose!.value).toBe(0.5);
    expect(pose!.velocity).toBe(0);
    expect(animation.currentTime).toBe(500);
  });

  it("skips future-scheduled animations (negative currentTime)", () => {
    // A future startTime gives a negative currentTime while "running";
    // seeking it forward would sample keyframes that were never on screen.
    const scheduled = createFakeAnimation(-1000);
    const element = createElementWithAnimations([scheduled]);
    const pose = capturePoseFrom(element, { read: () => 0.5 });

    expect(pose!.velocity).toBe(0);
    expect(scheduled.currentTime).toBe(-1000);
  });

  it("uses the achievable rewind window near the animation start", () => {
    const animation = createFakeAnimation(4);
    const element = createElementWithAnimations([animation]);
    const read = () => (animation.currentTime ?? 0) / 1000;

    const pose = capturePoseFrom(element, { read, sampleMs: 8 });

    // Only 4ms of rewind was possible — velocity still ~1 unit/sec.
    expect(pose!.velocity).toBeCloseTo(1);
    expect(animation.currentTime).toBe(4);
  });

  it("cancels the captured animations when asked", () => {
    const animation = createFakeAnimation(500);
    const element = createElementWithAnimations([animation]);
    const pose = capturePoseFrom(element, {
      read: () => 0.5,
      cancel: true,
    });
    expect(pose).not.toBeNull();
    expect(animation.cancel).toHaveBeenCalledTimes(1);
  });

  it("passes custom bounds through to the pose", () => {
    const animation = createFakeAnimation(500);
    const element = createElementWithAnimations([animation]);
    const pose = capturePoseFrom(element, {
      read: () => 120,
      lowerBound: 0,
      upperBound: 240,
    });
    expect(pose!.lowerBound).toBe(0);
    expect(pose!.upperBound).toBe(240);
    expect(pose!.value).toBe(120);
  });
});
