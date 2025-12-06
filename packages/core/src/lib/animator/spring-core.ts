/**
 * Spring Core
 *
 * Core module containing spring physics calculation logic
 * Used by both tick-runner (RAF based) and css-runner (synchronous simulation)
 *
 * Uses optimized Semi-implicit Euler method (Allen Chou's approach)
 */

export interface SpringConfig {
  stiffness: number;
  damping: number;
}

export interface SpringState {
  position: number;
  velocity: number;
}

export interface SpringConstants {
  omega: number; // Angular frequency
  zeta: number; // Damping ratio
}

/**
 * Pre-compute spring constants (performance optimization)
 *
 * @param config Spring configuration
 * @returns omega (angular frequency), zeta (damping ratio)
 */
export function computeSpringConstants(config: SpringConfig): SpringConstants {
  const stiffness = config.stiffness;
  const damping = config.damping;
  const mass = 1;
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  return { omega, zeta };
}

/**
 * Calculate one spring step (Semi-implicit Euler)
 *
 * Uses optimized formula with omega and zeta instead of F = -k(x-xt) - d*v:
 * - v += -2*h*zeta*omega*v + h*omega^2*(target - x)
 * - x += h*v
 *
 * @param state Current state (position, velocity)
 * @param target Target position
 * @param constants Pre-computed spring constants (omega, zeta)
 * @param dt Delta time (seconds)
 * @returns New state
 */
export function stepSpring(
  state: SpringState,
  target: number,
  constants: SpringConstants,
  dt: number,
): SpringState {
  const { omega, zeta } = constants;
  const { position, velocity } = state;

  // Clamp dt for stability (max 33ms for 30fps minimum)
  const h = Math.min(dt, 0.033);

  // Semi-implicit Euler (Allen Chou's formulation)
  const dampingForce = -2.0 * h * zeta * omega * velocity;
  const springForce = h * omega * omega * (target - position);
  const newVelocity = velocity + dampingForce + springForce;
  const newPosition = position + h * newVelocity;

  return {
    position: newPosition,
    velocity: newVelocity,
  };
}

// Convergence thresholds
export const POSITION_THRESHOLD = 0.01;
export const VELOCITY_THRESHOLD = 0.01;
export const SETTLE_THRESHOLD = 0.05; // 50ms of settling

/**
 * Check if spring has converged to target
 */
export function isSettled(state: SpringState, target: number): boolean {
  const displacement = Math.abs(target - state.position);
  const speed = Math.abs(state.velocity);
  return displacement < POSITION_THRESHOLD && speed < VELOCITY_THRESHOLD;
}

/**
 * Full spring simulation (synchronous)
 * Used for Web Animation API keyframe generation
 *
 * @param config Spring configuration
 * @param from Start value
 * @param to Target value
 * @param initialVelocity Initial velocity
 * @returns Frame-by-frame progress array and duration
 */
export function simulateSpring(
  config: SpringConfig,
  from: number,
  to: number,
  initialVelocity = 0,
): { frames: number[]; duration: number } {
  const constants = computeSpringConstants(config);
  const FRAME_TIME = 1 / 60; // 60fps (seconds)
  const MAX_FRAMES = 600; // Max 10 seconds

  let state: SpringState = { position: from, velocity: initialVelocity };
  let settleTime = 0;
  const range = to - from;
  const frames: number[] = [];

  for (let i = 0; i < MAX_FRAMES; i++) {
    // Calculate progress (0~1)
    const progress = range !== 0 ? (state.position - from) / range : 1;
    frames.push(Math.max(0, Math.min(1, progress)));

    // Spring step
    state = stepSpring(state, to, constants, FRAME_TIME);

    // Check convergence
    if (isSettled(state, to)) {
      settleTime += FRAME_TIME;
      if (settleTime >= SETTLE_THRESHOLD) {
        // Final frame is exactly target value
        const finalProgress = range !== 0 ? 1 : 1;
        frames.push(finalProgress);
        break;
      }
    } else {
      settleTime = 0;
    }
  }

  return {
    frames,
    duration: frames.length * (1000 / 60), // ms
  };
}
