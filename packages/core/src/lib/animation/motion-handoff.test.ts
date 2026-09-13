import { afterEach, describe, it, expect, vi } from "vitest";
import { WebAnimation } from "./web-animation";
import { HostAnimation } from "./host-animation";
import { MultiAnimation } from "./multi-animation";
import { SpringIntegrator } from "./integrator";
import { createWebPresentationCodec, readTransform } from "./web-presentation";
import type { StyleObject } from "../runtime/motion-state";

function node(width = 400, height = 600, left = 0, top = 0) {
  const animations: Array<{
    frames: Keyframe[];
    duration: number;
    waapi: globalThis.Animation;
  }> = [];
  const element = {
    offsetWidth: width,
    offsetHeight: height,
    style: {} as Record<string, string>,
    getBoundingClientRect: () => ({ left, top, width, height }),
    contains: (el: HTMLElement) => el === element,
    animate: vi.fn((frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const waapi = {
        currentTime: 0,
        playbackRate: 1,
        ready: new Promise(() => {}),
        pause: vi.fn(),
        play: vi.fn(),
        cancel: vi.fn(),
        onfinish: null,
      } as unknown as globalThis.Animation;
      animations.push({ frames, duration: Number(options.duration), waapi });
      return waapi;
    }),
  } as unknown as HTMLElement;
  return {
    element,
    animations,
    last: () => animations[animations.length - 1]!,
  };
}
const spring = () => new SpringIntegrator({ stiffness: 100, damping: 18 });
const track = (
  element: HTMLElement,
  style: (t: number, u: number) => StyleObject,
) => new WebAnimation({ element, integrator: spring(), style });
afterEach(() => vi.unstubAllGlobals());
describe("web presentation matching", () => {
  it("canonicalizes percentage translation and changed transform origins/box sizes", () => {
    expect(readTransform("translate3d(50%, 0, 0)", 400, 600)).toEqual([
      1, 0, 0, 1, 200, 0,
    ]);
    const from = node(100, 80, 20, 30),
      to = node(400, 300, 0, 0);
    const a = createWebPresentationCodec(from.element),
      b = createWebPresentationCodec(to.element);
    const snapshot = a.read({ transform: "translate(30px, 40px) scale(2)" });
    const converted = b.write(snapshot);
    const roundtrip = b.read(converted);
    expect(roundtrip.transform?.value).toEqual(snapshot.transform?.value);
  });
  it("bridges opposite effect mappings without copying scalar progress", () => {
    const el = node();
    const host = new HostAnimation();
    const a = track(el.element, (_t, u) => ({
      transform: `translateX(${u * 100}%)`,
      opacity: 1,
    }));
    const cleanup = vi.fn();
    a.onDispose = cleanup;
    host.attach(a);
    el.last().waapi.currentTime = 120;
    const source = a.getMotionSnapshot();
    const b = track(el.element, (t) => ({
      transform: `translateX(${-t * 100}%)`,
      opacity: 1,
    }));
    host.attach(b);
    const first = el.last().frames[0]!;
    const channels = createWebPresentationCodec(el.element).read(
      first as StyleObject,
    );
    expect(channels.transform?.value[0]).toBeCloseTo(
      source.channels.transform!.value[0]!,
      6,
    );
    expect(b.getPose()[0]?.value).toBe(0);
    expect(cleanup).not.toHaveBeenCalled();
    host.cancel({ reason: "disposed", owns: () => true });
  });
  it("reuses semantic shared-media keys across different nodes", () => {
    const a = node(120, 90, 10, 20),
      b = node(400, 300, 0, 0),
      space = {};
    const host = new HostAnimation(),
      events = vi.fn();
    host.onHandoff = events;
    const old = new WebAnimation({
      element: a.element,
      integrator: spring(),
      style: (t) => ({ transform: `translateX(${100 * t}px)` }),
      motion: { key: "photo42", role: "shared", space },
    });
    host.attach(old);
    a.last().waapi.currentTime = 120;
    const source = old.getMotionSnapshot();
    const next = new WebAnimation({
      element: b.element,
      integrator: spring(),
      style: () => ({ transform: "none" }),
      motion: { key: "photo42", role: "shared", space },
    });
    host.attach(next);
    const decoded = createWebPresentationCodec(b.element).read(
      b.last().frames[0] as StyleObject,
    );
    decoded.transform?.value.forEach((value, i) =>
      expect(value).toBeCloseTo(source.channels.transform!.value[i]!, 8),
    );
    expect(events.mock.lastCall?.[0]).toContainEqual({
      kind: "key",
      target: b.element,
      key: "photo42",
    });
    host.cancel({ reason: "disposed", owns: () => true });
  });
  it("does not fire a superseded completion callback or leave its WAAPI execution alive", () => {
    const el = node(),
      host = new HostAnimation();
    const old = track(el.element, (t) => ({ opacity: t })),
      done = vi.fn();
    old.onComplete = done;
    host.attach(old);
    const waapi = el.last().waapi;
    host.attach(track(el.element, (_t, u) => ({ opacity: u })));
    waapi.onfinish?.({} as AnimationPlaybackEvent);
    expect(done).not.toHaveBeenCalled();
    expect(waapi.cancel).toHaveBeenCalled();
    host.cancel({ reason: "disposed", owns: () => true });
  });
  it("retains and reclaims A across A/B then B/C then C/A", () => {
    const a = node(),
      b = node(),
      c = node(),
      host = new HostAnimation();
    const pair = (from: HTMLElement, to: HTMLElement) =>
      new MultiAnimation([
        track(from, (_t, u) => ({ opacity: u })),
        track(to, (t) => ({ opacity: t })),
      ]);
    host.attach(pair(a.element, b.element));
    host.attach(pair(b.element, c.element));
    expect(host.retiringCount).toBe(1);
    const events = vi.fn();
    host.onHandoff = events;
    host.attach(pair(c.element, a.element));
    expect(events.mock.lastCall?.[0]).toContainEqual({
      kind: "element",
      target: a.element,
      key: undefined,
    });
    host.cancel({ reason: "disposed", owns: () => true });
    expect(host.retiringCount).toBe(0);
  });
});

