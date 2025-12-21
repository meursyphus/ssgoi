/**
 * Inertia Integrator
 *
 * Simulates acceleration with resistance for ease-in effect.
 * - Starts slow, accelerates towards target
 * - Resistance limits terminal velocity
 *
 * Physics:
 * - Linear resistance: a = acceleration - resistance * v
 * - Quadratic resistance: a = acceleration - resistance * v²
 */

import type { Integrator, IntegratorState } from "./types";

const POSITION_THRESHOLD = 0.01;

export type ResistanceType = "linear" | "quadratic";

export interface InertiaIntegratorConfig {
  /** Acceleration force (higher = faster acceleration) */
  acceleration: number;
  /** Resistance coefficient (higher = more resistance, lower terminal velocity) */
  resistance: number;
  /** Resistance type: 'linear' (proportional to v) or 'quadratic' (proportional to v²) */
  resistanceType?: ResistanceType;
}

export class InertiaIntegrator implements Integrator {
  private readonly acceleration: number;
  private readonly resistance: number;
  private readonly resistanceType: ResistanceType;

  constructor(config: InertiaIntegratorConfig) {
    this.acceleration = config.acceleration;
    this.resistance = config.resistance;
    this.resistanceType = config.resistanceType ?? "quadratic";
  }

  step(state: IntegratorState, target: number, dt: number): IntegratorState {
    // Clamp dt for stability
    const h = Math.min(dt, 0.033);

    const { acceleration, resistance, resistanceType } = this;
    const { position, velocity } = state;

    // Direction towards target
    const direction = target > position ? 1 : -1;

    // Calculate resistance force based on type
    let resistanceForce: number;
    if (resistanceType === "linear") {
      // Linear: F = -resistance * v
      resistanceForce = resistance * velocity;
    } else {
      // Quadratic: F = -resistance * v * |v|
      resistanceForce = resistance * velocity * Math.abs(velocity);
    }

    // Net acceleration = driving force - resistance
    const netAcceleration = direction * acceleration - resistanceForce;

    // Semi-implicit Euler
    const newVelocity = velocity + netAcceleration * h;
    let newPosition = position + newVelocity * h;

    // Clamp to target if we overshoot
    if (direction > 0 && newPosition > target) {
      newPosition = target;
    } else if (direction < 0 && newPosition < target) {
      newPosition = target;
    }

    return {
      position: newPosition,
      velocity: newPosition === target ? 0 : newVelocity,
    };
  }

  isSettled(state: IntegratorState, target: number): boolean {
    // Only check position, not velocity
    const displacement = Math.abs(target - state.position);
    return displacement < POSITION_THRESHOLD;
  }
}
