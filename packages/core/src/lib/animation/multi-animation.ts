import type { Pose, Timeline } from "@types";
import { Animation } from "./animation";

export type MultiAnimationMode = "parallel" | "sequence";

export interface MultiAnimationOptions {
  mode?: MultiAnimationMode;
  /**
   * Per-child start progress (0..1), keyed off the *previous* child. Only
   * meaningful for `parallel` mode. `startAt[i]` = the progress the (i-1)th
   * child must reach before the i-th child plays. `startAt[0]` is ignored
   * (the first child always starts immediately).
   *
   * Omit (or use all zeros) for true simultaneous start — the existing
   * parallel behavior. Use a fractional value (e.g. `[0, 0.4]`) for
   * fade-through / shared-axis style overlap that's robust to spring tuning
   * changes (the trigger moves with the spring, not with wall-clock time).
   */
  startAt?: number[];
}

/**
 * Composite that drives several child Animations.
 *
 * - `parallel`: all children play together (optionally staggered via `startAt`)
 * - `sequence`: each child waits for the previous to settle, then plays
 *
 * Pose/Timeline reads fan out to every child for diagnostic / inspection use.
 */
export class MultiAnimation extends Animation {
  private children: Animation[];
  private startAt: number[];
  private pendingComplete = 0;
  private running = false;
  private pendingStartTimers: ReturnType<typeof setTimeout>[] = [];

  constructor(children: Animation[], opts: MultiAnimationOptions = {}) {
    super();
    this.children = children;
    // Both `sequence` and `parallel` collapse onto a single scheduling
    // mechanism: each child waits for its predecessor to hit a progress
    // threshold. `sequence` is just `startAt = [0, 1, 1, …]` (next child
    // starts when the previous fully settles); `parallel` defaults to
    // `[0, 0, …]` (everyone starts together). Public API keeps both modes
    // for clarity, but only one code path runs.
    if ((opts.mode ?? "parallel") === "sequence") {
      this.startAt = children.map((_, i) => (i === 0 ? 0 : 1));
    } else {
      this.startAt = opts.startAt ?? [];
    }
  }

  play(): void {
    this.startRun("play");
  }

  reverse(): void {
    this.startRun("reverse");
  }

  pause(): void {
    this.running = false;
    this.clearPendingStartTimers();
    for (const child of this.children) child.pause();
  }

  complete(): void {
    this.running = false;
    this.clearPendingStartTimers();
    for (const child of this.children) child.complete();
    this.onComplete?.();
  }

  get progress(): number {
    if (this.children.length === 0) return 0;
    let sum = 0;
    for (const child of this.children) sum += child.progress;
    return sum / this.children.length;
  }

  getPose(): Pose[] {
    return this.children.flatMap((c) => c.getPose());
  }

  getTimeline(): Timeline[] {
    return this.children.flatMap((c) => c.getTimeline());
  }

  matchInto(_poses: Pose[]): void {
    // TODO: handing a flat pose list to a composite isn't well-defined yet —
    // sequence/stagger progress, mode mismatches, and active-child awareness
    // all need a richer protocol than per-child broadcast. Left as a no-op
    // for now so we don't pretend to support cross-multi handoff.
  }

  get isAnimating(): boolean {
    return this.children.some((c) => c.isAnimating);
  }
  get isPaused(): boolean {
    return (
      this.children.some((c) => c.isPaused) &&
      this.children.every((c) => c.isPaused || c.isComplete)
    );
  }
  get isComplete(): boolean {
    return this.children.every((c) => c.isComplete);
  }
  get isReversing(): boolean {
    return this.children.some((c) => c.isReversing);
  }

  get playbackRate(): number {
    return super.playbackRate;
  }
  set playbackRate(rate: number) {
    super.playbackRate = rate;
    for (const child of this.children) child.playbackRate = rate;
  }

  /* ───────────────────────────────────────────────────────── private */

  private startRun(method: "play" | "reverse") {
    if (this.running) this.pause();
    this.running = true;
    this.pendingComplete = this.children.length;
    if (this.pendingComplete === 0) {
      this.handleFinished();
      return;
    }
    for (const child of this.children) {
      const prevOnComplete = child.onComplete;
      child.onComplete = () => {
        prevOnComplete?.();
        this.handleChildComplete();
      };
    }
    this.scheduleStart(0, method);
  }

  // Chained start: play child `index`, then schedule the next one based on
  // *this* child's freshly computed timeline. Doing this lazily (rather than
  // up-front for the whole chain) is what makes it correct for >2 children —
  // child[i+1]'s trigger ms is only knowable after child[i].play() has run
  // `simulate()`. Single setTimeout per gap, no polling.
  private scheduleStart(index: number, method: "play" | "reverse") {
    if (!this.running) return;
    if (index >= this.children.length) return;
    this.children[index]![method]();
    const next = index + 1;
    if (next >= this.children.length) return;

    const threshold = this.startAt[next];
    if (threshold === undefined || threshold <= 0) {
      this.scheduleStart(next, method);
      return;
    }
    const triggerMs = this.children[index]!.findTimeForProgress(threshold);
    if (triggerMs === null || triggerMs <= 0) {
      this.scheduleStart(next, method);
      return;
    }
    // `triggerMs` is simulation time (frames are timestamped at 1× playback).
    // WAAPI scales wall-clock by `playbackRate`, so the setTimeout has to
    // scale too — otherwise rate < 1 fires the next child early (overlap)
    // and rate > 1 fires it late (gap).
    const rate = Math.abs(this.playbackRate) || 1;
    const wallMs = triggerMs / rate;
    const timer = setTimeout(() => {
      this.pendingStartTimers = this.pendingStartTimers.filter(
        (t) => t !== timer,
      );
      if (!this.running) return;
      this.scheduleStart(next, method);
    }, wallMs);
    this.pendingStartTimers.push(timer);
  }

  private clearPendingStartTimers() {
    for (const timer of this.pendingStartTimers) clearTimeout(timer);
    this.pendingStartTimers = [];
  }

  private handleChildComplete() {
    this.pendingComplete--;
    if (this.pendingComplete <= 0) this.handleFinished();
  }

  private handleFinished() {
    this.running = false;
    this.clearPendingStartTimers();
    this.onComplete?.();
  }

  findTimeForProgress(_threshold: number): number | null {
    // A composite's "progress" is an average across children that may start
    // at different times — there is no single timeline to consult. Return
    // null so callers (e.g. an outer MultiAnimation) fall through to an
    // immediate start rather than guessing a wrong ms value.
    return null;
  }
}