describe("handoff boundaries", () => {
  it("keeps a delayed adopted target held without triggering its new dependency early", () => {
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 1),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const el = node(),
      dependencyNode = node(),
      host = new HostAnimation();
    const old = track(el.element, (t) => ({ opacity: t }));
    host.attach(old);
    el.last().waapi.currentTime = 120;
    const dependency = track(dependencyNode.element, (t) => ({ opacity: t }));
    const delayed = track(el.element, (_t, u) => ({ opacity: u }));
    delayed.set({ startAt: { after: dependency, at: "settled" } });
    host.attach(new MultiAnimation([dependency, delayed]));
    expect(delayed.isAnimating).toBe(false);
    expect(
      delayed.getMotionSnapshot().channels.opacity?.value[0],
    ).toBeGreaterThan(0);
    host.cancel({ reason: "disposed", owns: () => true });
  });
  it("samples the final frame after WAAPI fill has been released", () => {
    const el = node(),
      animation = track(el.element, (t) => ({ opacity: t }));
    animation.play();
    el.last().waapi.onfinish?.({} as AnimationPlaybackEvent);
    expect(animation.isComplete).toBe(true);
    expect(
      animation.getMotionSnapshot().channels.opacity?.value[0],
    ).toBeCloseTo(1);
    expect(animation.getMotionSnapshot().channels.opacity?.velocity[0]).toBe(0);
  });
  it("restores a persistent page even when the next effect has no page tracks", () => {
    const el = node(),
      host = new HostAnimation();
    host.attach(
      track(el.element, (_t, u) => ({ transform: `translateX(${u * 100}%)` })),
      { targets: [el.element] },
    );
    el.last().waapi.currentTime = 120;
    const next = new MultiAnimation([]);
    host.attach(next, { targets: [el.element] });
    expect(host.activeChild?.getMotionTracks()).toHaveLength(1);
    const source = host.activeChild?.getMotionTracks()[0]?.getMotionSnapshot();
    expect(source?.channels.transform?.value[0]).toBeGreaterThan(0);
    host.cancel({ reason: "disposed", owns: () => true });
  });
  it("validates dependencies before replacing an active execution", () => {
    const host = new HostAnimation(),
      oldNode = node(),
      otherNode = node();
    const old = track(oldNode.element, (t) => ({ opacity: t }));
    host.attach(old);
    const a = track(otherNode.element, (t) => ({ opacity: t })),
      b = track(oldNode.element, (t) => ({ opacity: t }));
    a.set({ startAt: { after: b, at: 1 } });
    b.set({ startAt: { after: a, at: 1 } });
    expect(() => host.attach(new MultiAnimation([a, b]))).toThrow("cycle");
    expect(host.activeChild).toBe(old);
    expect(old.isAnimating).toBe(true);
    host.cancel({ reason: "disposed", owns: () => true });
  });
  it("does not claim strict continuity for incompatible custom schemas", () => {
    const el = node(),
      host = new HostAnimation();
    host.attach(
      track(el.element, (t) => ({ clipPath: `circle(${25 + t}% at 50% 50%)` })),
    );
    const next = track(el.element, (t) => ({
      clipPath: `inset(${t}px 0px 0px 0px)`,
    }));
    host.attach(next);
    expect(next.handoffFallbacks).toContain("clipPath");
    expect(next.handoffFallbackMode).toBe("finish"); // no DOM-copy capability in this target
    host.cancel({ reason: "disposed", owns: () => true });
  });
});

