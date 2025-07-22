import { animate } from "popmotion";

import type { SpringConfig } from "./types";

export interface AnimationOptions {
  from: number;
  to: number;
  spring: SpringConfig;
  onUpdate: (value: number) => void;
  onComplete: () => void;
  onStart?: () => void;
}

/**
 * New Animator implementation using Popmotion
 * Provides spring-based animations with fine control
 */
export class Animator {
  private options: AnimationOptions;
  private currentValue: number;
  private velocity: number = 0;
  private isAnimating = false;
  private controls: { stop: () => void } | null = null;

  constructor(options: Partial<AnimationOptions>) {
    this.options = {
      from: options.from ?? 0,
      to: options.to ?? 1,
      spring: options.spring ?? { stiffness: 100, damping: 10 },
      onUpdate: options.onUpdate ?? (() => {}),
      onComplete: options.onComplete ?? (() => {}),
      onStart: options.onStart,
    };
    this.currentValue = this.options.from;
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
    this.controls = animate({
      from: this.currentValue,
      to: target,
      velocity: this.velocity * 1000, // Convert to px/s
      stiffness: this.options.spring.stiffness,
      damping: this.options.spring.damping,
      mass: 1,

      onUpdate: (value: number) => {
        const currentTime = performance.now();
        const timeDelta = (currentTime - previousTime) / 1000; // Convert to seconds

        if (timeDelta > 0) {
          // Calculate velocity in units per second, then normalize
          const rawVelocity = (value - previousValue) / timeDelta;
          this.velocity = rawVelocity / 1000; // Normalize to 0-1 range

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
        this.velocity = 0;
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
      const wasReversed =
        this.currentValue > (this.options.from + this.options.to) / 2;
      this.stop();
      this.animate(!wasReversed);
    }
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
  getVelocity(): number {
    return this.velocity;
  }

  getCurrentValue(): number {
    return this.currentValue;
  }

  getIsAnimating(): boolean {
    return this.isAnimating;
  }

  getCurrentState(): { position: number; velocity: number } {
    return {
      position: this.currentValue,
      velocity: this.velocity,
    };
  }

  // State setters
  setVelocity(velocity: number): void {
    this.velocity = velocity;
  }

  setValue(value: number): void {
    this.currentValue = value;
  }

  // Configuration
  updateOptions(newOptions: Partial<AnimationOptions>): void {
    this.options = { ...this.options, ...newOptions };

    // If animating, restart with new options
    if (this.isAnimating && this.controls) {
      const currentDirection = this.currentValue < this.options.to;
      this.stop();
      this.animate(!currentDirection);
    }
  }

  // Static factory method
  static fromState(
    state: { position: number; velocity: number },
    newOptions: Partial<AnimationOptions>
  ): Animator {
    const animation = new Animator(newOptions);
    animation.setValue(state.position);
    animation.setVelocity(state.velocity);
    return animation;
  }
}
