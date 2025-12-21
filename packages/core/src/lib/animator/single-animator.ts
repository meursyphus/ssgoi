import { animate } from "./runner";
import type { AnimationControls, StyleObject } from "./runner/types";
import type { SpringConfig, AnimationState, IntegratorFactory } from "../types";
import { Animator } from "./types";

export type { StyleObject };

export interface AnimatorOptions {
  from?: number;
  to?: number;
  spring?: SpringConfig;
  integrator?: IntegratorFactory;
  tick?: (progress: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
  onComplete?: () => void;
  onStart?: () => void;
}

/**
 * Animator - Spring-based Animation Controller for single spring
 *
 * Internally selects appropriate runner based on tick or css option
 * - tick: RAF-based real-time animation
 * - css: Web Animation API based (GPU accelerated, velocity tracking via simulation data)
 */
export class SingleAnimator extends Animator {
  private options: {
    from: number;
    to: number;
    spring?: SpringConfig;
    integrator?: IntegratorFactory;
    tick?: (progress: number) => void;
    css?: {
      element: HTMLElement;
      style: (progress: number) => StyleObject;
    };
    onComplete: () => void;
    onStart?: () => void;
  };
  private controls: AnimationControls | null = null;
  private isAnimating = false;
  private currentValue: number;
  private currentVelocity: number = 0;

  constructor(options: AnimatorOptions) {
    super();

    if (options.tick && options.css) {
      throw new Error("Cannot use both 'tick' and 'css' options together");
    }

    if (options.spring && options.integrator) {
      throw new Error(
        "Cannot use both 'spring' and 'integrator' options together",
      );
    }

    this.options = {
      from: options.from ?? 0,
      to: options.to ?? 1,
      spring: options.spring,
      integrator: options.integrator,
      tick: options.tick,
      css: options.css,
      onComplete: options.onComplete ?? (() => {}),
      onStart: options.onStart,
    };
    this.currentValue = this.options.from;
  }

  private runAnimation(targetValue: number) {
    this.isAnimating = true;

    this.controls = animate({
      from: this.currentValue,
      to: targetValue,
      spring: this.options.spring,
      integrator: this.options.integrator,
      velocity: this.currentVelocity,
      tick: this.options.tick,
      css: this.options.css,
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

  static fromState(
    state: { position: number; velocity: number },
    options: AnimatorOptions,
  ): SingleAnimator {
    const animator = new SingleAnimator(options);
    animator.setValue(state.position);
    animator.setVelocity(state.velocity);
    return animator;
  }
}
