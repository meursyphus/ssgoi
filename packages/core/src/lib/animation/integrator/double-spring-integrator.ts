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

/**
 * Follower spring configuration
 */
export interface FollowerSpringConfig {
  stiffness: number;
  damping: number;
  /** Position threshold for settling detection @default 0.01 */
  restDelta?: number;
  /** Velocity threshold for settling detection @default 0.01 */
  restSpeed?: number;
}

export interface DoubleSpringIntegratorConfig extends SpringIntegratorConfig {
  /**
   * Follower spring configuration
   * - number (0-1): stiffness ratio (smaller = stronger ease-in)
   * - { stiffness, damping }: custom follower spring config
   */
  follower?: number | FollowerSpringConfig;
}

/** Extended state that includes leader position */
interface DoubleSpringState extends IntegratorState {
  _leader?: IntegratorState;
}

export class DoubleSpringIntegrator implements Integrator {
  private readonly leader: SpringIntegrator;
  private readonly follower: SpringIntegrator;
  private readonly restDelta: number;
  private readonly restSpeed: number;

  constructor(config: DoubleSpringIntegratorConfig) {
    this.restDelta = config.restDelta ?? POSITION_THRESHOLD;
    this.restSpeed = config.restSpeed ?? VELOCITY_THRESHOLD;

    this.leader = new SpringIntegrator({
      stiffness: config.stiffness,
      damping: config.damping,
      restDelta: this.restDelta,
      restSpeed: this.restSpeed,
    });

    // Determine follower config
    let followerStiffness: number;
    let followerDamping: number;
    let followerRestDelta: number | undefined;
    let followerRestSpeed: number | undefined;

    if (typeof config.follower === "number") {
      // Ratio mode
      followerStiffness = config.stiffness * config.follower;
      followerDamping = config.damping;
    } else if (config.follower) {
      // Custom config mode
      followerStiffness = config.follower.stiffness;
      followerDamping = config.follower.damping;
      followerRestDelta = config.follower.restDelta;
      followerRestSpeed = config.follower.restSpeed;
    } else {
      // Default: same as leader
      followerStiffness = config.stiffness;
      followerDamping = config.damping;
    }

    this.follower = new SpringIntegrator({
      stiffness: followerStiffness,
      damping: followerDamping,
      restDelta: followerRestDelta ?? this.restDelta,
      restSpeed: followerRestSpeed ?? this.restSpeed,
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
      Math.abs(target - state.position) < this.restDelta &&
      Math.abs(state.velocity) < this.restSpeed;

    // Also check leader if it exists
    if (internal._leader) {
      const leaderSettled =
        Math.abs(target - internal._leader.position) < this.restDelta &&
        Math.abs(internal._leader.velocity) < this.restSpeed;

      return leaderSettled && followerSettled;
    }

    return followerSettled;
  }
}
