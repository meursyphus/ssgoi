import { describe, expect, it } from "vitest";
import type { IntegratorState } from "./types";
import { SpringIntegrator } from "./spring-integrator";
import { DoubleSpringIntegrator } from "./double-spring-integrator";
import { InertiaIntegrator } from "./inertia-integrator";
import { LinearIntegrator } from "./linear-integrator";
import { IntegratorProvider } from "./provider";

const DT = 1 / 60;

const runUntilSettled = (
  integrator: {
    step: (s: IntegratorState, t: number, dt: number) => IntegratorState;
    isSettled: (s: IntegratorState, t: number) => boolean;
  },
  from: number,
  target: number,
  maxSteps = 2000,
) => {
  let state: IntegratorState = { position: from, velocity: 0 };
  let steps = 0;
  while (steps < maxSteps) {
    state = integrator.step(state, target, DT);
    steps++;
    if (integrator.isSettled(state, target)) break;
  }
  return { state, steps };
};

describe("SpringIntegrator", () => {
  it("is deterministic — identical inputs produce identical trajectories", () => {
    const trajectory = () => {
      const spring = new SpringIntegrator({ stiffness: 300, damping: 30 });
      let state: IntegratorState = { position: 0, velocity: 0 };
      const out: IntegratorState[] = [];
      for (let i = 0; i < 120; i++) {
        state = spring.step(state, 1, DT);
        out.push(state);
      }
      return out;
    };
    expect(trajectory()).toEqual(trajectory());
  });

  it("converges to the target and settles", () => {
    const spring = new SpringIntegrator({ stiffness: 300, damping: 30 });
    const { state, steps } = runUntilSettled(spring, 0, 1);
    expect(steps).toBeLessThan(2000);
    expect(state.position).toBeCloseTo(1, 1);
    expect(spring.isSettled(state, 1)).toBe(true);
  });

  it("settles sooner with loosened rest thresholds", () => {
    const tight = new SpringIntegrator({ stiffness: 1000, damping: 40 });
    const loose = new SpringIntegrator({
      stiffness: 1000,
      damping: 40,
      restDelta: 0.1,
      restSpeed: 0.1,
    });
    const tightSteps = runUntilSettled(tight, 0, 1).steps;
    const looseSteps = runUntilSettled(loose, 0, 1).steps;
    expect(looseSteps).toBeLessThan(tightSteps);
  });

  it("honors a seeded initial velocity", () => {
    const spring = new SpringIntegrator({ stiffness: 300, damping: 30 });
    const fromRest = spring.step({ position: 0.5, velocity: 0 }, 1, DT);
    const fromMoving = spring.step({ position: 0.5, velocity: 5 }, 1, DT);
    expect(fromMoving.position).toBeGreaterThan(fromRest.position);
  });
});

describe("DoubleSpringIntegrator", () => {
  it("converges to the target and settles", () => {
    const spring = new DoubleSpringIntegrator({
      stiffness: 300,
      damping: 30,
      follower: 1.2,
    });
    const { state, steps } = runUntilSettled(spring, 0, 1);
    expect(steps).toBeLessThan(2000);
    expect(state.position).toBeCloseTo(1, 1);
  });

  it("lags a plain spring early on (ease-in character)", () => {
    const single = new SpringIntegrator({ stiffness: 300, damping: 30 });
    const chained = new DoubleSpringIntegrator({ stiffness: 300, damping: 30 });
    let singleState: IntegratorState = { position: 0, velocity: 0 };
    let chainedState: IntegratorState = { position: 0, velocity: 0 };
    for (let i = 0; i < 5; i++) {
      singleState = single.step(singleState, 1, DT);
      chainedState = chained.step(chainedState, 1, DT);
    }
    expect(chainedState.position).toBeLessThan(singleState.position);
  });
});

describe("InertiaIntegrator", () => {
  it("accelerates toward the target and settles on it", () => {
    const inertia = new InertiaIntegrator({
      acceleration: 150,
      resistance: 1.5,
    });
    const { state, steps } = runUntilSettled(inertia, 0, 1);
    expect(steps).toBeLessThan(2000);
    expect(Math.abs(state.position - 1)).toBeLessThan(0.01);
  });

  it("clamps to the target instead of overshooting", () => {
    const inertia = new InertiaIntegrator({
      acceleration: 5000,
      resistance: 0.01,
    });
    let state: IntegratorState = { position: 0, velocity: 0 };
    for (let i = 0; i < 200; i++) {
      state = inertia.step(state, 1, DT);
      expect(state.position).toBeLessThanOrEqual(1);
    }
    expect(state.position).toBe(1);
    expect(state.velocity).toBe(0);
  });
});

describe("LinearIntegrator", () => {
  it("reaches the target and settles", () => {
    const linear = new LinearIntegrator({ durationSec: 0.3 });
    const { state, steps } = runUntilSettled(linear, 0, 1);
    expect(steps).toBeLessThan(2000);
    expect(Math.abs(state.position - 1)).toBeLessThan(0.01);
  });
});

describe("IntegratorProvider", () => {
  it("throws when both spring and inertia are configured", () => {
    expect(() =>
      IntegratorProvider.from({
        spring: { stiffness: 300, damping: 30 },
        inertia: { acceleration: 100, resistance: 1 },
      }),
    ).toThrow();
  });

  it("selects the integrator matching the physics config", () => {
    expect(
      IntegratorProvider.from({
        inertia: { acceleration: 100, resistance: 1 },
      }),
    ).toBeInstanceOf(InertiaIntegrator);
    expect(
      IntegratorProvider.from({
        spring: { stiffness: 300, damping: 30, doubleSpring: true },
      }),
    ).toBeInstanceOf(DoubleSpringIntegrator);
    expect(
      IntegratorProvider.from({ spring: { stiffness: 300, damping: 30 } }),
    ).toBeInstanceOf(SpringIntegrator);
    expect(IntegratorProvider.from({})).toBeInstanceOf(SpringIntegrator);
  });
});
