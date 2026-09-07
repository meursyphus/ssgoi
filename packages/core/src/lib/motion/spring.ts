import type { SpringConfig } from "@types";
import {
  DoubleSpringIntegrator,
  InertiaIntegrator,
  IntegratorProvider,
  SpringIntegrator,
  type Integrator,
  type IntegratorState,
} from "../animation/integrator";
import { simulate } from "../animation/web-animation";

const FRAME_DT = 1 / 60;
const MAX_FRAMES = 600;

/* ────────────────────────────────────────────────────────────────────────────
 * duration + bounce  ⇄  stiffness + damping   (mass = 1)
 *
 * Apple's WWDC23 parametrisation: `duration` is the perceptual duration
 * (≈ time to visually arrive), `bounce ∈ (-1, 1)` is how much it overshoots.
 *   stiffness = (2π / duration)²
 *   damping   = 4π (1 − bounce) / duration          bounce ≥ 0
 *   damping   = 4π / (duration (1 + bounce))        bounce <  0
 * so `bounce = 1 − ζ` for the under-damped range.
 * ──────────────────────────────────────────────────────────────────────────── */

export function durationBounceToSpring(
  duration: number,
  bounce = 0,
): { stiffness: number; damping: number } {
  if (!(duration > 0)) throw new Error("spring(): duration must be > 0");
  if (!(bounce > -1 && bounce < 1)) {
    throw new Error("spring(): bounce must be in (-1, 1)");
  }
  const stiffness = ((2 * Math.PI) / duration) ** 2;
  const damping =
    bounce >= 0
      ? (4 * Math.PI * (1 - bounce)) / duration
      : (4 * Math.PI) / (duration * (1 + bounce));
  return { stiffness, damping };
}

export function springToDurationBounce(
  stiffness: number,
  damping: number,
): { duration: number; bounce: number; zeta: number } {
  const omega = Math.sqrt(stiffness);
  const zeta = damping / (2 * omega);
  const duration = (2 * Math.PI) / omega;
  const bounce = zeta <= 1 ? 1 - zeta : 1 / zeta - 1;
  return { duration, bounce, zeta };
}

export type DurationBounceInput = {
  /** Perceptual duration in seconds. */
  duration: number;
  /** Overshoot amount, `0` = critically damped. Keep UI values ≤ 0.4. */
  bounce?: number;
  doubleSpring?: SpringConfig["doubleSpring"];
  restDelta?: number;
  restSpeed?: number;
};

export type SpringInput = DurationBounceInput | SpringConfig;

/**
 * Build a spring integrator from either `{ duration, bounce }` or the raw
 * `{ stiffness, damping }` shape. Returns a plain `Integrator` instance you
 * can hand to `set(label, { integrator })` or share across animations.
 */
export function spring(input: SpringInput): Integrator {
  const config: SpringConfig =
    "duration" in input
      ? {
          ...durationBounceToSpring(input.duration, input.bounce),
          doubleSpring: input.doubleSpring,
          restDelta: input.restDelta,
          restSpeed: input.restSpeed,
        }
      : input;
  return IntegratorProvider.from({ spring: config });
}

/* ────────────────────────────────────────────────────────────────────────────
 * easeIn — inertia that reaches the target in `duration`
 * ──────────────────────────────────────────────────────────────────────────── */

export type EaseInInput = {
  /** Seconds until the value reaches its target. */
  duration: number;
  /** Quadratic drag; higher = lower terminal velocity. @default 1.5 */
  resistance?: number;
  restDelta?: number;
};

function reachMs(integrator: Integrator): number {
  let state: IntegratorState = { position: 0, velocity: 0 };
  for (let frame = 1; frame <= MAX_FRAMES; frame++) {
    state = integrator.step(state, 1, FRAME_DT);
    if (state.position >= 1) return frame * FRAME_DT * 1000;
  }
  return Infinity;
}

/**
 * Accelerating ("ease-in") motion for outgoing surfaces. The acceleration is
 * solved numerically so the 0 → 1 travel takes `duration` seconds under the
 * given drag, at ssgoi's 60 fps simulation step.
 */