it("treats a new navigation as new intent after a playback reversal", () => {
  const el = node(),
    host = new HostAnimation();
  const first = track(el.element, (t) => ({ opacity: t }));
  host.attach(first);
  el.last().waapi.currentTime = 100;
  host.reverse();
  expect(first.isReversing).toBe(true);
  const next = track(el.element, (t) => ({ opacity: t }));
  host.attach(next);
  expect(next.isReversing).toBe(false);
  host.cancel({ reason: "disposed", owns: () => true });
});

it("reports a cleanup error without blocking sibling completion or host settlement", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const a = node(),
    b = node(),
    host = new HostAnimation();
  const first = track(a.element, (t) => ({ opacity: t })),
    second = track(b.element, (t) => ({ opacity: t }));
  first.onDispose = () => {
    throw new Error("cleanup error");
  };
  host.attach(new MultiAnimation([first, second]));
  host.complete();
  expect(host.isComplete).toBe(true);
  expect(second.isComplete).toBe(true);
  expect(error).toHaveBeenCalledOnce();
  error.mockRestore();
});

it("rejects nonfinite correction horizons before allocating a timeline", () => {
  const el = node();
  const animation = new WebAnimation({
    element: el.element,
    integrator: spring(),
    style: (t) => ({ opacity: t }),
    motion: { handoffDuration: Infinity },
  });
  expect(() => animation.play()).toThrow("handoffDuration");
  expect(el.element.animate).not.toHaveBeenCalled();
  expect(readTransform("translateX(20vw)", 400, 600)).toBeNull();
});

it("uses the shared fade when an effect-specific release factory fails", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const a = node(),
    b = node(),
    host = new HostAnimation();
  const old = track(a.element, (t) => ({ opacity: t }));
  old.motion.release = () => {
    throw new Error("invalid effect release");
  };
  host.attach(old);
  const events = vi.fn();
  host.onHandoff = events;
  expect(() =>
    host.attach(track(b.element, (t) => ({ opacity: t }))),
  ).not.toThrow();
  expect(events.mock.lastCall?.[0]).toContainEqual({
    kind: "fallback",
    target: a.element,
  });
  expect(host.retiringCount).toBe(1);
  host.complete();
  expect(host.retiringCount).toBe(0);
  error.mockRestore();
});

it("bounds retiring executions under sustained interruption and disposes each once", () => {
  const host = new HostAnimation(),
    cleanups = [] as ReturnType<typeof vi.fn>[];
  for (let i = 0; i < 20; i++) {
    const el = node(),
      animation = track(el.element, (t) => ({ opacity: t }));
    const cleanup = vi.fn();
    cleanups.push(cleanup);
    animation.onDispose = cleanup;
    host.attach(animation);
    expect(host.retiringCount).toBeLessThanOrEqual(8);
  }
  host.complete();
  expect(host.retiringCount).toBe(0);
  for (const cleanup of cleanups) expect(cleanup).toHaveBeenCalledOnce();
});

it("keeps legacy constructor completion cleanup on the explicit finish fallback", () => {
  const el = node(),
    host = new HostAnimation(),
    cleanup = vi.fn();
  const old = new WebAnimation({
    element: el.element,
    integrator: spring(),
    style: (t) => ({ opacity: t }),
    onComplete: cleanup,
  });
  host.attach(old);
  expect(old.supportsInterruption).toBe(false);
  host.attach(track(el.element, (_t, u) => ({ opacity: u })));
  expect(cleanup).toHaveBeenCalledOnce();
  host.complete();
});
