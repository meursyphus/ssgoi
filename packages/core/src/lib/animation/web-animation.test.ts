import { describe, expect, it, vi } from "vitest";
import { SpringIntegrator } from "./integrator";
import { WebAnimation } from "./web-animation";

type AnimateCall = {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
};

type FakeWaapi = {
  playbackRate: number;
  onfinish: (() => void) | null;
  cancel: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
};

const createFakeElement = () => {
  const calls: AnimateCall[] = [];
  const waapis: FakeWaapi[] = [];
  const element = {
    style: {} as Record<string, string>,
    animate: vi.fn(
      (keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
        const waapi: FakeWaapi = {
          playbackRate: 1,
          onfinish: null,
          cancel: vi.fn(),
          pause: vi.fn(),
          play: vi.fn(),
        };
        calls.push({ keyframes, options });
        waapis.push(waapi);
        return waapi as unknown as globalThis.Animation;
      },
    ),
  } as unknown as HTMLElement & { animate: ReturnType<typeof vi.fn> };
  return { element, calls, waapis };
};

const springAnimation = (
  element: HTMLElement,
  overrides: Partial<ConstructorParameters<typeof WebAnimation>[0]> = {},
) =>
  new WebAnimation({
    element,
    integrator: new SpringIntegrator({ stiffness: 300, damping: 30 }),
    style: (t) => ({ opacity: t }),
    ...overrides,
  });

describe("WebAnimation pose handoff", () => {
  it("exposes key and bounds on getPose", () => {
    const { element } = createFakeElement();
    const animation = springAnimation(element, {
      key: "out",
      lowerBound: 0,
      upperBound: 100,
    });
    expect(animation.getPose()).toEqual([
      {
        element,
        value: 0,
        velocity: 0,
        key: "out",
        lowerBound: 0,
        upperBound: 100,
      },
    ]);
  });

  it("seeds directly from a same-element same-key pose", () => {
    const { element } = createFakeElement();
    const animation = springAnimation(element, { key: "out" });
    animation.matchInto([{ element, value: 0.7, velocity: -2, key: "out" }]);
    const [pose] = animation.getPose();
    expect(pose!.value).toBeCloseTo(0.7);
    expect(pose!.velocity).toBeCloseTo(-2);
  });

  it("seeds mirrored when the element's role flips", () => {
    const { element } = createFakeElement();
    const animation = springAnimation(element, { key: "in" });
    animation.matchInto([{ element, value: 0.7, velocity: -2, key: "out" }]);
    const [pose] = animation.getPose();
    expect(pose!.value).toBeCloseTo(0.3);
    expect(pose!.velocity).toBeCloseTo(2);
  });

  it("seeds mirrored from a unique opposite-role pose on another element", () => {
    const { element } = createFakeElement();
    const previous = {} as HTMLElement;
    const animation = springAnimation(element, { key: "out" });
    animation.matchInto([
      { element: previous, value: 0.4, velocity: 1.5, key: "in" },
    ]);
    const [pose] = animation.getPose();
    expect(pose!.value).toBeCloseTo(0.6);
    expect(pose!.velocity).toBeCloseTo(-1.5);
  });

  it("rebases a pose into different bounds", () => {
    const { element } = createFakeElement();
    const animation = springAnimation(element, {
      key: "in",
      lowerBound: 0,
      upperBound: 200,
    });
    animation.matchInto([
      {
        element,
        value: 0.5,
        velocity: 1,
        key: "in",
        lowerBound: 0,
        upperBound: 1,
      },
    ]);
    const [pose] = animation.getPose();
    expect(pose!.value).toBeCloseTo(100);
    expect(pose!.velocity).toBeCloseTo(200);
  });

  it("keeps its resting state when nothing matches", () => {
    const { element } = createFakeElement();
    const animation = springAnimation(element, { key: "out" });
    animation.matchInto([
      { element: {} as HTMLElement, value: 0.9, velocity: 4, key: "out" },
      { element: {} as HTMLElement, value: 0.1, velocity: 1, key: "out" },
    ]);
    const [pose] = animation.getPose();
    expect(pose!.value).toBe(0);
    expect(pose!.velocity).toBe(0);
  });

  it("plays the seeded simulation from the handoff point", () => {
    const { element, calls } = createFakeElement();
    const animation = springAnimation(element, { key: "in" });
    animation.matchInto([{ element, value: 0.75, velocity: 0, key: "out" }]);
    animation.play();
    const first = calls[0]!.keyframes[0]!;
    // Seeded at mirrored 0.25 → the first baked keyframe styles t = 0.25.
    expect(Number(first.opacity)).toBeCloseTo(0.25);
  });

  it("completes instantly when seeded at the target, holding the final frame", () => {
    const { element, calls } = createFakeElement();
    const onComplete = vi.fn();
    const animation = springAnimation(element, { key: "out", onComplete });
    animation.matchInto([{ element, value: 0, velocity: 0, key: "in" }]);
    animation.play();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(animation.isComplete).toBe(true);
    // The final frame must be held by a forwards-filling WAAPI entry —
    // preset onComplete cleanups wipe inline styles, and without the fill
    // the element would pop back to its resting styles mid-run.
    expect(calls.length).toBe(1);
    expect(calls[0]!.options.duration).toBe(0);
    expect(calls[0]!.options.fill).toBe("forwards");
    expect(Number(calls[0]!.keyframes[0]!.opacity)).toBeCloseTo(1);
  });
});

describe("WebAnimation keyframe baking", () => {
  it("bakes monotonic offsets from 0 to 1", () => {
    const { element, calls } = createFakeElement();
    const animation = springAnimation(element);
    animation.play();

    const keyframes = calls[0]!.keyframes;
    expect(keyframes.length).toBeGreaterThanOrEqual(2);
    expect(keyframes[0]!.offset).toBe(0);
    expect(keyframes[keyframes.length - 1]!.offset).toBe(1);
    for (let i = 1; i < keyframes.length; i++) {
      expect(Number(keyframes[i]!.offset)).toBeGreaterThan(
        Number(keyframes[i - 1]!.offset),
      );
    }
  });

  it("bakes fewer keyframes than simulated frames once the spring settles", () => {
    const { element, calls } = createFakeElement();
    // Tiny rest thresholds force a long, visually-still settle tail.
    const animation = springAnimation(element, {
      integrator: new SpringIntegrator({
        stiffness: 300,
        damping: 30,
        restDelta: 0.0001,
        restSpeed: 0.0001,
      }),
    });
    animation.play();

    const { keyframes, options } = calls[0]!;
    const simulatedFrames =
      Math.round((options.duration as number) / (1000 / 60)) + 1;
    expect(keyframes.length).toBeLessThan(simulatedFrames * 0.8);
  });

  it("does not leak the offset key into inline style clearing", () => {
    const { element } = createFakeElement();
    const style = (element as unknown as { style: Record<string, string> })
      .style;
    style.opacity = "0.5";
    style.offset = "preexisting";
    const animation = springAnimation(element);
    animation.play();
    expect(style.opacity).toBe("");
    expect(style.offset).toBe("preexisting");
  });
});
