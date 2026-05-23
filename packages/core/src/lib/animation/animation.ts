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
  private _playbackRate = 1;
  get playbackRate(): number {
    return this._playbackRate;
  }
  set playbackRate(rate: number) {
    this._playbackRate = rate;
  }

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

  /** Simulation tick is actively running (false while paused or settled). */
  abstract get isAnimating(): boolean;
  /** Halted via `pause()` and not yet resumed. */
  abstract get isPaused(): boolean;
  /** Settled — `onComplete` has fired and no further frames will play. */
  abstract get isComplete(): boolean;
  /** Direction of the active or most-recent run (true = backwards). */
  abstract get isReversing(): boolean;

  /**
   * Current progress, normalized to 0..1 between lowerBound and upperBound.
   * Reads the live simulation value, so it advances frame-by-frame while
   * playing. Useful for external inspection / debugging.
   *
   * NOT used by `MultiAnimation` stagger triggering — that uses the
   * pre-computed timeline via `findTimeForProgress` to avoid per-frame work.
   */
  abstract get progress(): number;

  /**
   * Find the time (ms, relative to this animation's last play() / reverse())
   * at which progress first crosses `threshold` (0..1). Returns `null` if
   * the animation has no simulation yet (i.e. play hasn't been called).
   *
   * Implementations should read from the pre-computed simulation timeline so
   * this is an O(n) one-shot lookup — never a polling loop.
   */
  abstract findTimeForProgress(threshold: number): number | null;
}
