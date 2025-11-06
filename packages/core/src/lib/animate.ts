/**
 * Custom spring animation implementation (replacing popmotion)
 * Interface-compatible with popmotion's animate function
 * Uses optimized semi-implicit Euler method (Allen Chou's approach)
 */

import { ticker } from "./ticker";

export interface AnimateOptions {
  from: number;
  to: number;
  stiffness: number;
  damping: number;
  mass: number;
  velocity?: number;
  onUpdate: (value: number) => void;
  onComplete: () => void;
}

export interface AnimationControls {
  stop: () => void;
}

/**
 * Spring-based animation using optimized semi-implicit Euler
 * Based on Allen Chou's implementation for stability and performance
 *
 * Instead of computing F = -k(x-xt) - d*v, then a = F/m,
 * we use angular frequency (omega) and damping ratio (zeta):
 * - omega = sqrt(k/m) - angular frequency
 * - zeta = d/(2*sqrt(k*m)) - damping ratio
 *
 * Semi-implicit Euler update:
 * v += -2*h*zeta*omega*v + h*omega^2*(xt - x)
 * x += h*v
 *
 * This formulation is more stable and efficient than the naive approach.
 */
export function animate(options: AnimateOptions): AnimationControls {
  const {
    from,
    to,
    stiffness,
    damping,
    mass,
    velocity: initialVelocity = 0,
    onUpdate,
    onComplete,
  } = options;

  let position = from;
  let velocity = initialVelocity;
  let isActive = true;

  // Precompute spring constants for efficiency
  const omega = Math.sqrt(stiffness / mass); // Angular frequency
  const zeta = damping / (2 * Math.sqrt(stiffness * mass)); // Damping ratio

  // Convergence thresholds
  const POSITION_THRESHOLD = 0.01;
  const VELOCITY_THRESHOLD = 0.01;

  // Track time for stability checks
  let settleTime = 0;
  const SETTLE_THRESHOLD = 0.05; // 50ms of settling before considering complete

  const tickCallback = (deltaTime: number) => {
    if (!isActive) return;

    // Clamp deltaTime to prevent instability (max 33ms for 30fps minimum)
    const h = Math.min(deltaTime, 0.033);

    // Optimized semi-implicit Euler (Allen Chou's formulation)
    // This is mathematically equivalent but more stable and efficient
    const dampingForce = -2.0 * h * zeta * omega * velocity;
    const springForce = h * omega * omega * (to - position);
    velocity += dampingForce + springForce;
    position += h * velocity;

    // Check convergence
    const displacement = Math.abs(to - position);
    const speed = Math.abs(velocity);
    const isSettling =
      displacement < POSITION_THRESHOLD && speed < VELOCITY_THRESHOLD;

    if (isSettling) {
      settleTime += h;

      // Only complete if settled for sufficient time
      if (settleTime >= SETTLE_THRESHOLD) {
        // Snap to final value
        position = to;
        velocity = 0;
        isActive = false;

        onUpdate(position);
        ticker.unsubscribe(tickCallback);
        onComplete();
        return;
      }
    } else {
      settleTime = 0; // Reset settle timer if moving again
    }

    onUpdate(position);
  };

  // Subscribe to ticker
  ticker.subscribe(tickCallback);

  return {
    stop: () => {
      if (isActive) {
        isActive = false;
        ticker.unsubscribe(tickCallback);
      }
    },
  };
}
