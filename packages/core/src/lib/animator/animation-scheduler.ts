import { Animator } from ".";
import type {
  MultiSpringConfig,
  SpringItem,
  NormalizedScheduleEntry,
  AnimationController,
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

/**
 * AnimationScheduler - Coordinates multiple spring animations
 *
 * Manages the lifecycle and timing of multiple spring animations.
 * Supports three scheduling strategies:
 * - overlap: All springs start immediately (parallel)
 * - wait: Each spring waits for previous to complete (sequential)
 * - chain: Springs start with offset delays
 */
export class AnimationScheduler implements AnimationController {
  private config: MultiSpringConfig;
  private animators: Map<string, AnimatorEntry> = new Map();
  private springOrder: string[] = [];
  private completedCount = 0;
  private completedAnimators = new Set<string>();
  private direction: "forward" | "backward" = "forward";
  private idCounter = 0;
  private timeoutIds: number[] = [];

  constructor(config: MultiSpringConfig) {
    this.config = config;
    this.initializeAnimators();
  }

  private generateId(): string {
    return `spring_${this.idCounter++}`;
  }

  private initializeAnimators(): void {
    this.config.springs.forEach((item) => {
      const id = this.generateId();
      const animator = new Animator({
        from: item.from,
        to: item.to,
        spring: item.spring,
        tick: item.tick,
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
        throw new Error(
          `AnimationScheduler: animator with id "${id}" not found`,
        );
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
      if (state.type !== "single") {
        return;
      }

      const isCompleted = state.position === state.to;

      if (isCompleted) {
        const newAnimator = Animator.fromState(
          { position: 1 },
          {
            from: entry.item.to ?? 1,
            to: entry.item.from ?? 0,
            spring: entry.item.spring,
            tick: entry.item.tick,
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
    return {
      type: "multi" as const,
      completed: this.completedCount,
      total: this.config.springs.length,
      direction: this.direction,
    };
  }
}
