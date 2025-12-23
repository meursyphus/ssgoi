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
 *
 * Boundary behavior:
 * - When position exceeds min/max, spring force is applied
 * - F_spring = -bounceStiffness * (x - boundary) - bounceDamping * v
 */

import type { Integrator, IntegratorState } from "./types";

const DEFAULT_POSITION_THRESHOLD = 0.01;
const DEFAULT_BOUNCE_STIFFNESS = 500;
const DEFAULT_BOUNCE_DAMPING = 10;

export type ResistanceType = "linear" | "quadratic";

export interface InertiaIntegratorConfig {
  /** Acceleration force (higher = faster acceleration) */
  acceleration: number;
  /** Resistance coefficient (higher = more resistance, lower terminal velocity) */
  resistance: number;
  /** Resistance type: 'linear' (proportional to v) or 'quadratic' (proportional to v²) */
  resistanceType?: ResistanceType;
  /** Minimum boundary value */
  min?: number;
  /** Maximum boundary value */
  max?: number;
  /** Spring stiffness for boundary bounce @default 500 */
  bounceStiffness?: number;
  /** Spring damping for boundary bounce @default 10 */
  bounceDamping?: number;
  /** Position threshold for settling detection @default 0.01 */
  restDelta?: number;
}

export class InertiaIntegrator implements Integrator {
  private readonly acceleration: number;
  private readonly resistance: number;
  private readonly resistanceType: ResistanceType;
  private readonly min: number | undefined;
  private readonly max: number | undefined;
  private readonly bounceStiffness: number;
  private readonly bounceDamping: number;
  private readonly restDelta: number;

  constructor(config: InertiaIntegratorConfig) {
    this.acceleration = config.acceleration;
    this.resistance = config.resistance;
    this.resistanceType = config.resistanceType ?? "quadratic";
    this.min = config.min;
    this.max = config.max;
    this.bounceStiffness = config.bounceStiffness ?? DEFAULT_BOUNCE_STIFFNESS;
    this.bounceDamping = config.bounceDamping ?? DEFAULT_BOUNCE_DAMPING;
    this.restDelta = config.restDelta ?? DEFAULT_POSITION_THRESHOLD;
  }

  step(state: IntegratorState, target: number, dt: number): IntegratorState {
    // Clamp dt for stability
    const h = Math.min(dt, 0.033);

    const { acceleration, resistance, resistanceType, min, max } = this;
    const { position, velocity } = state;

    // Check if we're outside boundaries
    const belowMin = min !== undefined && position < min;
    const aboveMax = max !== undefined && position > max;

    let netAcceleration: number;

    if (belowMin || aboveMax) {
      // Apply spring force to bounce back to boundary
      const boundary = belowMin ? min! : max!;
      const displacement = position - boundary;

      // F_spring = -k * x - c * v
      const springForce = -this.bounceStiffness * displacement;
      const dampingForce = -this.bounceDamping * velocity;

      netAcceleration = springForce + dampingForce;
    } else {
      // Normal inertia behavior
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
      netAcceleration = direction * acceleration - resistanceForce;
    }

    // Semi-implicit Euler
    const newVelocity = velocity + netAcceleration * h;
    let newPosition = position + newVelocity * h;

    // Clamp to target if we overshoot (only when not in boundary mode)
    if (!belowMin && !aboveMax) {
      const direction = target > position ? 1 : -1;
      if (direction > 0 && newPosition > target) {
        newPosition = target;
      } else if (direction < 0 && newPosition < target) {
        newPosition = target;
      }
    }

    return {
      position: newPosition,
      velocity: newPosition === target ? 0 : newVelocity,
    };
  }

  isSettled(state: IntegratorState, target: number): boolean {
    // Only check position, not velocity
    const displacement = Math.abs(target - state.position);
    return displacement < this.restDelta;
  }
}
