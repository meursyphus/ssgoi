import type { Pose, Timeline } from "@types";

/**
 * Abstract base class for animations.
 *
 * Motion-matching contract:
 *   - `getPose()`  — snapshot of current values per element
 *   - `getTimeline()` — full simulation data per element
 *   - `matchInto(poses)` — receive external poses and adjust simulation so a
 *     handoff from a different (now-discarded) animation feels continuous
 *
 * Concrete implementations: `WebAnimation` (single element, WAAPI-driven),
 * `MultiAnimation` (composite of other Animations).
 */
export abstract class Animation {
  /** Run forward: lowerBound → upperBound */
  abstract play(): void;
  /** Run backward: current → lowerBound */
  abstract reverse(): void;
  /** Halt the animation in place — last frame stays applied, no settle/cleanup. */
  abstract pause(): void;
  /** Jump immediately to the final state and fire `onComplete`. */
  abstract complete(): void;
  /** Current playback rate (1 = realtime, 0 = paused, negative = backwards) */
  playbackRate = 1;

  /** Sample current pose for every element this animation drives */
  abstract getPose(): Pose[];

  /** Full simulation timeline for every element this animation drives */
  abstract getTimeline(): Timeline[];

  /**
   * Adopt poses from a prior animation. Implementations should look up each
   * pose by `id`/`element` and seed their next simulation from that value and
   * velocity. Unknown poses are ignored.
   */
  abstract matchInto(poses: Pose[]): void;

  /** Fired every frame with the most recent value. Optional. */
  onUpdate?: (poses: Pose[]) => void;
  /** Fired once when the animation settles. */
  onComplete?: () => void;
}