export function easeIn(input: EaseInInput): Integrator {
  const { duration, resistance = 1.5, restDelta } = input;
  if (!(duration > 0)) throw new Error("easeIn(): duration must be > 0");
  const targetMs = duration * 1000;
  let lo = 0.01;
  let hi = 1e6;
  for (let i = 0; i < 60; i++) {
    const mid = Math.sqrt(lo * hi);
    const candidate = new InertiaIntegrator({
      acceleration: mid,
      resistance,
      restDelta,
    });
    if (reachMs(candidate) > targetMs) lo = mid;
    else hi = mid;
  }
  return new InertiaIntegrator({ acceleration: hi, resistance, restDelta });
}

/* ────────────────────────────────────────────────────────────────────────────
 * scale — time-scale any integrator
 *
 * Feeding the inner integrator `dt · factor` and rescaling velocity compresses
 * its curve along the time axis by `1 / factor` (for a spring this equals
 * `k·s², c·s`). Works for custom integrators too. The stretched frame is
 * sub-stepped so the inner integrator keeps its normal step size: integer
 * factors reproduce the base curve exactly, fractional ones within ~3%.
 * ──────────────────────────────────────────────────────────────────────────── */

export class ScaledIntegrator implements Integrator {
  constructor(
    readonly inner: Integrator,
    readonly factor: number,
  ) {
    if (!(factor > 0)) throw new Error("scale(): factor must be > 0");
  }

  step(state: IntegratorState, target: number, dt: number): IntegratorState {
    // Sub-step so the inner integrator never sees a step larger than `dt`:
    // semi-implicit Euler's error grows with step size, and a single
    // `dt · factor` step would drift from the un-scaled curve.
    const steps = Math.max(1, Math.ceil(this.factor));
    const h = (dt * this.factor) / steps;
    let inner: IntegratorState = {
      ...state,
      velocity: state.velocity / this.factor,
    };
    for (let i = 0; i < steps; i++) inner = this.inner.step(inner, target, h);
    return { ...inner, velocity: inner.velocity * this.factor };
  }

  isSettled(state: IntegratorState, target: number): boolean {
    return this.inner.isSettled(
      { ...state, velocity: state.velocity / this.factor },
      target,
    );
  }
}

export function scale(integrator: Integrator, factor: number): Integrator {
  return new ScaledIntegrator(integrator, factor);
}

/* ────────────────────────────────────────────────────────────────────────────
 * describe — human-readable summary for docs, devtools and the analyzer
 * ──────────────────────────────────────────────────────────────────────────── */

export type IntegratorDescription = {
  kind: "spring" | "double-spring" | "inertia" | "scaled" | "custom";
  /** Perceptual duration in seconds (springs only). */
  duration?: number;
  bounce?: number;
  zeta?: number;
  /** Time until ssgoi considers the 0 → 1 run settled, in ms. */
  settleMs: number;
};

export function describeIntegrator(
  integrator: Integrator,
): IntegratorDescription {
  const frames = simulate(integrator, 0, 1, 0);
  const settleMs = frames.length ? frames[frames.length - 1]!.time : 0;

  if (integrator instanceof ScaledIntegrator) {
    const inner = describeIntegrator(integrator.inner);
    return {
      ...inner,
      kind: "scaled",
      duration:
        inner.duration === undefined
          ? undefined
          : inner.duration / integrator.factor,
      settleMs,
    };
  }
  if (
    integrator instanceof SpringIntegrator ||
    integrator instanceof DoubleSpringIntegrator
  ) {
    const kind =
      integrator instanceof SpringIntegrator ? "spring" : "double-spring";
    return {
      kind,
      ...springToDurationBounce(integrator.stiffness, integrator.damping),
      settleMs,
    };
  }
  if (integrator instanceof InertiaIntegrator) {
    return { kind: "inertia", settleMs };
  }
  return { kind: "custom", settleMs };
}
