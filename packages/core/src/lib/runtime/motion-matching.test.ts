import { describe, it, expect } from "vitest";
import {
  matchMotion,
  compatibleChannel,
  residualAt,
  type MotionSnapshot,
} from "./motion-matching";
const pose = (
  target: object,
  key?: string,
  space?: unknown,
  role?: string,
): MotionSnapshot<object> => ({ target, key, space, role, channels: {} });
describe("motion identity", () => {
  it("uses element identity across in/out roles; semantic roles and spaces must agree", () => {
    const page = {};
    expect(matchMotion([pose(page)], [{ target: page }])[0]?.reason).toBe(
      "element",
    );
    expect(
      matchMotion(
        [pose({}, "photo", "root", "media")],
        [{ target: {}, key: "photo", space: "root", role: "media" }],
      )[0]?.reason,
    ).toBe("key");
    expect(
      matchMotion(
        [pose({}, "photo", "root", "media")],
        [{ target: {}, key: "photo", space: "other", role: "media" }],
      )[0]?.reason,
    ).toBe("enter");
  });
  it("rejects ambiguous source and destination identities instead of choosing by order", () => {
    expect(
      matchMotion(
        [pose({}, "photo"), pose({}, "photo")],
        [{ target: {}, key: "photo" }],
      )[0]?.reason,
    ).toBe("ambiguous");
    const source = pose({}, "photo");
    expect(
      matchMotion(
        [source],
        [
          { target: {}, key: "photo" },
          { target: {}, key: "photo" },
        ],
      ).map((x) => x.reason),
    ).toEqual(["ambiguous", "ambiguous"]);
  });
  it("does not infer identity from matching geometry or route text", () => {
    expect(matchMotion([pose({})], [{ target: {} }])[0]?.reason).toBe("enter");
  });
});
describe("presentation residual", () => {
  it("matches value and velocity at handoff, then vanishes with zero velocity", () => {
    expect(residualAt(120, 400, 0, 0.28)).toEqual({
      value: 120,
      velocity: 400,
    });
    expect(residualAt(120, 400, 0.28, 0.28)).toEqual({ value: 0, velocity: 0 });
    expect(residualAt(120, 400, 1, 0.28)).toEqual({ value: 0, velocity: 0 });
    expect(residualAt(120, 400, 0.00001, 0.28).value).toBeGreaterThan(120);
  });
  it("keeps inertia when retargeted behind the current direction", () => {
    const before = residualAt(100, 500, 0.001, 0.4);
    expect(before.value).toBeGreaterThan(100);
    expect(before.velocity).toBeGreaterThan(0);
    expect(residualAt(100, 500, 0.3, 0.4).velocity).toBeLessThan(0);
  });
  it("rejects incompatible schemas, dimensions and nonfinite values", () => {
    const a = { schema: "x", value: [1], velocity: [2] };
    expect(compatibleChannel(a, { ...a, schema: "y" })).toBe(false);
    expect(compatibleChannel(a, { ...a, value: [NaN] })).toBe(false);
    expect(compatibleChannel(a, { ...a, velocity: [] })).toBe(false);
    expect(compatibleChannel(a, a)).toBe(true);
  });
});
