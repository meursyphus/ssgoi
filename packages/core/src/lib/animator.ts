import type { SpringConfig } from "./types";
import { VSync } from "./vsync";

interface AnimationOptions {
  from: number;
  to: number;
  spring: SpringConfig;
  onUpdate: (value: number) => void;
  onComplete: () => void; // Now non-nullable with default
  onStart?: () => void;
}
/**
 * TODO: requestAnimationFrame() singleton pattern
 */

/**
 * Animation class that provides fine control over animations
 *
 * Features:
 * - updateOptions(): Change duration/easing mid-animation smoothly
 * - reverse(): Reverse direction while maintaining velocity
 * - getVelocity(): Get current velocity for smooth transitions
 * - getCurrentValue(): Get current progress value
 */
export class Animator {
  private options: AnimationOptions;
  private currentValue: number;
  private velocity: number = 0;
  private lastTime: number | null = null;
  private animationId: number | null = null;
  private isAnimating = false;

  constructor(options: Partial<AnimationOptions>) {
    // Set defaults for all fields
    this.options = {
      from: options.from ?? 0,
      to: options.to ?? 1,
      spring: options.spring ?? { stiffness: 100, damping: 10 },
      onUpdate: options.onUpdate ?? (() => {}),
      onComplete: options.onComplete ?? (() => {}),
      onStart: options.onStart,
    };
    this.currentValue = this.options.from;
    this.lastTime = null; // Will be set when animation starts
  }

  private animate = async (reverse: boolean = false) => {
    // Call onStart on first frame
    if (!this.isAnimating && this.options.onStart) {
      this.options.onStart();
    }

    this.isAnimating = true;
    const now = performance.now();

    // First frame: use a reasonable default deltaTime (16.67ms = 60fps)
    const deltaTime =
      this.lastTime === null
        ? 0.01667 // 60fps default
        : Math.min((now - this.lastTime) / 1000, 0.1); // Cap at 100ms

    this.lastTime = now;

    // Spring physics using Runge-Kutta method for better stability
    const spring = this.options.spring;
    const stiffness = spring.stiffness;
    const damping = spring.damping;
    // Use reversed target if animating in reverse
    const target = reverse ? this.options.from : this.options.to;
    const mass = 1; // Fixed mass

    // Current state
    const currentState = {
      position: this.currentValue,
      velocity: this.velocity,
    };

    // Runge-Kutta 4th order integration
    const newState = this.rungeKuttaStep(
      currentState,
      target,
      stiffness,
      damping,
      mass,
      deltaTime
    );

    // Update current values
    this.currentValue = newState.position;
    this.velocity = newState.velocity;

    // Call user's update function
    this.options.onUpdate(this.currentValue);

    // Check if animation is complete (close to target and low velocity)
    const displacement = this.currentValue - target;
    const isComplete =
      Math.abs(displacement) < 0.01 && Math.abs(this.velocity) < 0.01;

    if (!isComplete) {
      this.animationId = VSync.requestAnimationFrame(() => this.animate(reverse));
    } else {
      // Snap to final value
      this.currentValue = target;
      this.options.onUpdate(this.currentValue);
      this.animationId = null;
      this.isAnimating = false;
      this.lastTime = null; // Reset for next animation
      this.options.onComplete();
    }
  };

  /**
   * Runge-Kutta 4th order method for spring physics integration
   * More accurate and stable than simple Euler method
   */
  private rungeKuttaStep(
    state: { position: number; velocity: number },
    target: number,
    stiffness: number,
    damping: number,
    mass: number,
    dt: number
  ) {
    const { position: x, velocity: v } = state;

    // Spring acceleration function: a = (-k(x - target) - cv) / m
    const acceleration = (pos: number, vel: number) => {
      const displacement = pos - target;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * vel;
      return (springForce + dampingForce) / mass;
    };

    // k1: derivatives at current state
    const k1 = {
      velocity: v,
      acceleration: acceleration(x, v),
    };

    // k2: derivatives at midpoint using k1
    const k2 = {
      velocity: v + (dt * k1.acceleration) / 2,
      acceleration: acceleration(
        x + (dt * k1.velocity) / 2,
        v + (dt * k1.acceleration) / 2
      ),
    };

    // k3: derivatives at midpoint using k2
    const k3 = {
      velocity: v + (dt * k2.acceleration) / 2,
      acceleration: acceleration(
        x + (dt * k2.velocity) / 2,
        v + (dt * k2.acceleration) / 2
      ),
    };

    // k4: derivatives at endpoint using k3
    const k4 = {
      velocity: v + dt * k3.acceleration,
      acceleration: acceleration(
        x + dt * k3.velocity,
        v + dt * k3.acceleration
      ),
    };

    // Weighted average for final state
    return {
      position:
        x +
        (dt * (k1.velocity + 2 * k2.velocity + 2 * k3.velocity + k4.velocity)) /
          6,
      velocity:
        v +
        (dt *
          (k1.acceleration +
            2 * k2.acceleration +
            2 * k3.acceleration +
            k4.acceleration)) /
          6,
    };
  }

  /**
   * Update animation options mid-flight
   * Handles spring parameter changes smoothly
   */
  updateOptions(newOptions: Partial<AnimationOptions>) {
    // UX: When spring parameters change:
    // - Velocity is preserved for natural motion
    // - No sudden jumps or jerks
    // - Current position always maintained

    // Apply new options
    this.options = { ...this.options, ...newOptions };

    // No need to restart animation - spring physics naturally adapts to new parameters
  }

  /**
   * Start or continue animation in forward direction (from → to)
   */
  forward() {
    this.animate(false);
  }

  /**
   * Start or continue animation in backward direction (to → from)
   */
  backward() {
    this.animate(true);
  }

  /**
   * Reverse animation direction
   * Swaps from and to values, useful for changing direction mid-animation
   */
  reverse() {
    // Swap from and to
    const temp = this.options.from;
    this.options.from = this.options.to;
    this.options.to = temp;
  }

  /**
   * Stop the animation
   */
  stop() {
    this.isAnimating = false;
    if (this.animationId) {
      VSync.cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.lastTime = null; // Reset for next animation
  }

  /**
   * Get current velocity (useful for physics-based transitions)
   */
  getVelocity(): number {
    return this.velocity;
  }

  /**
   * Get current value
   */
  getCurrentValue(): number {
    return this.currentValue;
  }

  /**
   * Check if animation is currently running
   */
  getIsAnimating(): boolean {
    return this.isAnimating;
  }

  /**
   * Get current animation state for transferring to new animation
   */
  getCurrentState(): {
    position: number;
    velocity: number;
  } {
    return {
      position: this.currentValue,
      velocity: this.velocity,
    };
  }

  /**
   * Set velocity (for transferring state between animations)
   */
  setVelocity(velocity: number): void {
    this.velocity = velocity;
  }

  /**
   * Set current value/position (for transferring state between animations)
   */
  setValue(value: number): void {
    this.currentValue = value;
  }

  /**
   * Create new animation from current state with reversed direction
   */
  static fromState(
    state: { position: number; velocity: number },
    newOptions: Partial<AnimationOptions>
  ): Animator {
    const animation = new Animator({
      ...newOptions,
    });

    // Set the state from previous animation
    animation.setValue(state.position);
    animation.setVelocity(state.velocity);

    return animation;
  }
}
