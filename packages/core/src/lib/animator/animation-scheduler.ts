import { Animator } from ".";
import type {
  MultiSpringConfig,
  SpringItem,
  NormalizedSpringEntry,
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
  started: boolean;
};

/**
 * AnimationScheduler - Coordinates multiple spring animations
 *
 * Manages the lifecycle and timing of multiple spring animations using
 * progress-based scheduling. Each spring starts when the previous spring's
 * normalized progress reaches the specified startProgress threshold.
 *
 * Schedule types are syntactic sugar:
 * - overlap: All springs start at startProgress: 0
 * - wait: Each spring starts at startProgress: 1 (after previous completes)
 */
export class AnimationScheduler implements AnimationController {
  private config: MultiSpringConfig;
  private animators: Map<string, AnimatorEntry> = new Map();
  private normalizedEntries: Map<string, NormalizedSpringEntry> = new Map();
  private springOrder: string[] = [];
  private completedCount = 0;
  private completedAnimators = new Set<string>();
  private direction: "forward" | "backward" = "forward";
  private idCounter = 0;

  constructor(config: MultiSpringConfig) {
    this.config = config;
    this.initializeAnimators();
  }

  private generateId(): string {
    return `spring_${this.idCounter++}`;
  }

  private initializeAnimators(): void {
    const schedule = this.config.schedule ?? "overlap";

    this.config.springs.forEach((item, index) => {
      const id = this.generateId();

      // Normalize triggerAt from schedule type
      let triggerAt: number;
      if (schedule === "parallel") {
        triggerAt = 0;
      } else if (schedule === "wait") {
        // First spring triggers immediately, others wait for previous to complete
        triggerAt = index === 0 ? 0 : 1;
      } else {
        // overlap: use item.triggerAt or default to 0
        triggerAt = item.triggerAt ?? 0;
      }

      // Wrap tick to track progress and trigger next spring
      const originalTick = item.tick;
      const wrappedTick = originalTick
        ? (position: number) => {
            originalTick(position);
            this.checkAndStartNextSpring(id, position);
          }
        : undefined;

      // For CSS animations, we need a different approach - check on complete
      const animator = new Animator({
        from: item.from,
        to: item.to,
        spring: item.spring,
        tick: wrappedTick,
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
      this.normalizedEntries.set(id, { id, triggerAt });
      this.springOrder.push(id);
    });
  }

  /**
   * Check if next spring should start based on current spring's progress
   */
  private checkAndStartNextSpring(
    currentId: string,
    currentPosition: number,
  ): void {
    const currentEntry = this.animators.get(currentId);
    if (!currentEntry) return;

    // Calculate normalized progress (0~1)
    const from = currentEntry.item.from ?? 0;
    const to = currentEntry.item.to ?? 1;
    const range = to - from;
    const normalizedProgress =
      range !== 0 ? (currentPosition - from) / range : 1;

    // Find next spring in current direction
    const currentIndex = this.springOrder.indexOf(currentId);
    const nextId =
      this.direction === "forward"
        ? this.springOrder[currentIndex + 1]
        : this.springOrder[currentIndex - 1];

    if (!nextId) return;

    const nextEntry = this.animators.get(nextId);
    if (!nextEntry || nextEntry.started) return;

    const nextNormalized = this.normalizedEntries.get(nextId);
    if (!nextNormalized) return;

    // Trigger next spring when progress threshold is reached
    if (normalizedProgress >= nextNormalized.triggerAt) {
      if (this.direction === "forward") {
        this.startAnimator(nextId);
      } else {
        this.startBackwardAnimator(nextId);
      }
    }
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

    // For CSS animations or startProgress: 1, trigger next on complete
    this.triggerNextOnComplete(id);

    if (this.completedCount === this.config.springs.length) {
      this.config.onEnd?.();
    }
  }

  /**
   * Trigger next spring when triggerAt is 1 (wait mode)
   * This handles both CSS animations and tick-based animations
   */
  private triggerNextOnComplete(completedId: string): void {
    const currentIndex = this.springOrder.indexOf(completedId);

    const nextId =
      this.direction === "forward"
        ? this.springOrder[currentIndex + 1]
        : this.springOrder[currentIndex - 1];

    if (!nextId) return;

    const nextEntry = this.animators.get(nextId);
    if (!nextEntry || nextEntry.started) return;

    const nextNormalized = this.normalizedEntries.get(nextId);
    if (!nextNormalized || nextNormalized.triggerAt < 1) return;

    // triggerAt is 1, so trigger on complete
    if (this.direction === "forward") {
      this.startAnimator(nextId);
    } else {
      this.startBackwardAnimator(nextId);
    }
  }

  private startAnimator(id: string): void {
    const entry = this.animators.get(id);
    if (!entry || entry.started) {
      return;
    }
    entry.started = true;
    entry.animator.forward();
  }

  private startBackwardAnimator(id: string): void {
    const entry = this.animators.get(id);
    if (!entry || entry.started) {
      return;
    }
    entry.started = true;
    entry.animator.backward();
  }

  forward(): void {
    this.stop();
    this.direction = "forward";
    this.completedCount = 0;
    this.completedAnimators.clear();
    this.animators.forEach((entry) => (entry.started = false));
    this.config.onStart?.();

    // Start first spring immediately
    const firstId = this.springOrder[0];
    if (firstId) {
      this.startAnimator(firstId);
    }
  }

  backward(): void {
    this.stop();
    this.direction = "backward";
    this.completedCount = 0;
    this.completedAnimators.clear();
    this.animators.forEach((entry) => (entry.started = false));
    this.config.onStart?.();

    // Start last spring immediately (for backward)
    const lastId = this.springOrder[this.springOrder.length - 1];
    if (lastId) {
      this.startBackwardAnimator(lastId);
    }
  }

  stop(): void {
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
      if (state.type !== "single") {
        return;
      }

      const isCompleted = state.position === state.to;

      if (isCompleted) {
        const newAnimator = Animator.fromState(
          { position: 1, velocity: 0 },
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
    // TODO: Currently uses only the first animator's position/velocity.
    // Need to consider how to handle multi-spring with different progress per spring:
    // - Use average values?
    // - Use the most/least progressed spring?
    // - Use first spring only? (current approach, works for normalized single-spring)
    const firstId = this.springOrder[0];
    const firstEntry = firstId ? this.animators.get(firstId) : undefined;
    const firstState = firstEntry?.animator.getCurrentState();

    return {
      type: "multi" as const,
      completed: this.completedCount,
      total: this.config.springs.length,
      direction: this.direction,
      position: firstState?.type === "single" ? firstState.position : 0,
      velocity: firstState?.type === "single" ? firstState.velocity : 0,
    };
  }

  /**
   * Create AnimationScheduler from existing state
   * Used for resuming animations from interrupted state (e.g., reversing mid-animation)
   *
   * For single-spring configs (normalized from SingleSpringConfig), this allows
   * smooth reversal by preserving position and velocity.
   */
  static fromState(
    state: { position: number; velocity: number },
    config: MultiSpringConfig,
  ): AnimationScheduler {
    const scheduler = new AnimationScheduler(config);

    // Apply state to all animators (for single-spring normalized configs, there's only one)
    scheduler.animators.forEach((entry) => {
      entry.animator.setValue(state.position);
      entry.animator.setVelocity(state.velocity);
    });

    return scheduler;
  }
}
