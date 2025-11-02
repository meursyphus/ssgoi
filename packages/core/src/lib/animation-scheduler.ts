import { Animator } from "./animator";
import type {
  MultiSpringConfig,
  SpringItem,
  NormalizedScheduleEntry,
  AnimationController,
  AnimationState,
} from "./types";

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
 *
 * Note: getCurrentState() always returns MultiAnimationState (number-based progress)
 */
export class AnimationScheduler<TAnimationValue = number>
  implements AnimationController<number>
{
  private config: MultiSpringConfig<TAnimationValue>;
  private animators: Map<string, AnimatorEntry<TAnimationValue>> = new Map();
  private springOrder: string[] = [];
  private completedCount = 0;
  private completedAnimators = new Set<string>();
  private direction: "forward" | "backward" = "forward";
  private idCounter = 0;
  private timeoutIds: number[] = [];

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

  /**
   * Normalize schedule configuration to unified internal representation
   * Uses discriminated union and early return pattern
   *
   * @param direction - "forward" or "backward" direction
   */
  private normalizeSchedule(
    direction: "forward" | "backward",
  ): NormalizedScheduleEntry[] {
    const schedule = this.config.schedule ?? "overlap";

    return this.springOrder.map((id, index) => {
      const entry = this.animators.get(id);
      if (!entry) {
        throw new Error(
          `AnimationScheduler: animator with id "${id}" not found during normalization`,
        );
      }

      // Overlap: all springs start immediately
      if (schedule === "overlap") {
        return {
          type: "offset" as const,
          id,
          delay: 0,
        };
      }

      // Wait mode
      if (schedule === "wait") {
        // First in forward: start immediately
        if (direction === "forward" && index === 0) {
          return {
            type: "offset" as const,
            id,
            delay: 0,
          };
        }

        // Last in backward: start immediately
        if (direction === "backward" && index === this.springOrder.length - 1) {
          return {
            type: "offset" as const,
            id,
            delay: 0,
          };
        }

        // Others: wait for previous/next to complete
        return {
          type: "wait" as const,
          id,
        };
      }

      // Chain mode: offset-based delays
      const offset = entry.item.offset ?? 0;

      // Forward: use offset as-is
      if (direction === "forward") {
        return {
          type: "offset" as const,
          id,
          delay: offset,
        };
      }

      // Backward: mirror offset (maxOffset - offset)
      const maxOffset =
        this.animators.size === 0
          ? 0
          : Math.max(
              ...Array.from(this.animators.values()).map(
                (e) => e.item.offset ?? 0,
              ),
            );

      return {
        type: "offset" as const,
        id,
        delay: maxOffset - offset,
      };
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

    // Prevent duplicate completion
    if (this.completedAnimators.has(id)) {
      return;
    }
    this.completedAnimators.add(id);

    this.completedCount++;
    entry.item.onComplete?.();
    this.config.onProgress?.(this.completedCount, this.config.springs.length);

    // Handle wait mode chaining (start next/previous spring)
    this.handleWaitModeChaining(id);

    // Check if all springs completed
    if (this.completedCount === this.config.springs.length) {
      this.config.onEnd?.();
    }
  }

  /**
   * Handle wait mode chaining: start next/previous spring after completion
   */
  private handleWaitModeChaining(completedId: string): void {
    // Skip if not wait mode
    if (this.config.schedule !== "wait") {
      return;
    }

    const currentIndex = this.springOrder.indexOf(completedId);

    // Forward: start next animation
    if (this.direction === "forward") {
      const nextId = this.springOrder[currentIndex + 1];
      if (!nextId) {
        return;
      }

      const nextEntry = this.animators.get(nextId);
      if (nextEntry && nextEntry.startTime === null) {
        this.startAnimator(nextId);
      }
      return;
    }

    // Backward: start previous animation
    const prevId = this.springOrder[currentIndex - 1];
    if (!prevId) {
      return;
    }

    const prevEntry = this.animators.get(prevId);
    if (prevEntry && prevEntry.startTime === null) {
      this.startBackwardAnimator(prevId);
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

    // Prevent starting already running animation
    if (entry.startTime !== null) {
      console.warn(
        `AnimationScheduler: animator with id "${id}" already started`,
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

    // Prevent starting already running animation
    if (entry.startTime !== null) {
      console.warn(
        `AnimationScheduler: animator with id "${id}" already started`,
      );
      return;
    }

    entry.startTime = Date.now();
    entry.animator.backward();
  }

  forward(): void {
    // Stop any running animations and clear pending timeouts
    this.stop();

    this.direction = "forward";
    this.completedCount = 0;
    this.completedAnimators.clear();
    this.config.onStart?.();

    // Normalize schedule to unified representation
    const entries = this.normalizeSchedule("forward");

    entries.forEach((entry) => {
      // Wait mode: will be started by onAnimatorComplete
      if (entry.type === "wait") {
        return;
      }

      // Offset mode: immediate start
      if (entry.delay === 0) {
        this.startAnimator(entry.id);
        return;
      }

      // Offset mode: delayed start
      const timeoutId = window.setTimeout(
        () => this.startAnimator(entry.id),
        entry.delay,
      );
      this.timeoutIds.push(timeoutId);
    });
  }

  backward(): void {
    // Stop any running animations and clear pending timeouts
    this.stop();

    this.direction = "backward";
    this.completedCount = 0;
    this.completedAnimators.clear();
    this.config.onStart?.();

    // Normalize schedule to unified representation
    const entries = this.normalizeSchedule("backward");

    entries.forEach((entry) => {
      // Wait mode: will be started by onAnimatorComplete (in reverse order)
      if (entry.type === "wait") {
        return;
      }

      // Offset mode: immediate start
      if (entry.delay === 0) {
        this.startBackwardAnimator(entry.id);
        return;
      }

      // Offset mode: delayed start (mirrored for chain)
      const timeoutId = window.setTimeout(
        () => this.startBackwardAnimator(entry.id),
        entry.delay,
      );
      this.timeoutIds.push(timeoutId);
    });
  }

  stop(): void {
    // Clear all pending timeouts
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];

    // Stop all animators and reset startTime
    this.animators.forEach((entry) => {
      entry.animator.stop();
      entry.startTime = null;
    });
  }

  reverse(options?: { offsetMode?: "immediate" | "mirror" | "reverse" }): void {
    const offsetMode = options?.offsetMode ?? "immediate";

    if (offsetMode !== "immediate") {
      console.warn(
        `AnimationScheduler.reverse(): Only "immediate" offsetMode is currently supported. Falling back to "immediate".`,
      );
    }

    // Toggle direction
    this.direction = this.direction === "forward" ? "backward" : "forward";

    this.animators.forEach((entry) => {
      if (entry.startTime === null) {
        return;
      }

      const state = entry.animator.getCurrentState();

      // Animator always returns SingleAnimationState
      if (state.type !== "single") {
        return;
      }

      const isCompleted = state.position === state.to;

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
        return;
      }

      entry.animator.reverse();
    });
  }

  getCurrentState(): AnimationState<number> {
    return {
      type: "multi" as const,
      completed: this.completedCount,
      total: this.config.springs.length,
      direction: this.direction,
    };
  }
}
