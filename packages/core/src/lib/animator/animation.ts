import type { AnimationState } from "../types";

/**
 * Animation - Abstract base class for spring-based animations
 *
 * Provides common interface for both single and multi-spring animations.
 * Subclasses implement the actual animation logic.
 */
export abstract class Animation {
  /**
   * Start animation moving forward (from → to)
   * For IN transitions: 0 → 1
   */
  abstract forward(): void;

  /**
   * Start animation moving backward (to → from)
   * For OUT transitions: 1 → 0
   */
  abstract backward(): void;

  /**
   * Stop the animation at current position
   */
  abstract stop(): void;

  /**
   * Reverse the animation direction
   * If animating forward, switch to backward (and vice versa)
   */
  abstract reverse(): void;

  /**
   * Get current animation state
   */
  abstract getCurrentState(): AnimationState;

  /**
   * Get current position value
   * For multi-spring: returns first animator's position
   */
  abstract getCurrentValue(): number;

  /**
   * Get current velocity
   * For multi-spring: returns first animator's velocity
   */
  abstract getVelocity(): number;

  /**
   * Set current position value
   * For multi-spring: applies to first animator (TODO: per-spring control)
   */
  abstract setValue(value: number): void;

  /**
   * Set current velocity
   * For multi-spring: applies to first animator (TODO: per-spring control)
   */
  abstract setVelocity(velocity: number): void;

  /**
   * Check if animation is currently running
   */
  abstract getIsAnimating(): boolean;
}
