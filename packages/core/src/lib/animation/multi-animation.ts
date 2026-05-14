import type { Pose, Timeline } from "@types";
import { Animation } from "./animation";

export type MultiAnimationMode = "parallel" | "sequence";

export interface MultiAnimationOptions {
  mode?: MultiAnimationMode;
}

/**
 * Composite that drives several child Animations.
 *
 * - `parallel`: all children play together
 * - `sequence`: each child waits for the previous to settle, then plays
 *
 * Pose/Timeline reads fan out to every child for diagnostic / inspection use.
 */
export class MultiAnimation extends Animation {
  private children: Animation[];
  private mode: MultiAnimationMode;
  private pendingComplete = 0;
  private running = false;

  constructor(children: Animation[], opts: MultiAnimationOptions = {}) {
    super();
    this.children = children;
    this.mode = opts.mode ?? "parallel";
  }

  play(): void {
    if (this.running) this.pause();
    this.running = true;
    if (this.mode === "parallel") {
      this.startParallel("play");
    } else {
      this.startSequence("play", 0);
    }
  }

  reverse(): void {
    if (this.running) this.pause();
    this.running = true;
    if (this.mode === "parallel") {
      this.startParallel("reverse");
    } else {
      this.startSequence("reverse", 0);
    }
  }

  pause(): void {
    this.running = false;
    for (const child of this.children) child.pause();
  }

  complete(): void {
    this.running = false;
    for (const child of this.children) child.complete();
    this.onComplete?.();
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

  private startParallel(method: "play" | "reverse") {
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
      child[method]();
    }
  }

  private startSequence(method: "play" | "reverse", index: number) {
    if (!this.running) return;
    if (index >= this.children.length) {
      this.handleFinished();
      return;
    }
    const child = this.children[index]!;
    const prevOnComplete = child.onComplete;
    child.onComplete = () => {
      prevOnComplete?.();
      this.startSequence(method, index + 1);
    };
    child[method]();
  }

  private handleChildComplete() {
    this.pendingComplete--;
    if (this.pendingComplete <= 0) this.handleFinished();
  }

  private handleFinished() {
    this.running = false;
    this.onComplete?.();
  }
}
