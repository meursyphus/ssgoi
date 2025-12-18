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
  /**
   * Enable double spring for ease-in-out effect (Chained/Lagged Spring)
   *
   * - true: same stiffness for both springs
   * - number (0-1): follower stiffness ratio (smaller = stronger ease-in)
   *   - 1.0: same as true
   *   - 0.5: follower has half stiffness → stronger ease-in
   *   - 0.3: even stronger ease-in
   *
   * Creates a two-spring system:
   * - Leader spring: tracks the target directly
   * - Follower spring: tracks the leader's position (this is the output)
   */
  doubleSpring?: boolean | number;
}

export interface SpringState {
  position: number;
  velocity: number;
}

/** @internal - Extended state for double spring simulation */
interface InternalSpringState extends SpringState {
  _leader?: { position: number; velocity: number };
}

export interface SpringConstants {
  omega: number; // Angular frequency
  zeta: number; // Damping ratio
  /** @internal - Follower constants for double spring */
  follower?: {
    omega: number;
    zeta: number;
  };
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

  const result: SpringConstants = { omega, zeta };

  // Double spring mode
  if (config.doubleSpring) {
    const ratio =
      typeof config.doubleSpring === "number" ? config.doubleSpring : 1;
    const followerStiffness = stiffness * ratio;
    const followerOmega = Math.sqrt(followerStiffness / mass);
    const followerZeta = damping / (2 * Math.sqrt(followerStiffness * mass));
    result.follower = { omega: followerOmega, zeta: followerZeta };
  }

  return result;
}

/**
 * Single spring step calculation (internal)
 */
function stepSingleSpring(
  position: number,
  velocity: number,
  target: number,
  omega: number,
  zeta: number,
  h: number,
): { position: number; velocity: number } {
  const dampingForce = -2.0 * h * zeta * omega * velocity;
  const springForce = h * omega * omega * (target - position);
  const newVelocity = velocity + dampingForce + springForce;
  const newPosition = position + h * newVelocity;
  return { position: newPosition, velocity: newVelocity };
}

/**
 * Calculate one spring step (Semi-implicit Euler)
 *
 * Automatically handles double spring if constants.follower exists.
 * For double spring, output position/velocity is from the follower.
 *
 * @param state Current state (position, velocity)
 * @param target Target position
 * @param constants Pre-computed spring constants (omega, zeta, optionally follower)
 * @param dt Delta time (seconds)
 * @returns New state
 */
export function stepSpring(
  state: SpringState,
  target: number,
  constants: SpringConstants,
  dt: number,
): SpringState {
  // Clamp dt for stability (max 33ms for 30fps minimum)
  const h = Math.min(dt, 0.033);

  // Double spring mode
  if (constants.follower) {
    const internal = state as InternalSpringState;
    // Get or initialize leader state
    const leader = internal._leader ?? {
      position: state.position,
      velocity: state.velocity,
    };

    // Step 1: Leader tracks the target
    const newLeader = stepSingleSpring(
      leader.position,
      leader.velocity,
      target,
      constants.omega,
      constants.zeta,
      h,
    );

    // Step 2: Follower (output) tracks the leader
    const newFollower = stepSingleSpring(
      state.position,
      state.velocity,
      newLeader.position,
      constants.follower.omega,
      constants.follower.zeta,
      h,
    );

    const result: InternalSpringState = {
      position: newFollower.position,
      velocity: newFollower.velocity,
      _leader: newLeader,
    };
    return result;
  }

  // Single spring mode (original behavior)
  const { omega, zeta } = constants;
  const result = stepSingleSpring(
    state.position,
    state.velocity,
    target,
    omega,
    zeta,
    h,
  );

  return {
    position: result.position,
    velocity: result.velocity,
  };
}

// Convergence thresholds
export const POSITION_THRESHOLD = 0.01;
export const VELOCITY_THRESHOLD = 0.01;
export const SETTLE_THRESHOLD = 0.05; // 50ms of settling

/**
 * Check if spring has converged to target
 * For double spring, checks both leader and follower
 */
export function isSettled(state: SpringState, target: number): boolean {
  const displacement = Math.abs(target - state.position);
  const speed = Math.abs(state.velocity);
  const settled =
    displacement < POSITION_THRESHOLD && speed < VELOCITY_THRESHOLD;

  // Double spring: also check leader (detected by _leader presence)
  const internal = state as InternalSpringState;
  if (internal._leader) {
    const leaderDisplacement = Math.abs(target - internal._leader.position);
    const leaderSpeed = Math.abs(internal._leader.velocity);
    const leaderSettled =
      leaderDisplacement < POSITION_THRESHOLD &&
      leaderSpeed < VELOCITY_THRESHOLD;
    return leaderSettled && settled;
  }

  return settled;
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
        frames.push(1);
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
