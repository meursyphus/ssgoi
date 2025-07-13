import type { TransitionConfig, SpringConfig } from "./types";

interface AnimationOptions {
  from: number;
  to: number;
  spring: SpringConfig;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}

/**
 * Animation class that provides fine control over animations
 *
 * Features:
 * - updateOptions(): Change duration/easing mid-animation smoothly
 * - reverse(): Reverse direction while maintaining velocity
 * - getVelocity(): Get current velocity for smooth transitions
 * - getCurrentValue(): Get current progress value
 */
class Animation {
  private options: AnimationOptions;
  private startTime: number;
  private currentValue: number;
  private velocity: number = 0;
  private lastTime: number;
  private animationId: number | null = null;
  private isPaused = false;

  constructor(options: AnimationOptions) {
    this.options = {
      ...options,
      spring: {
        stiffness: options.spring?.stiffness ?? 100,
        damping: options.spring?.damping ?? 10,
      },
    };
    this.currentValue = options.from;
    this.startTime = performance.now();
    this.lastTime = this.startTime;

    this.animate();
  }

  private animate = async () => {
    if (this.isPaused) return;

    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000; // Convert to seconds for physics
    this.lastTime = now;

    // Spring physics animation
    const { stiffness = 100, damping = 10 } = this.options.spring;

    // Spring physics: F = -kx - cv
    const displacement = this.currentValue - this.options.to;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * this.velocity;

    // Update velocity and position
    const acceleration = springForce + dampingForce; // mass = 1
    this.velocity += acceleration * deltaTime;
    this.currentValue += this.velocity * deltaTime;

    // Call user's update function
    this.options.onUpdate(this.currentValue);

    // Check if animation is complete (close to target and low velocity)
    const isComplete =
      Math.abs(displacement) < 0.001 && Math.abs(this.velocity) < 0.001;

    if (!isComplete) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      // Snap to final value
      this.currentValue = this.options.to;
      this.options.onUpdate(this.currentValue);
      this.animationId = null;
      this.options.onComplete?.();
    }
  };

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

    // If spring parameters changed, update them
    if (newOptions.spring) {
      this.options.spring = {
        stiffness: newOptions.spring.stiffness ?? this.options.spring.stiffness,
        damping: newOptions.spring.damping ?? this.options.spring.damping,
      };
    }

    // If from/to changed, velocity naturally handles the transition
    // No need to restart - spring physics will smoothly adapt
  }

  /**
   * Reverse animation direction
   * Maintains current velocity for smooth motion
   */
  reverse() {
    // UX: When reversing (e.g., hover out while hover in is still running):
    // - Should reverse from current position, not jump to end
    // - Velocity is maintained for natural motion

    const temp = this.options.from;
    this.options.from = this.options.to;
    this.options.to = temp;

    // Start from current position
    this.options.from = this.currentValue;
    this.startTime = performance.now();
  }

  /**
   * Stop the animation
   */
  stop() {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
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
}

export interface RunTransitionOptions {
  getConfig: () => TransitionConfig | Promise<TransitionConfig>;
  direction?: "forward" | "backward";
  onComplete?: () => void;
}

/**
 * Core animation engine that runs a transition
 * Uses Animation class internally for fine control
 */
export function runTransition({
  getConfig,
  direction = "forward",
  onComplete,
}: RunTransitionOptions): () => void {
  let animation: Animation | null = null;
  let lastConfig: TransitionConfig | null = null;

  // Start the animation
  const start = async () => {
    const config = await Promise.resolve(getConfig());
    lastConfig = config;

    animation = new Animation({
      from: direction === "forward" ? 0 : 1,
      to: direction === "forward" ? 1 : 0,
      spring: config.spring || { stiffness: 100, damping: 10 },
      onUpdate: (value) => {
        config.tick?.(value);

        // Check if config changed and update animation accordingly
        Promise.resolve(getConfig()).then((newConfig) => {
          if (!animation) return;

          // Detect changes
          const springChanged =
            JSON.stringify(newConfig.spring) !==
            JSON.stringify(lastConfig?.spring);

          if (springChanged) {
            animation.updateOptions({
              spring: newConfig.spring,
            });
            lastConfig = newConfig;
          }
        });
      },
      onComplete,
    });
  };

  start();

  // Return cleanup function
  return () => {
    animation?.stop();
  };
}
