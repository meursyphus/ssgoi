import { Animation as RuntimeAnimation } from "../runtime/animation";
import type { StyleObject } from "../runtime/motion-state";
import type { WebAnimation } from "./web-animation";
import type { Integrator } from "./integrator/types";

export interface AnimationDisposal {
  reason: "finished" | "interrupted" | "disposed";
  /** Cleanup may touch a persistent target only while this execution owns it. */
  owns: (element: HTMLElement) => boolean;
}

export const finishedDisposal: AnimationDisposal = {
  reason: "finished",
  owns: () => true,
};

/** A start dependency between siblings in the same composite. */
export interface AnimationStart<TTarget = HTMLElement, TStyle = StyleObject> {
  after: Animation<TTarget, TStyle>;
  /** Numeric progress means first crossing; settled waits for completion. */
  at: number | "settled";
}

export interface AnimationPatch<TTarget = HTMLElement, TStyle = StyleObject> {
  /** An integrator instance, including a custom stateless implementation. */
  integrator?: Integrator;
  /** null restores the parent's original scheduling for this child. */
  startAt?: AnimationStart<TTarget, TStyle> | null;
}

/** Web-compatible default; platform-neutral consumers use @ssgoi/core/runtime. */
export abstract class Animation<
  TTarget = HTMLElement,
  TStyle = StyleObject,
> extends RuntimeAnimation<TTarget, TStyle> {
  private _startCondition: AnimationStart<TTarget, TStyle> | undefined;

  /** Resource cleanup is separate from successfully reaching the authored goal. */
  onDispose?: (context: AnimationDisposal) => void;
  /** A composite retains child resources until all participating motion settles. */
  deferDisposal = false;

  /** Custom wrappers can expose their web tracks without host type checks. */
  getMotionTracks(): readonly WebAnimation[] {
    return [];
  }

  /** Validate authored scheduling before a host transfers ownership. */
  validate(): void {}

  /** Opaque custom drivers retain the explicit legacy finish-on-interrupt fallback. */
  get supportsInterruption(): boolean {
    return false;
  }

  /** Invalidate execution without disposing its retained resources. */
  stop(): void {
    this.pause();
  }

  /** Stop without seeking to an endpoint. Built-in drivers override this. */
  cancel(context: AnimationDisposal): void {
    if (!this.isComplete) this.complete();
    this.onDispose?.(context);
  }

  /** Scheduling metadata read by the parent immediately before playback. */
  get startCondition(): Readonly<AnimationStart<TTarget, TStyle>> | undefined {
    return this._startCondition;
  }

  /** Retune this animation before playback; omitted values stay unchanged. */
  set(patch: AnimationPatch<TTarget, TStyle>): this {
    if (patch.startAt) {
      const { after, at } = patch.startAt;
      if (after === this) {
        throw new Error("An animation cannot start after itself");
      }
      if (at !== "settled" && (!Number.isFinite(at) || at < 0 || at > 1)) {
        throw new Error("startAt.at must be a progress from 0 to 1 or settled");
      }
    }
    if (patch.integrator !== undefined) {
      if (
        typeof patch.integrator.step !== "function" ||
        typeof patch.integrator.isSettled !== "function"
      ) {
        throw new Error("An integrator must implement step and isSettled");
      }
      this.setIntegrator(patch.integrator);
    }
    if (patch.startAt !== undefined) {
      this._startCondition = patch.startAt ? { ...patch.startAt } : undefined;
    }
    return this;
  }

  /** Custom drivers can opt into physics editing by implementing this method. */
  protected setIntegrator(_integrator: Integrator): void {
    throw new Error("This animation does not support replacing its integrator");
  }
}
