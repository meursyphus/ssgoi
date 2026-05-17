import type { Integrator, IntegratorState } from "./types";
import { POSITION_THRESHOLD } from "./types";

export interface LinearIntegratorConfig {
  /** Wall-clock duration, in seconds, the integrator should take to traverse
   * its full range. The simulation steps at FRAME_TIME (1/60s) and accumulates
   * position linearly until it crosses the target. */
  durationSec: number;
}

/**
 * Constant-velocity integrator.
 *
 * Useful when the curve isn't physical — e.g. a pre-baked multi-spring
 * timeline is being replayed through `WebAnimation`'s style function. The
 * style function gets `t ∈ [0,1]` evolving linearly over `durationSec`, then
 * looks up the baked frame data. The visible curve still comes from the bake;
 * the integrator is just driving the clock.
 */
export class LinearIntegrator implements Integrator {
  private durationSec: number;

  constructor(config: LinearIntegratorConfig) {
    this.durationSec = Math.max(1 / 60, config.durationSec);
  }

  step(state: IntegratorState, target: number, dt: number): IntegratorState {
    const range = target - state.position;
    if (range === 0) return state;
    const direction = Math.sign(range);
    // velocity is per-unit-range, scaled so the full traversal takes durationSec
    const speed = Math.abs(range) / this.durationSec;
    const advance = direction * speed * dt;
    const newPos = state.position + advance;

    const overshoot = direction > 0 ? newPos >= target : newPos <= target;
    if (overshoot) {
      return { position: target, velocity: 0 };
    }
    return { position: newPos, velocity: direction * speed };
  }

  isSettled(state: IntegratorState, target: number): boolean {
    return Math.abs(state.position - target) < POSITION_THRESHOLD;
  }
}
