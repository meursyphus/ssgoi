/**
 * Spring Integrator
 *
 * Uses Semi-implicit Euler method (Allen Chou's approach)
 * for spring physics simulation.
 */

import type { Integrator, IntegratorState } from "./types";
import { POSITION_THRESHOLD, VELOCITY_THRESHOLD } from "./types";

export interface SpringIntegratorConfig {
  stiffness: number;
  damping: number;
}

export class SpringIntegrator implements Integrator {
  private readonly omega: number; // Angular frequency
  private readonly zeta: number; // Damping ratio

  constructor(config: SpringIntegratorConfig) {
    const { stiffness, damping } = config;
    const mass = 1;

    this.omega = Math.sqrt(stiffness / mass);
    this.zeta = damping / (2 * Math.sqrt(stiffness * mass));
  }

  step(state: IntegratorState, target: number, dt: number): IntegratorState {
    // Clamp dt for stability (max 33ms for 30fps minimum)
    const h = Math.min(dt, 0.033);

    const { omega, zeta } = this;
    const { position, velocity } = state;

    // Semi-implicit Euler integration
    const dampingForce = -2.0 * h * zeta * omega * velocity;
    const springForce = h * omega * omega * (target - position);
    const newVelocity = velocity + dampingForce + springForce;
    const newPosition = position + h * newVelocity;

    return {
      position: newPosition,
      velocity: newVelocity,
    };
  }

  isSettled(state: IntegratorState, target: number): boolean {
    const displacement = Math.abs(target - state.position);
    const speed = Math.abs(state.velocity);

    return displacement < POSITION_THRESHOLD && speed < VELOCITY_THRESHOLD;
  }
}
