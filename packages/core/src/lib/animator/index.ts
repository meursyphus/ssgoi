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
    onStart: () => void;
  };
  private controls: AnimationControls | null = null;
  private isAnimating = false;

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
      onStart: options.onStart ?? (() => {}),
    };
  }

  private runAnimation(reverse: boolean = false) {
    this.isAnimating = true;

    const from = reverse ? this.options.to : this.options.from;
    const to = reverse ? this.options.from : this.options.to;

    const currentPos = this.controls?.getPosition() ?? from;
    const currentVel = this.controls?.getVelocity() ?? 0;

    this.controls = animate({
      from: currentPos,
      to,
      spring: this.options.spring,
      velocity: currentVel,
      tick: this.options.tick,
      css: this.options.css,
      onStart: this.options.onStart,
      onComplete: () => {
        this.isAnimating = false;
        this.controls = null;
        this.options.onComplete();
      },
    });
  }

  forward(): void {
    this.stop();
    this.runAnimation(false);
  }

  backward(): void {
    this.stop();
    this.runAnimation(true);
  }

  reverse(): void {
    const temp = this.options.from;
    this.options.from = this.options.to;
    this.options.to = temp;

    if (this.isAnimating) {
      this.stop();
      this.runAnimation(false);
    }
  }

  stop(): void {
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
    }
    this.isAnimating = false;
  }

  getVelocity(): number {
    return this.controls?.getVelocity() ?? 0;
  }

  getCurrentValue(): number {
    return this.controls?.getPosition() ?? this.options.from;
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

  updateOptions(newOptions: Partial<AnimatorOptions>): void {
    this.options = { ...this.options, ...newOptions } as typeof this.options;
  }

  static fromState(
    state: { position: number; velocity?: number },
    options: AnimatorOptions,
  ): Animator {
    const animator = new Animator({
      ...options,
      from: state.position,
    });
    return animator;
  }
}
