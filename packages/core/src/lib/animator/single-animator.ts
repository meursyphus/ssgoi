import { RunnerProvider, type BoundRunner } from "./runner/provider";
import type { AnimationControls, StyleObject } from "./runner/types";
import type { AnimationState, PhysicsOptions } from "../types";
import {
  IntegratorProvider,
  SpringIntegrator,
  type Integrator,
} from "./integrator";
import { Animator } from "./types";

export type { StyleObject };

// Default spring config
const DEFAULT_SPRING = { stiffness: 300, damping: 30 };

export interface AnimatorOptions {
  from?: number;
  to?: number;
  physics?: PhysicsOptions;
  tick?: (progress: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
  onComplete?: () => void;
  onStart?: () => void;
}

/**
 * SingleAnimator - Spring-based Animation Controller for single spring
 *
 * High-level API that accepts spring config or integrator factory.
 * Internally creates Integrator and selects appropriate runner.
 *
 * - tick: RAF-based real-time animation
 * - css: Web Animation API based (GPU accelerated, velocity tracking via simulation data)
 */
export class SingleAnimator extends Animator {
  private options: {
    from: number;
    to: number;
    physics?: PhysicsOptions;
    onComplete: () => void;
    onStart?: () => void;
  };
  private runner: BoundRunner | null;
  private controls: AnimationControls | null = null;
  private isAnimating = false;
  private currentValue: number;
  private currentVelocity: number = 0;
  private updateFn: (progress: number) => void;

  constructor(options: AnimatorOptions) {
    super();

    this.options = {
      from: options.from ?? 0,
      to: options.to ?? 1,
      physics: options.physics,
      onComplete: options.onComplete ?? (() => {}),
      onStart: options.onStart,
    };
    this.currentValue = this.options.from;

    // Build updateFn from tick or css
    if (options.tick) {
      this.updateFn = (p) => options.tick?.(p);
    } else if (options.css) {
      const { element, style } = options.css;
      this.updateFn = (progress: number) => {
        const styleObj = style(progress);
        for (const [key, value] of Object.entries(styleObj)) {
          (element.style as unknown as Record<string, string>)[key] =
            typeof value === "number" ? String(value) : value;
        }
      };
    } else {
      this.updateFn = () => {};
    }

    // Create bound runner at construction time
    this.runner = RunnerProvider.from({
      tick: options.tick,
      css: options.css,
    });
  }

  /**
   * Sync element state to current progress value
   * Uses the update callback if provided
   */
  syncState(): void {
    this.updateFn?.(this.currentValue);
  }

  /**
   * Create Integrator from physics options
   * Priority: integrator factory > inertia/spring config > default spring
   */
  private createIntegrator(): Integrator {
    const physics = this.options.physics;

    if (physics?.integrator) {
      return physics.integrator();
    }

    if (physics?.spring || physics?.inertia) {
      return IntegratorProvider.from({
        spring: physics.spring,
        inertia: physics.inertia,
      });
    }

    return new SpringIntegrator(DEFAULT_SPRING);
  }

  private runAnimation(targetValue: number) {
    this.isAnimating = true;

    // No animation mode - complete immediately
    if (!this.runner) {
      this.options.onStart?.();
      this.currentValue = targetValue;
      this.currentVelocity = 0;
      this.isAnimating = false;
      this.options.onComplete();
      return;
    }

    this.controls = this.runner({
      integrator: this.createIntegrator(),
      from: this.currentValue,
      to: targetValue,
      velocity: this.currentVelocity,
      onStart: this.options.onStart,
      onComplete: () => {
        this.currentValue = targetValue;
        this.currentVelocity = 0;
        this.isAnimating = false;
        this.controls = null;
        this.options.onComplete();
      },
    });
  }

  forward(): void {
    this.stop();
    this.runAnimation(this.options.to);
  }

  backward(): void {
    this.stop();
    this.runAnimation(this.options.from);
  }

  reverse(): void {
    const temp = this.options.from;
    this.options.from = this.options.to;
    this.options.to = temp;

    if (this.isAnimating) {
      this.stop();
      this.runAnimation(this.options.to);
    }
  }

  stop(): void {
    if (this.controls) {
      // Save current state before stopping
      this.currentValue = this.controls.getPosition();
      this.currentVelocity = this.controls.getVelocity();
      this.controls.stop();
      this.controls = null;
    }
    this.isAnimating = false;
  }

  getVelocity(): number {
    return this.controls?.getVelocity() ?? this.currentVelocity;
  }

  getCurrentValue(): number {
    return this.controls?.getPosition() ?? this.currentValue;
  }

  getIsAnimating(): boolean {
    return this.isAnimating;
  }

  getCurrentState(): AnimationState {
    return {
      position: this.getCurrentValue(),
      velocity: this.getVelocity(),
      from: this.options.from,
      to: this.options.to,
    };
  }

  setValue(value: number): void {
    this.currentValue = value;
  }

  setVelocity(velocity: number): void {
    this.currentVelocity = velocity;
  }

  updateOptions(newOptions: Partial<AnimatorOptions>): void {
    this.options = { ...this.options, ...newOptions } as typeof this.options;
  }
}
