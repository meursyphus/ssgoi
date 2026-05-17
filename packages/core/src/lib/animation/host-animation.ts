import type { Pose, Timeline } from "@types";
import { Animation } from "./animation";

type HostState = "idle" | "playing" | "paused" | "reversing";

/**
 * Long-lived container that owns the playback state of a `<Ssgoi>` context
 * across many transitions. Each new transition's Animation is handed in via
 * `attach()`, which:
 *
 *   1. Samples the live pose of the prior child and feeds it to the new one
 *      via `matchInto` so motion is continuous.
 *   2. Completes the prior child so its `onComplete` cleanups fire.
 *   3. Carries over the host's playbackRate and play/pause/reverse state.
 *   4. Hooks the child's `onComplete` / `onUpdate` to drive the host's own
 *      listeners (used by dev tools).
 *
 * The host is also a valid `Animation` itself — its lifecycle methods delegate
 * to the active child while preserving state when no child is attached.
 */
export class HostAnimation extends Animation {
  private child: Animation | null = null;
  private _state: HostState = "idle";
  private _settled = false;
  private listeners = new Set<() => void>();

  attach(next: Animation): void {
    const prev = this.child;
    // Swap the slot up front so prev's onComplete (which guards on
    // `this.child === prev`) won't reset host state to idle when we
    // complete it below.
    this.child = next;
    this._settled = false;

    if (prev) {
      const pose = prev.getPose();
      prev.complete();
      next.matchInto(pose);
    }

    next.playbackRate = this.playbackRate;

    const prevDone = next.onComplete;
    next.onComplete = () => {
      prevDone?.();
      if (this.child === next) {
        this.child = null;
        this._state = "idle";
        this._settled = true;
      }
      this.notify();
    };
    const prevUpd = next.onUpdate;
    next.onUpdate = (poses) => {
      prevUpd?.(poses);
      this.onUpdate?.(poses);
      this.notify();
    };

    if (this._state === "paused") {
      next.pause();
    } else if (this._state === "reversing") {
      next.reverse();
    } else {
      this._state = "playing";
      next.play();
    }
    this.notify();
  }

  play(): void {
    this._state = "playing";
    this._settled = false;
    this.child?.play();
    this.notify();
  }

  reverse(): void {
    this._state = "reversing";
    this._settled = false;
    this.child?.reverse();
    this.notify();
  }

  pause(): void {
    this._state = "paused";
    this.child?.pause();
    this.notify();
  }

  complete(): void {
    this.child?.complete();
    this.notify();
  }

  get isAnimating(): boolean {
    return this.child?.isAnimating ?? false;
  }
  get isPaused(): boolean {
    return this._state === "paused";
  }
  get isComplete(): boolean {
    return this._settled && !this.child;
  }
  get isReversing(): boolean {
    return this.child?.isReversing ?? this._state === "reversing";
  }

  get playbackRate(): number {
    return super.playbackRate;
  }
  set playbackRate(rate: number) {
    super.playbackRate = rate;
    if (this.child) this.child.playbackRate = rate;
    this.notify();
  }

  getPose(): Pose[] {
    return this.child?.getPose() ?? [];
  }
  getTimeline(): Timeline[] {
    return this.child?.getTimeline() ?? [];
  }
  matchInto(poses: Pose[]): void {
    this.child?.matchInto(poses);
  }

  /** Currently attached child, or null when nothing is playing. */
  get activeChild(): Animation | null {
    return this.child;
  }

  /** Subscribe to host state changes. Returns an unsubscribe fn. */
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify(): void {
    for (const fn of this.listeners) fn();
  }
}
