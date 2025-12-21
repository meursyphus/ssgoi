/**
 * Double Spring Integrator (Chained/Lagged Spring)
 *
 * Creates a two-spring system for ease-in-out effect:
 * - Leader spring: tracks the target directly
 * - Follower spring: tracks the leader's position (this is the output)
 *
 * The follower can have a different stiffness ratio for stronger ease-in effect.
 */

import type { Integrator, IntegratorState } from "./types";
import { POSITION_THRESHOLD, VELOCITY_THRESHOLD } from "./types";
import {
  SpringIntegrator,
  type SpringIntegratorConfig,
} from "./spring-integrator";

export interface DoubleSpringIntegratorConfig extends SpringIntegratorConfig {
  /**
   * Follower stiffness ratio (0-1)
   * - 1.0: same stiffness as leader
   * - 0.5: follower has half stiffness → stronger ease-in
   * - 0.3: even stronger ease-in
   */
  ratio?: number;
}

/** Extended state that includes leader position */
interface DoubleSpringState extends IntegratorState {
  _leader?: IntegratorState;
}

export class DoubleSpringIntegrator implements Integrator {
  private readonly leader: SpringIntegrator;
  private readonly follower: SpringIntegrator;

  constructor(config: DoubleSpringIntegratorConfig) {
    const ratio = config.ratio ?? 1;

    this.leader = new SpringIntegrator({
      stiffness: config.stiffness,
      damping: config.damping,
    });

    this.follower = new SpringIntegrator({
      stiffness: config.stiffness * ratio,
      damping: config.damping,
    });
  }

  step(state: IntegratorState, target: number, dt: number): IntegratorState {
    const internal = state as DoubleSpringState;

    // Get or initialize leader state
    const leaderState = internal._leader ?? {
      position: state.position,
      velocity: state.velocity,
    };

    // Step 1: Leader tracks the target
    const newLeaderState = this.leader.step(leaderState, target, dt);

    // Step 2: Follower (output) tracks the leader
    const newFollowerState = this.follower.step(
      state,
      newLeaderState.position,
      dt,
    );

    // Return follower state with leader attached
    const result: DoubleSpringState = {
      position: newFollowerState.position,
      velocity: newFollowerState.velocity,
      _leader: newLeaderState,
    };

    return result;
  }

  isSettled(state: IntegratorState, target: number): boolean {
    const internal = state as DoubleSpringState;

    // Check follower (output) convergence
    const followerSettled =
      Math.abs(target - state.position) < POSITION_THRESHOLD &&
      Math.abs(state.velocity) < VELOCITY_THRESHOLD;

    // Also check leader if it exists
    if (internal._leader) {
      const leaderSettled =
        Math.abs(target - internal._leader.position) < POSITION_THRESHOLD &&
        Math.abs(internal._leader.velocity) < VELOCITY_THRESHOLD;

      return leaderSettled && followerSettled;
    }

    return followerSettled;
  }
}
