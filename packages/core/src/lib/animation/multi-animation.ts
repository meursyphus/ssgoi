import type { PhysicsOptions, Pose, Timeline } from "@types";
import {
  Animation,
  type AnimationPatch,
  type AnimationStart,
  type AnimationDisposal,
  finishedDisposal,
} from "./animation";
import { frameScheduler } from "./frame-scheduler";
import { IntegratorProvider, type Integrator } from "./integrator";
import type { WebAnimation } from "./web-animation";

export interface TrackPatch {
  /** New physics — an `Integrator` instance or the `{ spring | inertia }` shape. */
  integrator?: Integrator | PhysicsOptions;
}

function toIntegrator(value: Integrator | PhysicsOptions): Integrator {
  return typeof (value as Integrator).step === "function"
    ? (value as Integrator)
    : IntegratorProvider.from(value as PhysicsOptions);
}

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
 * - `sequence`: legacy numeric first-arrival chaining; use startCondition with
 *   at: "settled" for explicit completion dependencies
 *
 * Pose/Timeline reads fan out to every child for diagnostic / inspection use.
 */
export class MultiAnimation<Name extends string = string> extends Animation {
  private readonly _children: Animation[];
  private readonly progressChildren: Animation[];
  private _startAt: number[];
  private readonly namedChildren: Map<string, Animation>;
  private restoreChildCallbacks: Array<() => void> = [];
  private runId = 0;
  private pendingComplete = 0;
  private running = false;
  private disposed = false;
  private settled = false;
  private startedChildren = new Set<Animation>();
  private lastMethod: "play" | "reverse" = "play";
  private pausedRun = false;
  private pendingStartObservers: Array<() => void> = [];

  constructor(
    children: readonly Animation[] | Record<Name, Animation>,
    opts: MultiAnimationOptions = {},
  ) {
    super();
    this.namedChildren = new Map(
      Array.isArray(children) ? [] : Object.entries(children),
    );
    this._children = Array.isArray(children)
      ? [...children]
      : [...this.namedChildren.values()];
    for (const child of this._children) child.deferDisposal = true;
    // Empty named groups keep optional selectors stable, but are not motion
    // and must not dilute a parent's progress (e.g. static zoom's overlay).
    this.progressChildren = this._children.filter(
      (child) =>
        !(child instanceof MultiAnimation) || child.progressChildren.length > 0,
    );
    // Both `sequence` and `parallel` collapse onto a single scheduling
    // mechanism: each child waits for its predecessor to hit a progress
    // threshold. `sequence` is just `startAt = [0, 1, 1, …]` (next child
    // starts when the previous first reaches progress 1); `parallel` defaults to
    // `[0, 0, …]` (everyone starts together). Public API keeps both modes
    // for clarity, but only one code path runs.
    if ((opts.mode ?? "parallel") === "sequence") {
      this._startAt = this._children.map((_, i) => (i === 0 ? 0 : 1));
    } else {
      this._startAt = opts.startAt ?? [];
    }
  }

  /** Child animations in play order. */
  get children(): readonly Animation[] {
    return this._children;
  }

  /**
   * Per-child start thresholds (see `MultiAnimationOptions.startAt`). Read
   * at run time, so replacing it before `play()` changes the overlap.
   */
  get startAt(): number[] {
    return this._startAt;
  }
  set startAt(value: number[]) {
    this._startAt = value;
  }

  /** Every `WebAnimation` in this composite, nested composites included. */
  tracks(): WebAnimation[] {
    return this._children.flatMap((child) => [...child.getMotionTracks()]);
  }

  getMotionTracks(): readonly WebAnimation[] {
    return this.tracks();
  }

  validate(): void {
    this.buildDependencies();
    for (const child of this._children) child.validate();
  }

  /** Select a registered child, which may itself be a composite. */
  select(name: Name): Animation {
    const child = this.namedChildren.get(name);
    if (!child) throw new Error(`Unknown animation child: ${name}`);
    return child;
  }

  set(patch: AnimationPatch): this;
  /** @deprecated Prefer select(name).set({ integrator }). */
  set(name: Name, patch: TrackPatch): this;
  set(patchOrName: AnimationPatch | Name, patch?: TrackPatch): this {
    if (typeof patchOrName === "string") {
      const target = this.select(patchOrName);
      if (patch?.integrator !== undefined) {
        target.set({ integrator: toIntegrator(patch.integrator) });
      }
      return this;
    }
    return super.set(patchOrName);
  }

