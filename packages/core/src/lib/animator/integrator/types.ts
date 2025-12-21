/**
 * Integrator Interface
 *
 * Common interface for numerical integration of motion equations.
 * Each implementation can use different physics (spring, friction, etc.)
 * but must conform to this interface.
 */

export interface IntegratorState {
  position: number;
  velocity: number;
}

export interface Integrator {
  /**
   * Perform one integration step
   *
   * @param state Current state (position, velocity)
   * @param target Target position
   * @param dt Delta time in seconds
   * @returns New state after integration
   */
  step(state: IntegratorState, target: number, dt: number): IntegratorState;

  /**
   * Check if the state has settled (converged to target)
   *
   * @param state Current state
   * @param target Target position
   * @returns true if settled
   */
  isSettled(state: IntegratorState, target: number): boolean;
}

// Convergence thresholds
export const POSITION_THRESHOLD = 0.01;
export const VELOCITY_THRESHOLD = 0.01;
export const SETTLE_THRESHOLD = 0.05; // 50ms of settling
