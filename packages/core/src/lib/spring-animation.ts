 
import { ticker } from "./ticker";

/**
 * Options for spring animation
 */
export interface SpringAnimationOptions {
  from: number;
  to: number;
  stiffness: number;
  damping: number;
  mass: number;
  velocity?: number;
  onUpdate: (value: number) => void;
  onComplete: () => void;
}

/**
 * Animation controls returned by animate()
 */
export interface AnimationControls {
  stop: () => void;
}

/**
 * Spring animation implementation using physics simulation
 * Based on spring-damper system: F = -kx - cv
 * where k is stiffness, c is damping coefficient, v is velocity
 */
export function animate(options: SpringAnimationOptions): AnimationControls {
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

  let currentValue = from;
  let currentVelocity = initialVelocity;
  let lastTime = performance.now();
  let isStopped = false;

  // Spring physics constants
  const target = to;
  const restThreshold = 0.001; // Position threshold for completion
  const velocityThreshold = 0.001; // Velocity threshold for completion

  const tick = (currentTime: number) => {
    if (isStopped) return;

    // Calculate delta time in seconds
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap at 100ms
    lastTime = currentTime;

    // Spring physics calculation
    // F = -k * x - c * v
    // where x is displacement from target, v is velocity
    const displacement = currentValue - target;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * currentVelocity;
    const totalForce = springForce + dampingForce;

    // Apply force: a = F / m
    const acceleration = totalForce / mass;

    // Update velocity and position using semi-implicit Euler integration
    currentVelocity += acceleration * deltaTime;
    currentValue += currentVelocity * deltaTime;

    // Check if animation should complete
    const isAtRest =
      Math.abs(displacement) < restThreshold &&
      Math.abs(currentVelocity) < velocityThreshold;

    if (isAtRest) {
      // Snap to target and complete
      currentValue = target;
      onUpdate(currentValue);
      unsubscribe(); // Unsubscribe before calling onComplete
      onComplete();
      return;
    }

    // Update and continue
    onUpdate(currentValue);
  };

  // Subscribe to centralized ticker
  const unsubscribe = ticker.subscribe(tick);

  // Return controls
  return {
    stop: () => {
      if (isStopped) return;
      isStopped = true;
      unsubscribe();
    },
  };
}