  /** Setting the composite explicitly retunes every child in the group. */
  protected setIntegrator(integrator: Integrator): void {
    for (const child of this._children) child.set({ integrator });
  }

  play(): void {
    this.startRun("play");
  }

  reverse(): void {
    this.startRun("reverse");
  }

  pause(): void {
    this.pausedRun = this.running || this.pausedRun;
    this.running = false;
    this.clearPendingStartObservers();
    for (const child of this._children) child.pause();
  }

  complete(): void {
    if (this.settled) return;
    this.settled = true;
    this.running = false;
    this.clearPendingStartObservers();
    this.restoreCompletionHandlers();
    for (const child of this._children) child.complete();
    if (!this.deferDisposal) {
      for (const child of this._children) child.cancel(finishedDisposal);
      this.disposeResources(finishedDisposal);
    }
    this.onComplete?.();
  }

  get supportsInterruption(): boolean {
    return this._children.every((child) => child.supportsInterruption);
  }

  stop(): void {
    this.runId++;
    this.running = false;
    this.clearPendingStartObservers();
    this.restoreCompletionHandlers();
    for (const child of this._children) child.stop();
  }

  cancel(context: AnimationDisposal): void {
    this.stop();
    for (const child of this._children) child.cancel(context);
    this.disposeResources(context);
  }

  private disposeResources(context: AnimationDisposal): void {
    if (this.disposed) return;
    this.disposed = true;
    try {
      this.onDispose?.(context);
    } catch (error) {
      console.error("[ssgoi] composite cleanup failed", error);
    }
  }

  get progress(): number {
    if (this.progressChildren.length === 0) return 0;
    let sum = 0;
    for (const child of this.progressChildren) sum += child.progress;
    return sum / this.progressChildren.length;
  }

  getPose(): Pose[] {
    return this._children.flatMap((c) => c.getPose());
  }

  getTimeline(): Timeline[] {
    return this._children.flatMap((c) => c.getTimeline());
  }

  matchInto(poses: Pose[]): void {
    // Explicit legacy scalar handoff only; Host uses typed presentation channels.
    // Matching changes initial state, never dependency timing or child activation.
    for (const child of this._children) child.matchInto(poses);
  }

  get isAnimating(): boolean {
    return this._children.some((c) => c.isAnimating);
  }
  get isPaused(): boolean {
    return (
      this._children.some((c) => c.isPaused) &&
      this._children.every((c) => c.isPaused || c.isComplete)
    );
  }
  get isComplete(): boolean {
    return this.settled;
  }
  get isReversing(): boolean {
    return this._children.some((c) => c.isReversing);
  }

  get playbackRate(): number {
    return super.playbackRate;
  }
  set playbackRate(rate: number) {
    super.playbackRate = rate;
    for (const child of this._children) child.playbackRate = rate;
  }

  /* ───────────────────────────────────────────────────────── private */

