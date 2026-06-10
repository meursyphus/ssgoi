import { describe, expect, it } from "vitest";
import type { Pose } from "@types";
import { findPoseMatch, rebasePose } from "./pose-matching";

const el = () => ({}) as HTMLElement;

const pose = (overrides: Partial<Pose> & { element: HTMLElement }): Pose => ({
  value: 0,
  velocity: 0,
  ...overrides,
});

describe("findPoseMatch", () => {
  it("matches same element + same key directly", () => {
    const a = el();
    const p = pose({ element: a, key: "out", value: 0.4 });
    const match = findPoseMatch([p], { element: a, key: "out" });
    expect(match).toEqual({ pose: p, mirror: false });
  });

  it("does not match unkeyed identity poses — no role info to seed safely", () => {
    // In hidden mode the same real node flips roles between consecutive
    // runs; without keys a raw value copy would land on the wrong visual
    // state (e.g. film/zoom interrupts), so unkeyed animations opt out.
    const a = el();
    const p = pose({ element: a, value: 0.4 });
    expect(findPoseMatch([p], { element: a })).toBeNull();
  });

  it("mirrors same element across a role flip (out ↔ in)", () => {
    const a = el();
    const p = pose({ element: a, key: "out", value: 0.7 });
    const match = findPoseMatch([p], { element: a, key: "in" });
    expect(match).toEqual({ pose: p, mirror: true });
  });

  it("prefers same-role over flipped-role for the same element", () => {
    const a = el();
    const sameRole = pose({ element: a, key: "in", value: 0.2 });
    const flipped = pose({ element: a, key: "out", value: 0.9 });
    const match = findPoseMatch([flipped, sameRole], {
      element: a,
      key: "in",
    });
    expect(match).toEqual({ pose: sameRole, mirror: false });
  });

  it("does not match identity poses when key info is one-sided", () => {
    // A keyed↔unkeyed pair (e.g. film interrupted by fade) has no shared
    // role convention, so a direct seed would be unmirrored guesswork.
    const a = el();
    const keyed = pose({ element: a, key: "hero:thumb", value: 0.5 });
    expect(findPoseMatch([keyed], { element: a })).toBeNull();
    const unkeyed = pose({ element: a, value: 0.5 });
    expect(findPoseMatch([unkeyed], { element: a, key: "out" })).toBeNull();
  });

  it("lets the out side borrow the unique prior in pose across elements", () => {
    // The page being left is always the page that was arriving, so this
    // pairing is safe even when the node changed (unmount-mode clones).
    const prior = pose({ element: el(), key: "in", value: 0.4 });
    const other = pose({ element: el(), key: "out", value: 0.9 });
    const match = findPoseMatch([prior, other], { element: el(), key: "out" });
    expect(match).toEqual({ pose: prior, mirror: true });
  });

  it("never lets the in side borrow cross-element continuity (chained-nav guard)", () => {
    // A→B interrupted by B→C: the arriving page C is brand new and must
    // start fresh, not inherit page A's out pose.
    const priorOut = pose({ element: el(), key: "out", value: 0.3 });
    const priorIn = pose({ element: el(), key: "in", value: 0 });
    expect(
      findPoseMatch([priorOut, priorIn], { element: el(), key: "in" }),
    ).toBeNull();
  });

  it("matches a unique custom key across different elements directly", () => {
    const prior = pose({ element: el(), key: "hero:thumb", value: 0.6 });
    const match = findPoseMatch([prior], { element: el(), key: "hero:thumb" });
    expect(match).toEqual({ pose: prior, mirror: false });
  });

  it("matches nothing when the role fallback is ambiguous", () => {
    const inA = pose({ element: el(), key: "in", value: 0.2 });
    const inB = pose({ element: el(), key: "in", value: 0.8 });
    expect(findPoseMatch([inA, inB], { element: el(), key: "out" })).toBeNull();
  });

  it("matches nothing without element identity or key", () => {
    const p = pose({ element: el(), key: "out", value: 0.5 });
    expect(findPoseMatch([p], { element: el() })).toBeNull();
  });
});

describe("rebasePose", () => {
  const bounds = { lowerBound: 0, upperBound: 1 };

  it("copies value and velocity for identical bounds without mirror", () => {
    const p = pose({ element: el(), value: 0.7, velocity: -2 });
    expect(rebasePose(p, bounds, false)).toEqual({ value: 0.7, velocity: -2 });
  });

  it("mirrors progress and negates velocity", () => {
    const p = pose({ element: el(), value: 0.7, velocity: -2 });
    const seeded = rebasePose(p, bounds, true);
    expect(seeded.value).toBeCloseTo(0.3);
    expect(seeded.velocity).toBeCloseTo(2);
  });

  it("rebases value and rescales velocity across different spans", () => {
    const p = pose({
      element: el(),
      value: 0.5,
      velocity: 1,
      lowerBound: 0,
      upperBound: 1,
    });
    const seeded = rebasePose(p, { lowerBound: 0, upperBound: 100 }, false);
    expect(seeded.value).toBeCloseTo(50);
    expect(seeded.velocity).toBeCloseTo(100);
  });

  it("rebases from non-zero source bounds", () => {
    const p = pose({
      element: el(),
      value: 15,
      velocity: 5,
      lowerBound: 10,
      upperBound: 20,
    });
    const seeded = rebasePose(p, bounds, true);
    expect(seeded.value).toBeCloseTo(0.5);
    expect(seeded.velocity).toBeCloseTo(-0.5);
  });

  it("preserves overshoot outside the source bounds", () => {
    const p = pose({ element: el(), value: 1.05, velocity: -0.5 });
    const seeded = rebasePose(p, bounds, true);
    expect(seeded.value).toBeCloseTo(-0.05);
    expect(seeded.velocity).toBeCloseTo(0.5);
  });

  it("falls back to a raw copy for degenerate spans", () => {
    const p = pose({
      element: el(),
      value: 0.4,
      velocity: 3,
      lowerBound: 1,
      upperBound: 1,
    });
    expect(rebasePose(p, bounds, true)).toEqual({ value: 0.4, velocity: 3 });
    const q = pose({ element: el(), value: 0.4, velocity: 3 });
    expect(rebasePose(q, { lowerBound: 2, upperBound: 2 }, false)).toEqual({
      value: 0.4,
      velocity: 3,
    });
  });
});
