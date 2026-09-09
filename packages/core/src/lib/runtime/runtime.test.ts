import { describe, expect, it } from "vitest";
import {
  createPageMotionPlan,
  pageMotionStyle,
  simulate,
  interpolateFrame,
  resolveTransitionRule,
} from "./index";
import { SpringIntegrator } from "../animation/integrator/spring-integrator";
import { DoubleSpringIntegrator } from "../animation/integrator/double-spring-integrator";

describe("portable numerical playback", () => {
  it.each([
    new SpringIntegrator({ stiffness: 170, damping: 22 }),
    new DoubleSpringIntegrator({ stiffness: 170, damping: 22, follower: 0.8 }),
  ])("preserves endpoints and the initial velocity of %s", (integrator) => {
    const frames = simulate(integrator, 0.3, 1, -0.2);
    expect(frames[0]).toEqual({ time: 0, position: 0.3, velocity: -0.2 });
    expect(frames[frames.length - 1]).toMatchObject({
      position: 1,
      velocity: 0,
    });
    expect(
      frames.every(
        (frame) =>
          Number.isFinite(frame.position) && Number.isFinite(frame.velocity),
      ),
    ).toBe(true);
    expect(frames.length).toBeLessThan(601);
  });

  it("interpolates by elapsed time, including between baked frames on a 120Hz display", () => {
    const frames = [
      { time: 0, position: 0, velocity: 2 },
      { time: 20, position: 1, velocity: 0 },
    ];
    expect(interpolateFrame(frames, 5)).toEqual({
      position: 0.25,
      velocity: 1.5,
    });
    expect(interpolateFrame(frames, -100).position).toBe(0);
    expect(interpolateFrame(frames, 500).position).toBe(1);
    expect(interpolateFrame([], 0)).toEqual({ position: 0, velocity: 0 });
  });

  it("sequences fade and runs slide tracks together", () => {
    const fade = createPageMotionPlan("fade", "forward");
    const slide = createPageMotionPlan("slide", "forward");
    expect(fade.in.offset).toBe(fade.out.duration);
    expect(fade.duration).toBe(fade.out.duration + fade.in.duration);
    expect(slide.in.offset).toBe(0);
    expect(slide.duration).toBe(
      Math.max(slide.out.duration, slide.in.duration),
    );
    expect(JSON.parse(JSON.stringify(fade))).toEqual(fade);
  });

  it("expresses the same slide geometry in either percentages or native widths", () => {
    expect(pageMotionStyle("slide", "in", "forward", 0)).toEqual({
      x: 1,
      opacity: 1,
    });
    expect(pageMotionStyle("slide", "out", "forward", 1)).toEqual({
      x: -1,
      opacity: 1,
    });
    expect(pageMotionStyle("slide", "in", "backward", 0)).toEqual({
      x: -1,
      opacity: 1,
    });
    expect(pageMotionStyle("slide", "out", "backward", 1)).toEqual({
      x: 1,
      opacity: 1,
    });
    expect(pageMotionStyle("fade", "in", "forward", 0.3).opacity).toBe(0.3);
    expect(pageMotionStyle("fade", "out", "backward", 0.3).opacity).toBe(0.7);
  });

  it("rejects invalid physics rather than passing NaN into a native view", () => {
    expect(() =>
      createPageMotionPlan("slide", "forward", {
        spring: { stiffness: NaN, damping: 20 },
      }),
    ).toThrow("non-finite");
  });

  it("matches platform-independent transition payloads and preserves rule direction", () => {
    const rule = {
      from: "/posts",
      to: "/posts/*",
      transition: { effect: "native-slide" },
    };
    expect(
      resolveTransitionRule("/posts/42", "/posts", [rule], "forward"),
    ).toMatchObject({ direction: "backward", transition: rule.transition });
  });
});
