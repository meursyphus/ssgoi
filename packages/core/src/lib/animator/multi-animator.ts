import { SingleAnimator } from "./single-animator";
import { Animator } from "./types";
import type {
  NormalizedMultiSpringConfig,
  NormalizedSpringItem,
  AnimationState,
} from "../types";

/**
 * Entry to track individual spring animation state
 */
type AnimatorEntry = {
  id: string;
  item: NormalizedSpringItem;
  animator: SingleAnimator;
  started: boolean;
};

export interface MultiAnimatorOptions {
  config: NormalizedMultiSpringConfig;
  from: number;
  to: number;
}

/**
 * MultiAnimator - Coordinates multiple spring animations
 *
 * Extends Animation base class to provide unified interface.
 * Manages the lifecycle and timing of multiple spring animations.
 *
 * All scheduling is progress-based using normalizedOffset (0-1):
 * - offset 0: Start immediately with previous spring
 * - offset 1: Start after previous spring completes
 * - offset 0-1: Start when previous spring reaches this progress
 *
 * Config must be pre-normalized using normalizeMultiSpringSchedule()
 */
export class MultiAnimator extends Animator {
  private config: NormalizedMultiSpringConfig;
  private animators: Map<string, AnimatorEntry> = new Map();
  private springOrder: string[] = [];
  private completedCount = 0;
  private completedAnimators = new Set<string>();
  private direction: "forward" | "backward" = "forward";
  private idCounter = 0;
  private rafId: number | null = null;
  private from: number;
  private to: number;

  constructor(options: MultiAnimatorOptions) {
    super();
    this.config = options.config;
    this.from = options.from;
    this.to = options.to;
    this.initializeAnimators();
  }

  private generateId(): string {
    return `spring_${this.idCounter++}`;
  }

  private initializeAnimators(): void {
    this.config.springs.forEach((item) => {
      const id = this.generateId();
      const animator = new SingleAnimator({
        from: this.from,
        to: this.to,
        physics: item.physics,
        tick: item.tick,
        css: item.css,
        onComplete: () => this.onAnimatorComplete(id),
        onStart: item.onStart,
      });

      this.animators.set(id, {
        id,
        item,
        animator,
        started: false,
      });
      this.springOrder.push(id);
    });
  }

  /**
   * Calculate progress of an animator (0-1)
   * Progress = |position - from| / |to - from|
   */
  private getAnimatorProgress(entry: AnimatorEntry): number {
    const state = entry.animator.getCurrentState();
    const range = Math.abs(state.to - state.from);
    if (range === 0) return 1;
    return Math.abs(state.position - state.from) / range;
  }

  /**
   * Get order of springs based on direction
   * Forward: 0, 1, 2, ...
   * Backward: n-1, n-2, ..., 0
   */
  private getOrderedIds(): string[] {
    if (this.direction === "forward") {
      return this.springOrder;
    }
    return [...this.springOrder].reverse();
  }

  private onAnimatorComplete(id: string): void {
    const entry = this.animators.get(id);
    if (!entry || this.completedAnimators.has(id)) {
      return;
    }
    this.completedAnimators.add(id);

    this.completedCount++;
    entry.item.onComplete?.();
    this.config.onProgress?.(this.completedCount, this.config.springs.length);

    if (this.completedCount === this.config.springs.length) {
      this.stopScheduler();
      this.config.onEnd?.();
    }
  }

  /**
   * Check and start springs based on previous spring's progress
   * Called on each frame while animation is running
   */
  private checkAndStartSprings(): void {
    const orderedIds = this.getOrderedIds();

    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i]!;
      const entry = this.animators.get(id);
      if (!entry || entry.started) continue;

      // First spring always starts immediately
      if (i === 0) {
        this.startAnimator(id);
        continue;
      }

      // Check previous spring's progress
      const prevId = orderedIds[i - 1]!;
      const prevEntry = this.animators.get(prevId);
      if (!prevEntry || !prevEntry.started) continue;

      const prevProgress = this.getAnimatorProgress(prevEntry);
      const requiredOffset = entry.item.normalizedOffset;