  private startRun(method: "play" | "reverse") {
    const authored = this.buildDependencies();
    const resuming = this.pausedRun && method === this.lastMethod;
    const changingDirection = method !== this.lastMethod;
    const activated = new Set(this.startedChildren);
    const wasComplete = new Set(
      this._children.filter((child) => child.isComplete),
    );
    // Reversing a partially executed sequence cannot invent its pending stages.
    const participating =
      method === "reverse" && activated.size
        ? this._children.filter((child) => activated.has(child))
        : [...this._children];
    const order =
      method === "reverse" ? [...participating].reverse() : participating;
    const dependencies = new Map<Animation, AnimationStart[]>();
    if (method === "reverse") {
      for (const [child, dependency] of authored) {
        if (
          !participating.includes(child) ||
          !participating.includes(dependency.after)
        )
          continue;
        const list = dependencies.get(dependency.after) ?? [];
        list.push({
          after: child,
          at: dependency.at === "settled" ? "settled" : 1 - dependency.at,
        });
        dependencies.set(dependency.after, list);
      }
    } else
      for (const [child, dependency] of authored)
        dependencies.set(child, [dependency]);
    // Active motions reverse immediately; completed predecessors unwind when
    // their reversed dependencies are ready. No wall-clock guesses are used.
    if (changingDirection || resuming)
      for (const child of activated) {
        if (!wasComplete.has(child)) dependencies.delete(child);
      }
    if (this.running) this.pause();
    this.restoreCompletionHandlers();
    const runId = ++this.runId;
    this.running = true;
    this.pausedRun = false;
    this.lastMethod = method;
    this.disposed = false;
    this.settled = false;
    this.pendingComplete = participating.length;
    if (!resuming && !changingDirection) this.startedChildren.clear();
    if (this.pendingComplete === 0) {
      this.handleFinished();
      return;
    }

    const completed = new Set<Animation>();
    const started = new Set<Animation>();
    if (resuming)
      for (const child of participating) {
        if (activated.has(child) && wasComplete.has(child)) {
          started.add(child);
          completed.add(child);
          this.pendingComplete--;
        }
      }
    for (const child of participating) {
      const previous = child.onComplete;
      const callback = () => {
        if (this.runId !== runId || !this.running || completed.has(child))
          return;
        try {
          previous?.();
        } catch (error) {
          console.error("[ssgoi] animation completion failed", error);
        }
        completed.add(child);
        if (--this.pendingComplete === 0) this.handleFinished();
      };
      child.onComplete = callback;
      this.restoreChildCallbacks.push(() => {
        if (child.onComplete === callback) child.onComplete = previous;
      });
    }
    const pump = () => {
      let changed = true;
      while (this.running && this.runId === runId && changed) {
        changed = false;
        for (const child of order) {
          if (!this.running || started.has(child)) continue;
          const requirements = dependencies.get(child) ?? [];
          if (
            requirements.some(
              (dependency) =>
                !started.has(dependency.after) ||
                !this.hasReachedThreshold(
                  dependency.after,
                  dependency.at,
                  method,
                ),
            )
          )
            continue;
          started.add(child);
          this.startedChildren.add(child);
          child[method]();
          changed = true;
        }
      }
      if (started.size === participating.length)
        this.clearPendingStartObservers();
    };
    pump();
    if (this.pendingComplete === 0) this.handleFinished();
    if (this.running && started.size !== participating.length)
      this.pendingStartObservers.push(frameScheduler.subscribe(pump));
  }

  private buildDependencies(): Map<Animation, AnimationStart> {
    const dependencies = new Map<Animation, AnimationStart>();
    const siblings = new Set(this._children);
    if (siblings.size !== this._children.length) {
      throw new Error(
        "Each child animation must occur once in a MultiAnimation",
      );
    }
    this._children.forEach((child, index) => {
      const explicit = child.startCondition;
      if (explicit) {
        if (!siblings.has(explicit.after)) {
          throw new Error(
            "startAt.after must reference a sibling in the same MultiAnimation",
          );
        }
        dependencies.set(child, { ...explicit });
      } else if (index > 0 && this._startAt.some((value) => value > 0)) {
        // Legacy constructor thresholds retain their first-crossing behavior.
        // Even zero waits for the predecessor to start, preserving chained
        // schedules such as [0, 0.4, 0] without changing preset defaults.
        dependencies.set(child, {
          after: this._children[index - 1]!,
          at: this._startAt[index] ?? 0,
        });
      }
    });
    const visited = new Set<Animation>();
    const visiting = new Set<Animation>();
    const visit = (child: Animation) => {
      if (visiting.has(child))
        throw new Error("Animation startAt dependencies form a cycle");
      if (visited.has(child)) return;
      visiting.add(child);
      const dependency = dependencies.get(child);
      if (dependency) visit(dependency.after);
      visiting.delete(child);
      visited.add(child);
    };
    this._children.forEach(visit);
    return dependencies;
  }

  private hasReachedThreshold(
    child: Animation,
    threshold: number | "settled",
    method: "play" | "reverse",
  ): boolean {
    if (child.isComplete) return true;
    if (threshold === "settled") return false;
    if (threshold <= 0) return true;
    const runProgress = method === "play" ? child.progress : 1 - child.progress;
    return runProgress >= threshold;
  }

  private clearPendingStartObservers() {
    for (const stop of this.pendingStartObservers) stop();
    this.pendingStartObservers = [];
  }

  private restoreCompletionHandlers() {
    for (const restore of this.restoreChildCallbacks) restore();
    this.restoreChildCallbacks = [];
  }

  private handleFinished() {
    if (!this.running) return;
    this.running = false;
    this.settled = true;
    this.clearPendingStartObservers();
    this.restoreCompletionHandlers();
    if (!this.deferDisposal) {
      for (const child of this._children) child.cancel(finishedDisposal);
      this.disposeResources(finishedDisposal);
    }
    this.onComplete?.();
  }

  findTimeForProgress(_threshold: number): number | null {
    // A composite's progress averages children that may start at different
    // times. There is no single precomputed timestamp; parents observe live
    // progress on the shared frame clock instead.
    return null;
  }
}
