import { Animator } from ".";
import { Animation } from "./animation";
import type {
  MultiSpringConfig,
  SpringItem,
  NormalizedScheduleEntry,
  AnimationState,
} from "../types";

/**
 * Entry to track individual spring animation state
 */
type AnimatorEntry = {
  id: string;
  item: SpringItem;
  animator: Animator;
  startTime: number | null;
};

export interface MultiAnimatorOptions {
  config: MultiSpringConfig;
  from: number;
  to: number;
  element?: HTMLElement;
}

/**
 * MultiAnimator - Coordinates multiple spring animations
 *
 * Extends Animation base class to provide unified interface.
 * Manages the lifecycle and timing of multiple spring animations.
 * Supports three scheduling strategies:
 * - overlap: All springs start immediately (parallel)
 * - wait: Each spring waits for previous to complete (sequential)
 * - chain: Springs start with offset delays
 */
export class MultiAnimator extends Animation {
  private config: MultiSpringConfig;
  private animators: Map<string, AnimatorEntry> = new Map();
  private springOrder: string[] = [];
  private completedCount = 0;
  private completedAnimators = new Set<string>();
  private direction: "forward" | "backward" = "forward";
  private idCounter = 0;
  private timeoutIds: number[] = [];
  private element?: HTMLElement;
  private from: number;
  private to: number;

  constructor(options: MultiAnimatorOptions) {
    super();
    this.config = options.config;
    this.from = options.from;
    this.to = options.to;
    this.element = options.element;
    this.initializeAnimators();
  }

  private generateId(): string {
    return `spring_${this.idCounter++}`;
  }

  private initializeAnimators(): void {
    this.config.springs.forEach((item) => {
      const id = this.generateId();
      const animator = new Animator({
        from: this.from,
        to: this.to,
        spring: item.spring,
        tick: item.tick,
        css:
          item.css && this.element
            ? { element: this.element, style: item.css }
            : undefined,
        onComplete: () => this.onAnimatorComplete(id),
        onStart: item.onStart,
      });

      this.animators.set(id, {
        id,
        item,
        animator,
        startTime: null,
      });
      this.springOrder.push(id);
    });
  }

  private normalizeSchedule(
    direction: "forward" | "backward",
  ): NormalizedScheduleEntry[] {
    const schedule = this.config.schedule ?? "overlap";

    return this.springOrder.map((id, index) => {
      const entry = this.animators.get(id);
      if (!entry) {
        throw new Error(`MultiAnimator: animator with id "${id}" not found`);
      }

      if (schedule === "overlap") {
        return { type: "offset" as const, id, delay: 0 };
      }

      if (schedule === "wait") {
        if (direction === "forward" && index === 0) {
          return { type: "offset" as const, id, delay: 0 };
        }
        if (direction === "backward" && index === this.springOrder.length - 1) {
          return { type: "offset" as const, id, delay: 0 };
        }
        return { type: "wait" as const, id };
      }

      // Chain mode
      const offset = entry.item.offset ?? 0;
      if (direction === "forward") {
        return { type: "offset" as const, id, delay: offset };
      }

      const maxOffset = Math.max(
        ...Array.from(this.animators.values()).map((e) => e.item.offset ?? 0),
      );
      return { type: "offset" as const, id, delay: maxOffset - offset };
    });
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

    this.handleWaitModeChaining(id);

    if (this.completedCount === this.config.springs.length) {
      this.config.onEnd?.();
    }
  }

  private handleWaitModeChaining(completedId: string): void {
    if (this.config.schedule !== "wait") {
      return;
    }

    const currentIndex = this.springOrder.indexOf(completedId);

    if (this.direction === "forward") {
      const nextId = this.springOrder[currentIndex + 1];
      if (nextId) {
        const nextEntry = this.animators.get(nextId);
        if (nextEntry && nextEntry.startTime === null) {
          this.startAnimator(nextId);
        }
      }
    } else {
      const prevId = this.springOrder[currentIndex - 1];
      if (prevId) {
        const prevEntry = this.animators.get(prevId);
        if (prevEntry && prevEntry.startTime === null) {
          this.startBackwardAnimator(prevId);
        }
      }
    }
  }

  private startAnimator(id: string): void {
    const entry = this.animators.get(id);
    if (!entry || entry.startTime !== null) {
      return;
    }
    entry.startTime = Date.now();
    entry.animator.forward();
  }

  private startBackwardAnimator(id: string): void {
    const entry = this.animators.get(id);
    if (!entry || entry.startTime !== null) {
      return;
    }
    entry.startTime = Date.now();
    entry.animator.backward();
  }

  private getFirstAnimator(): Animator | null {
    const firstId = this.springOrder[0];
    if (!firstId) return null;
    return this.animators.get(firstId)?.animator ?? null;
  }

  forward(): void {
    this.stop();
    this.direction = "forward";
    this.completedCount = 0;
    this.completedAnimators.clear();
    this.config.onStart?.();

    const entries = this.normalizeSchedule("forward");
    entries.forEach((entry) => {
      if (entry.type === "wait") {
        return;
      }
      if (entry.delay === 0) {
        this.startAnimator(entry.id);
      } else {
        const timeoutId = window.setTimeout(
          () => this.startAnimator(entry.id),
          entry.delay,
        );
        this.timeoutIds.push(timeoutId);
      }
    });
  }

  backward(): void {
    this.stop();
    this.direction = "backward";
    this.completedCount = 0;
    this.completedAnimators.clear();
    this.config.onStart?.();

    const entries = this.normalizeSchedule("backward");
    entries.forEach((entry) => {
      if (entry.type === "wait") {
        return;
      }
      if (entry.delay === 0) {
        this.startBackwardAnimator(entry.id);
      } else {
        const timeoutId = window.setTimeout(
          () => this.startBackwardAnimator(entry.id),
          entry.delay,
        );
        this.timeoutIds.push(timeoutId);
      }
    });
  }

  stop(): void {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
    this.animators.forEach((entry) => {
      entry.animator.stop();
      entry.startTime = null;
    });
  }

  reverse(): void {
    this.direction = this.direction === "forward" ? "backward" : "forward";

    this.animators.forEach((entry) => {
      if (entry.startTime === null) {
        return;
      }

      const state = entry.animator.getCurrentState();
      const isCompleted = state.position === state.to;

      if (isCompleted) {
        // Reverse completed animation: swap from/to
        const cssOption =
          entry.item.css && this.element
            ? { element: this.element, style: entry.item.css }
            : undefined;

        const newAnimator = Animator.fromState(
          { position: this.to, velocity: 0 },
          {
            from: this.to,
            to: this.from,
            spring: entry.item.spring,
            tick: entry.item.tick,
            css: cssOption,
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
    return animator;
  }
}
