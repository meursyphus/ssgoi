import { Animator } from "./animator";
import type { MultiSpringConfig, SpringItem } from "./types";

/**
 * Entry to track individual spring animation state
 */
type AnimatorEntry<TAnimationValue> = {
  id: string;
  item: SpringItem<TAnimationValue>;
  animator: Animator<TAnimationValue>;
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
export class AnimationScheduler<TAnimationValue = number> {
  private config: MultiSpringConfig<TAnimationValue>;
  private animators: Map<string, AnimatorEntry<TAnimationValue>> = new Map();
  private springOrder: string[] = [];
  private completedCount = 0;
  private direction: "forward" | "backward" = "forward";
  private idCounter = 0;

  constructor(config: MultiSpringConfig<TAnimationValue>) {
    this.config = config;
    this.initializeAnimators();
  }

  private generateId(): string {
    return `spring_${this.idCounter++}`;
  }

  private initializeAnimators(): void {
    this.config.springs.forEach((item) => {
      const id = this.generateId();
      const animator = new Animator<TAnimationValue>({
        from: item.from,
        to: item.to,
        spring: item.spring,
        onUpdate: item.tick,
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

  private onAnimatorComplete(id: string): void {
    const entry = this.animators.get(id);
    if (!entry) {
      console.warn(
        `AnimationScheduler: animator with id "${id}" not found on completion`,
      );
      return;
    }

    this.completedCount++;
    entry.item.onComplete?.();
    this.config.onProgress?.(this.completedCount, this.config.springs.length);

    if (this.config.schedule === "wait") {
      if (this.direction === "forward") {
        // Forward: start next animation
        const currentIndex = this.springOrder.indexOf(id);
        const nextId = this.springOrder[currentIndex + 1];
        if (nextId) {
          const nextEntry = this.animators.get(nextId);
          if (nextEntry && nextEntry.startTime === null) {
            this.startAnimator(nextId);
          }
        }
      } else if (this.direction === "backward") {
        // Backward: start previous animation
        const currentIndex = this.springOrder.indexOf(id);
        const prevId = this.springOrder[currentIndex - 1];
        if (prevId) {
          const prevEntry = this.animators.get(prevId);
          if (prevEntry && prevEntry.startTime === null) {
            this.startBackwardAnimator(prevId);
          }
        }
      }
    }

    if (this.completedCount === this.config.springs.length) {
      this.config.onEnd?.();
    }
  }

  private startAnimator(id: string): void {
    const entry = this.animators.get(id);
    if (!entry) {
      console.warn(
        `AnimationScheduler: animator with id "${id}" not found on start`,
      );
      return;
    }

    entry.startTime = Date.now();
    entry.animator.forward();
  }

  private startBackwardAnimator(id: string): void {
    const entry = this.animators.get(id);
    if (!entry) {
      console.warn(
        `AnimationScheduler: animator with id "${id}" not found on backward start`,
      );
      return;
    }

    entry.startTime = Date.now();
    entry.animator.backward();
  }

  forward(): void {
    this.direction = "forward";
    this.completedCount = 0;
    this.config.onStart?.();

    const schedule = this.config.schedule ?? "overlap";

    switch (schedule) {
      case "overlap":
        this.springOrder.forEach((id) => this.startAnimator(id));
        break;

      case "wait": {
        const firstId = this.springOrder[0];
        if (firstId) {
          this.startAnimator(firstId);
        }
        break;
      }

      case "chain":
        this.springOrder.forEach((id) => {
          const entry = this.animators.get(id);
          if (!entry) return;
          const offset = entry.item.offset ?? 0;
          if (offset === 0) {
            this.startAnimator(id);
          } else {
            setTimeout(() => this.startAnimator(id), offset);
          }
        });
        break;
    }
  }

  backward(): void {
    this.direction = "backward";
    this.completedCount = 0;
    this.config.onStart?.();

    const schedule = this.config.schedule ?? "overlap";

    switch (schedule) {
      case "overlap":
        this.springOrder.forEach((id) => this.startBackwardAnimator(id));
        break;

      case "wait": {
        const lastId = this.springOrder[this.springOrder.length - 1];
        if (lastId) {
          this.startBackwardAnimator(lastId);
        }
        break;
      }

      case "chain": {
        const maxOffset = Math.max(
          ...Array.from(this.animators.values()).map((e) => e.item.offset ?? 0),
        );
        this.springOrder.forEach((id) => {
          const entry = this.animators.get(id);
          if (!entry) return;
          const offset = entry.item.offset ?? 0;
          const mirroredOffset = maxOffset - offset;

          if (mirroredOffset === 0) {
            this.startBackwardAnimator(id);
          } else {
            setTimeout(() => this.startBackwardAnimator(id), mirroredOffset);
          }
        });
        break;
      }
    }
  }

  stop(): void {
    this.animators.forEach((entry) => {
      entry.animator.stop();
    });
  }

  reverse(options?: { offsetMode?: "immediate" | "mirror" | "reverse" }): void {
    const offsetMode = options?.offsetMode ?? "immediate";

    if (offsetMode !== "immediate") {
      console.warn(
        `AnimationScheduler.reverse(): Only "immediate" offsetMode is currently supported. Falling back to "immediate".`,
      );
    }

    this.animators.forEach((entry) => {
      if (entry.startTime !== null) {
        const currentState = entry.animator.getCurrentState();
        const isCompleted = currentState.position === currentState.to;

        if (isCompleted) {
          const newAnimator = Animator.fromState(
            {
              position: 1 as TAnimationValue,
              velocity: 0 as TAnimationValue extends number
                ? number
                : Record<string, number>,
            },
            {
              from: entry.item.to ?? (1 as TAnimationValue),
              to: entry.item.from ?? (0 as TAnimationValue),
              spring: entry.item.spring,
              onUpdate: entry.item.tick,
              onComplete: () => this.onAnimatorComplete(entry.id),
              onStart: entry.item.onStart,
            },
          );
          newAnimator.forward();
          entry.animator = newAnimator;
        } else {
          entry.animator.reverse();
        }
      }
    });
  }

  getState(): {
    completed: number;
    total: number;
    direction: "forward" | "backward";
  } {
    return {
      completed: this.completedCount,
      total: this.config.springs.length,
      direction: this.direction,
    };
  }
}