      // Start when previous reaches required progress
      if (prevProgress >= requiredOffset) {
        this.startAnimator(id);
      }
    }
  }

  private startAnimator(id: string): void {
    const entry = this.animators.get(id);
    if (!entry || entry.started) {
      return;
    }
    entry.started = true;

    if (this.direction === "forward") {
      entry.animator.forward();
    } else {
      entry.animator.backward();
    }
  }

  /**
   * Start the scheduler loop that checks spring progress
   */
  private startScheduler(): void {
    const tick = () => {
      this.checkAndStartSprings();

      // Continue if any animation is still running
      if (this.getIsAnimating()) {
        this.rafId = requestAnimationFrame(tick);
      }
    };
    tick();
  }

  private stopScheduler(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private getFirstAnimator(): SingleAnimator | null {
    const firstId = this.springOrder[0];
    if (!firstId) return null;
    return this.animators.get(firstId)?.animator ?? null;
  }

  forward(): void {
    this.stop();
    this.direction = "forward";
    this.completedCount = 0;
    this.completedAnimators.clear();
    this.resetStartedFlags();
    this.config.onStart?.();

    // Start scheduler - it will handle starting springs based on progress
    this.startScheduler();
  }

  backward(): void {
    this.stop();
    this.direction = "backward";
    this.completedCount = 0;
    this.completedAnimators.clear();
    this.resetStartedFlags();
    this.config.onStart?.();

    // Start scheduler - it will handle starting springs based on progress
    this.startScheduler();
  }

  private resetStartedFlags(): void {
    this.animators.forEach((entry) => {
      entry.started = false;
    });
  }

  stop(): void {
    this.stopScheduler();
    this.animators.forEach((entry) => {
      entry.animator.stop();
      entry.started = false;
    });
  }

  reverse(): void {
    this.direction = this.direction === "forward" ? "backward" : "forward";

    this.animators.forEach((entry) => {
      if (!entry.started) {
        return;
      }

      const state = entry.animator.getCurrentState();
      const isCompleted = state.position === state.to;

      if (isCompleted) {
        // Reverse completed animation: swap from/to
        const newAnimator = SingleAnimator.fromState(
          { position: this.to, velocity: 0 },
          {
            from: this.to,
            to: this.from,
            physics: entry.item.physics,
            tick: entry.item.tick,
            css: entry.item.css,
            onComplete: () => this.onAnimatorComplete(entry.id),
            onStart: entry.item.onStart,
          },
        );
        newAnimator.forward();
        entry.animator = newAnimator;
      } else {
        entry.animator.reverse();
      }
    });
  }

  getCurrentState(): AnimationState {
    // Return first animator's state
    const firstAnimator = this.getFirstAnimator();
    if (firstAnimator) {
      return firstAnimator.getCurrentState();
    }

    // Fallback if no animators
    return {
      position: 0,
      velocity: 0,
      from: 0,
      to: 1,
    };
  }

  /**
   * Get current position value from first animator
   */
  getCurrentValue(): number {
    const firstAnimator = this.getFirstAnimator();
    return firstAnimator?.getCurrentValue() ?? 0;
  }

  /**
   * Get current velocity from first animator
   */
  getVelocity(): number {
    const firstAnimator = this.getFirstAnimator();
    return firstAnimator?.getVelocity() ?? 0;
  }

  /**
   * Set position value on first animator
   * TODO: Support per-spring control
   */
  setValue(value: number): void {
    const firstAnimator = this.getFirstAnimator();
    firstAnimator?.setValue(value);
  }

  /**
   * Set velocity on first animator
   * TODO: Support per-spring control
   */
  setVelocity(velocity: number): void {
    const firstAnimator = this.getFirstAnimator();
    firstAnimator?.setVelocity(velocity);
  }

  /**
   * Check if any animation is currently running
   */
  getIsAnimating(): boolean {
    for (const entry of this.animators.values()) {
      if (entry.animator.getIsAnimating()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Sync element state to current progress value
   * Calls syncState on all child animators
   */
  syncState(): void {
    this.animators.forEach((entry) => {
      entry.animator.syncState();
    });
  }

  /**
   * Create MultiAnimator from existing state
   * Uses first animator's state for initialization
   */
  static fromState(
    state: { position: number; velocity: number },
    options: MultiAnimatorOptions,
  ): MultiAnimator {
    const animator = new MultiAnimator(options);
    animator.setValue(state.position);
    animator.setVelocity(state.velocity);
    // Sync element state to match the starting position
    animator.syncState();
    return animator;
  }
}
