/* eslint-disable @typescript-eslint/no-explicit-any */
import { animate } from "./spring-animation";

import type {
  SpringConfig,
  AnimationController,
  AnimationState,
} from "./types";

export interface AnimationOptions<TAnimationValue = number> {
  from: TAnimationValue;
  to: TAnimationValue;
  spring: SpringConfig;
  onUpdate: (value: TAnimationValue) => void;
  onComplete: () => void;
  onStart?: () => void;
}

/**
 * Animator implementation with custom spring physics
 * Provides spring-based animations with fine control
 * Supports both number and object animations
 *
 * @template TAnimationValue - The type of value being animated (number | object)
 */
export class Animator<TAnimationValue = number>
  implements AnimationController<TAnimationValue>
{
  private options: AnimationOptions<TAnimationValue>;
  private currentValue: TAnimationValue;
  private velocity: TAnimationValue extends number
    ? number
    : Record<string, number>;
  private isAnimating = false;
  private controls: { stop: () => void } | null = null;

  // For object animations
  private animationMap: Map<string, { stop: () => void }> | null = null;
  private activeAnimations = new Set<string>();
  private completedAnimations = new Set<string>();
  private updatedProperties = new Set<string>();

  constructor(options: Partial<AnimationOptions<TAnimationValue>>) {
    this.options = {
      from: options.from ?? (0 as TAnimationValue),
      to: options.to ?? (1 as TAnimationValue),
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
      this.velocity = velocityObj as TAnimationValue extends number
        ? number
        : Record<string, number>;
    } else {
      this.velocity = 0 as TAnimationValue extends number
        ? number
        : Record<string, number>;
    }
  }

  private animate = (reverse: boolean = false) => {
    // Call onStart on first frame
    if (!this.isAnimating && this.options.onStart) {
      this.options.onStart();
    }

    this.isAnimating = true;

    const target = reverse ? this.options.from : this.options.to;

    // Handle object animations differently
    if (typeof this.currentValue === "object" && this.currentValue !== null) {
      this.animateObject(target as any);
      return;
    }

    // Track previous value for velocity calculation
    let previousValue = this.currentValue;
    let previousTime = performance.now();

    // Create animation for numbers
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

      onUpdate: (value: TAnimationValue) => {
        const currentTime = performance.now();
        const timeDelta = (currentTime - previousTime) / 1000; // Convert to seconds

        if (timeDelta > 0) {
          // Calculate velocity based on type
          if (typeof value === "number" && typeof previousValue === "number") {
            // For numbers, calculate velocity in units per second, then normalize
            const rawVelocity = (value - previousValue) / timeDelta;
            this.velocity = (rawVelocity /
              1000) as TAnimationValue extends number
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
            this.velocity = velocityObj as TAnimationValue extends number
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
          this.velocity = 0 as TAnimationValue extends number
            ? number
            : Record<string, number>;
        }

        this.options.onComplete();
      },
    });
  };

  private animateObject = (target: any) => {
    const from = this.currentValue as any;
    const keys = Object.keys(from);

    // Initialize animations map
    this.animationMap = new Map();
    this.activeAnimations.clear();
    this.completedAnimations.clear();
    this.updatedProperties.clear();

    // Track values and timing for velocity calculation
    const currentValues: any = { ...from };
    const lastUpdateTime: Record<string, number> = {};
    let firstUpdateReceived = false;

    // Function to check if all active properties have been updated
    const checkAndFireUpdate = () => {
      // Only fire update if all active (non-completed) properties have been updated
      const activeKeys = keys.filter((k) => !this.completedAnimations.has(k));
      const allActiveUpdated = activeKeys.every((k) =>
        this.updatedProperties.has(k),
      );

      if (allActiveUpdated && activeKeys.length > 0) {
        // Calculate velocity for each property
        if (typeof this.velocity === "object" && this.velocity) {
          const currentTime = performance.now();

          Object.keys(currentValues).forEach((k) => {
            if (lastUpdateTime[k]) {
              const timeDelta = (currentTime - lastUpdateTime[k]) / 1000;
              const prevVal = (this.currentValue as any)[k];
              const currVal = currentValues[k];

              if (
                typeof prevVal === "number" &&
                typeof currVal === "number" &&
                timeDelta > 0
              ) {
                (this.velocity as any)[k] =
                  (currVal - prevVal) / timeDelta / 1000;
              }
            }
            lastUpdateTime[k] = currentTime;
          });
        }

        // Update current value and fire callback
        this.currentValue = { ...currentValues } as TAnimationValue;
        this.options.onUpdate(this.currentValue);

        // Clear updated properties for next frame
        this.updatedProperties.clear();

        // Call onStart only once after first update
        if (!firstUpdateReceived && this.options.onStart) {
          firstUpdateReceived = true;
          this.options.onStart();
        }
      }
    };

    // Create animation for each property
    keys.forEach((key) => {
      this.activeAnimations.add(key);

      const animateOptions: any = {
        from: from[key],
        to: target[key],
        stiffness: this.options.spring.stiffness,
        damping: this.options.spring.damping,
        mass: 1,
      };

      // Add velocity if exists
      if (
        typeof this.velocity === "object" &&
        this.velocity &&
        key in this.velocity
      ) {
        animateOptions.velocity = (this.velocity as any)[key] * 1000;
      }

      const animation = animate({
        ...animateOptions,
        onUpdate: (value: number) => {
          currentValues[key] = value;
          this.updatedProperties.add(key);

          // Check if we should fire the update callback
          checkAndFireUpdate();
        },
        onComplete: () => {
          this.completedAnimations.add(key);
          this.updatedProperties.delete(key); // Remove from updated set

          // Check if all animations completed
          if (this.completedAnimations.size === keys.length) {
            this.currentValue = target;
            this.isAnimating = false;
            this.animationMap = null;

            // Reset velocity
            if (typeof this.velocity === "object" && this.velocity) {
              Object.keys(this.velocity).forEach((k) => {
                (this.velocity as any)[k] = 0;
              });
            }

            this.options.onComplete();
          }
        },
      });

      this.animationMap!.set(key, animation);
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

    // Stop number animation
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
    }

    // Stop object animations
    if (this.animationMap) {
      this.animationMap.forEach((animation) => {
        animation.stop();
      });
      this.animationMap.clear();
      this.animationMap = null;
    }

    // Clear update tracking
    this.updatedProperties.clear();

    // Preserve velocity when stopping
  }

  // State getters
  getVelocity(): TAnimationValue extends number
    ? number
    : Record<string, number> {
    return this.velocity;
  }

  getCurrentValue(): TAnimationValue {
    return this.currentValue;
  }

  getIsAnimating(): boolean {
    return this.isAnimating;
  }

  getCurrentState(): AnimationState<TAnimationValue> {
    return {
      type: "single" as const,
      position: this.currentValue,
      velocity: this.velocity,
      from: this.options.from,
      to: this.options.to,
    };
  }

  // State setters
  setVelocity(
    velocity: TAnimationValue extends number ? number : Record<string, number>,
  ): void {
    this.velocity = velocity;
  }

  setValue(value: TAnimationValue): void {
    this.currentValue = value;
  }

  // Configuration
  updateOptions(newOptions: Partial<AnimationOptions<TAnimationValue>>): void {
    this.options = { ...this.options, ...newOptions };

    // If animating, restart with new options
    if (this.isAnimating && this.controls) {
      const currentDirection = this.shouldReverse();
      this.stop();
      this.animate(!currentDirection);
    }
  }

  // Static factory method
  static fromState<TAnimationValue = number>(
    state: {
      position: TAnimationValue;
      velocity: TAnimationValue extends number
        ? number
        : Record<string, number>;
    },
    newOptions: Partial<AnimationOptions<TAnimationValue>>,
  ): Animator<TAnimationValue> {
    const animation = new Animator<TAnimationValue>(newOptions);
    animation.setValue(state.position);
    animation.setVelocity(state.velocity);
    return animation;
  }
}
