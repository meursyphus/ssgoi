import { animate } from "./animate";
import type { AnimationControls, StyleObject } from "./animate/types";
import type {
  SpringConfig,
  AnimationController,
  AnimationState,
} from "../types";

export type { StyleObject };

export interface AnimatorOptions {
  from?: number;
  to?: number;
  spring?: SpringConfig;
  tick?: (progress: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
  onComplete?: () => void;
  onStart?: () => void;
}

/**
 * Animator - Spring 기반 애니메이션 컨트롤러
 *
 * tick 또는 css 옵션에 따라 내부적으로 적절한 runner 사용
 * - tick: RAF 기반 실시간 애니메이션
 * - css: Web Animation API 기반 (GPU 가속, 시뮬레이션 데이터로 velocity 추적)
 */
export class Animator implements AnimationController {
  private options: {
    from: number;
    to: number;
    spring: SpringConfig;
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
    if (options.tick && options.css) {
      throw new Error("Cannot use both 'tick' and 'css' options together");
    }

    this.options = {
      from: options.from ?? 0,
      to: options.to ?? 1,
      spring: options.spring ?? { stiffness: 300, damping: 30 },
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
      type: "single" as const,
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
  ): Animator {
    const animator = new Animator(options);
    animator.setValue(state.position);
    animator.setVelocity(state.velocity);
    return animator;
  }
}
