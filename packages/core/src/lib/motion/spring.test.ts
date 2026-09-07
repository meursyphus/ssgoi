import { describe, expect, it } from "vitest";
import {
  InertiaIntegrator,
  SpringIntegrator,
  type Integrator,
  type IntegratorState,
} from "../animation/integrator";
import { simulate } from "../animation/web-animation";
import { accelerate, bouncy, gentle, smooth, snappy, swift } from "./presets";
import {
  describeIntegrator,
  durationBounceToSpring,
  easeIn,
  scale,
  spring,
  springToDurationBounce,
} from "./spring";

describe("duration/bounce ⇄ stiffness/damping", () => {
  it("round-trips through Apple's formulas", () => {
    const { stiffness, damping } = durationBounceToSpring(0.3, 0.15);
    const back = springToDurationBounce(stiffness, damping);
    expect(back.duration).toBeCloseTo(0.3, 6);
    expect(back.bounce).toBeCloseTo(0.15, 6);
    expect(back.zeta).toBeCloseTo(0.85, 6);
  });

  it("bounce 0 is critically damped, negative bounce is over-damped", () => {
    const smoothSpring = durationBounceToSpring(0.4, 0);
    expect(
      springToDurationBounce(smoothSpring.stiffness, smoothSpring.damping).zeta,
    ).toBeCloseTo(1, 6);

    const heavy = durationBounceToSpring(0.4, -0.2);
    const desc = springToDurationBounce(heavy.stiffness, heavy.damping);
    expect(desc.zeta).toBeGreaterThan(1);
    expect(desc.bounce).toBeCloseTo(-0.2, 6);
  });

  it("maps ssgoi's default 300/30 to ~363 ms, bounce ~0.13", () => {
    const desc = springToDurationBounce(300, 30);
    expect(Math.round(desc.duration * 1000)).toBe(363);
    expect(desc.bounce).toBeCloseTo(0.134, 2);
  });

  it("rejects out-of-range inputs", () => {
    expect(() => durationBounceToSpring(0, 0)).toThrow();
    expect(() => durationBounceToSpring(0.3, 1)).toThrow();
  });
});

describe("spring()", () => {
  it("builds a SpringIntegrator from duration/bounce", () => {
    const integrator = spring({ duration: 0.4 }) as SpringIntegrator;
    expect(integrator).toBeInstanceOf(SpringIntegrator);
    expect(integrator.stiffness).toBeCloseTo(((2 * Math.PI) / 0.4) ** 2, 6);
  });

  it("accepts the raw stiffness/damping shape too", () => {
    const integrator = spring({
      stiffness: 400,
      damping: 30,
    }) as SpringIntegrator;
    expect(integrator.stiffness).toBe(400);
    expect(integrator.damping).toBe(30);
  });

  it("converges to the target at 60 fps", () => {
    const frames = simulate(spring({ duration: 0.3, bounce: 0.15 }), 0, 1, 0);
    expect(frames[frames.length - 1]!.position).toBe(1);
    expect(frames[frames.length - 1]!.time).toBeGreaterThan(200);
    expect(frames[frames.length - 1]!.time).toBeLessThan(700);
  });
});

function reachMs(integrator: Integrator): number {
  let state: IntegratorState = { position: 0, velocity: 0 };
  for (let frame = 1; frame <= 600; frame++) {
    state = integrator.step(state, 1, 1 / 60);
    if (state.position >= 1) return (frame * 1000) / 60;
  }
  return Infinity;
}

describe("easeIn()", () => {
  it("reaches the target in roughly the requested duration", () => {
    const integrator = easeIn({ duration: 0.2 });
    expect(integrator).toBeInstanceOf(InertiaIntegrator);
    const ms = reachMs(integrator);
    expect(ms).toBeGreaterThanOrEqual(200 - 1000 / 60);
    expect(ms).toBeLessThanOrEqual(200 + 1000 / 60);
  });

  it("is monotone in duration", () => {
    expect(reachMs(easeIn({ duration: 0.1 }))).toBeLessThan(
      reachMs(easeIn({ duration: 0.3 })),
    );
  });
});

describe("scale()", () => {
  function sampler(frames: ReturnType<typeof simulate>) {
    return (timeMs: number): number => {
      const last = frames[frames.length - 1]!;
      if (timeMs >= last.time) return last.position;
      const i = Math.floor(timeMs / (1000 / 60));
      const a = frames[i]!;
      const b = frames[i + 1] ?? a;
      const t = (timeMs - a.time) / (1000 / 60);
      return a.position + (b.position - a.position) * t;
    };
  }

  it("reproduces the base curve exactly for an integer factor", () => {
    const basis = spring({ duration: 0.4, bounce: 0.2 });
    const slowFrames = simulate(basis, 0, 1, 0);
    const slow = sampler(slowFrames);
    const fastFrames = simulate(scale(basis, 2), 0, 1, 0);

    // The settle window (50 ms of rest) is measured in each run's own time,
    // so only the clamped tail differs; every frame before it must match.
    const settledAt = slowFrames[slowFrames.length - 1]!.time - 1000 / 60;
    let compared = 0;
    for (const frame of fastFrames) {
      if (frame.time * 2 >= settledAt) break;
      expect(frame.position).toBeCloseTo(slow(frame.time * 2), 9);
      compared++;
    }
    expect(compared).toBeGreaterThan(10);
  });

  it("approximates the base curve for a fractional factor", () => {
    const factor = 1.5;
    const basis = spring({ duration: 0.4, bounce: 0.2 });
    const slowFrames = simulate(basis, 0, 1, 0);
    const slow = sampler(slowFrames);
    const fastFrames = simulate(scale(basis, factor), 0, 1, 0);

    for (const frame of fastFrames) {
      expect(Math.abs(frame.position - slow(frame.time * factor))).toBeLessThan(
        0.03,
      );
    }
    expect(fastFrames[fastFrames.length - 1]!.time).toBeLessThan(
      slowFrames[slowFrames.length - 1]!.time,
    );
  });

  it("works for custom integrators", () => {
    const linear: Integrator = {
      step: (s, target, dt) => {
        const p = Math.min(target, s.position + dt);
        return { position: p, velocity: p >= target ? 0 : 1 };
      },
      isSettled: (s, target) => s.position >= target,
    };
    expect(reachMs(scale(linear, 2))).toBeLessThan(reachMs(linear));
  });
});

describe("describeIntegrator()", () => {
  it("reports duration / bounce for springs", () => {
    const desc = describeIntegrator(snappy);
    expect(desc.kind).toBe("spring");
    expect(desc.duration).toBeCloseTo(0.3, 6);
    expect(desc.bounce).toBeCloseTo(0.15, 6);
    expect(desc.settleMs).toBeGreaterThan(0);
  });

  it("reports settle time for inertia and scaled integrators", () => {
    expect(describeIntegrator(accelerate).kind).toBe("inertia");
    const scaled = describeIntegrator(scale(smooth, 2));
    expect(scaled.kind).toBe("scaled");
    expect(scaled.duration).toBeCloseTo(0.2, 6);
  });
});

describe("presets", () => {
  it("are ready-to-use integrators ordered by feel", () => {
    for (const p of [smooth, snappy, bouncy, gentle, swift, accelerate]) {
      expect(typeof p.step).toBe("function");
      expect(typeof p.isSettled).toBe("function");
    }
    expect(describeIntegrator(swift).settleMs).toBeLessThan(
      describeIntegrator(gentle).settleMs,
    );
    expect(describeIntegrator(bouncy).bounce).toBeGreaterThan(
      describeIntegrator(smooth).bounce!,
    );
  });
});
