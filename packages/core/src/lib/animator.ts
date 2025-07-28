import { animate } from "popmotion";

import type { SpringConfig } from "./types";

export interface AnimationOptions<T = number> {
  from: T;
  to: T;
  spring: SpringConfig;
  onUpdate: (value: T) => void;
  onComplete: () => void;
  onStart?: () => void;
}

/**
 * New Animator implementation using Popmotion
 * Provides spring-based animations with fine control
 * Supports both number and object animations
 */
export class Animator<T = number> {
  private options: AnimationOptions<T>;
  private currentValue: T;
  private velocity: T extends number ? number : Record<string, number>;
  private isAnimating = false;
  private controls: { stop: () => void } | null = null;

  constructor(options: Partial<AnimationOptions<T>>) {
    this.options = {
      from: options.from ?? (0 as T),
      to: options.to ?? (1 as T),
      spring: options.spring ?? { stiffness: 100, damping: 10 },
      onUpdate: options.onUpdate ?? (() => {}),
      onComplete: options.onComplete ?? (() => {}),
      onStart: options.onStart,
    };
    this.currentValue = this.options.from;

    // Initialize velocity based on type
    if (typeof this.options.from === "object" && this.options.from !== null) {
      const velocityObj: Record<string, number> = {};
      Object.keys(this.options.from).forEach((key) => {
        velocityObj[key] = 0;
      });
      this.velocity = velocityObj as T extends number
        ? number
        : Record<string, number>;
    } else {
      this.velocity = 0 as T extends number ? number : Record<string, number>;
    }
  }

  private animate = (reverse: boolean = false) => {
    // Call onStart on first frame
    if (!this.isAnimating && this.options.onStart) {
      this.options.onStart();
    }

    this.isAnimating = true;

    const target = reverse ? this.options.from : this.options.to;

    // Track previous value for velocity calculation
    let previousValue = this.currentValue;
    let previousTime = performance.now();

    // Create animation
    const animateOptions: any = {
      from: this.currentValue,
      to: target,
      stiffness: this.options.spring.stiffness,
      damping: this.options.spring.damping,
      mass: 1,
    };

    // Add velocity only for number animations
    if (typeof this.velocity === "number") {
      animateOptions.velocity = this.velocity * 1000; // Convert to px/s
    }

    this.controls = animate({
      ...animateOptions,

      onUpdate: (value: T) => {
        const currentTime = performance.now();
        const timeDelta = (currentTime - previousTime) / 1000; // Convert to seconds

        if (timeDelta > 0) {
          // Calculate velocity based on type
          if (typeof value === "number" && typeof previousValue === "number") {
            // For numbers, calculate velocity in units per second, then normalize
            const rawVelocity = (value - previousValue) / timeDelta;
            this.velocity = (rawVelocity / 1000) as T extends number
              ? number
              : Record<string, number>; // Normalize to 0-1 range
          } else if (typeof value === "object" && value !== null) {
            // For objects, calculate velocity for each property
            const velocityObj: Record<string, number> = {};
            Object.keys(value).forEach((key) => {
              const currentVal = (value as any)[key];
              const prevVal = (previousValue as any)[key];
              if (
                typeof currentVal === "number" &&
                typeof prevVal === "number"
              ) {
                const rawVelocity = (currentVal - prevVal) / timeDelta;
                velocityObj[key] = rawVelocity / 1000; // Normalize to 0-1 range
              }
            });
            this.velocity = velocityObj as T extends number
              ? number
              : Record<string, number>;
          }

          previousValue = value;
          previousTime = currentTime;
        }

        this.currentValue = value;
        this.options.onUpdate(value);
      },
      onComplete: () => {
        this.currentValue = target;
        this.isAnimating = false;
        this.controls = null;

        // Reset velocity
        if (typeof this.velocity === "object" && this.velocity !== null) {
          Object.keys(this.velocity).forEach((key) => {
            (this.velocity as Record<string, number>)[key] = 0;
          });
        } else {
          this.velocity = 0 as T extends number
            ? number
            : Record<string, number>;
        }

        this.options.onComplete();
      },
    });
  };

  // Animation control methods
  forward(): void {
    this.stop();
    this.animate(false);
  }

  backward(): void {
    this.stop();
    this.animate(true);
  }

  reverse(): void {
    // Swap from and to
    const temp = this.options.from;
    this.options.from = this.options.to;
    this.options.to = temp;

    // If currently animating, restart with new direction
    if (this.isAnimating) {
      const wasReversed = this.shouldReverse();
      this.stop();
      this.animate(!wasReversed);
    }
  }

  private shouldReverse(): boolean {
    if (
      typeof this.currentValue === "number" &&
      typeof this.options.from === "number" &&
      typeof this.options.to === "number"
    ) {
      return this.currentValue > (this.options.from + this.options.to) / 2;
    }
    // For objects, we can't easily determine midpoint, so default to false
    return false;
  }

  stop(): void {
    this.isAnimating = false;
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
    }
    // Preserve velocity when stopping
  }

  // State getters
  getVelocity(): T extends number ? number : Record<string, number> {
    return this.velocity;
  }

  getCurrentValue(): T {
    return this.currentValue;
  }

  getIsAnimating(): boolean {
    return this.isAnimating;
  }

  getCurrentState(): {
    position: T;
    velocity: T extends number ? number : Record<string, number>;
    from: T;
    to: T;
  } {
    return {
      position: this.currentValue,
      velocity: this.velocity,
      from: this.options.from,
      to: this.options.to,
    };
  }

  // State setters
  setVelocity(
    velocity: T extends number ? number : Record<string, number>
  ): void {
    this.velocity = velocity;
  }

  setValue(value: T): void {
    this.currentValue = value;
  }

  // Configuration
  updateOptions(newOptions: Partial<AnimationOptions<T>>): void {
    this.options = { ...this.options, ...newOptions };

    // If animating, restart with new options
    if (this.isAnimating && this.controls) {
      const currentDirection = this.shouldReverse();
      this.stop();
      this.animate(!currentDirection);
    }
  }

  // Static factory method
  static fromState<T = number>(
    state: {
      position: T;
      velocity: T extends number ? number : Record<string, number>;
    },
    newOptions: Partial<AnimationOptions<T>>
  ): Animator<T> {
    const animation = new Animator<T>(newOptions);
    animation.setValue(state.position);
    animation.setVelocity(state.velocity);
    return animation;
  }
}
