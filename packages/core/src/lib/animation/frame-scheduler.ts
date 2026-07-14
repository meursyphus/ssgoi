const NOMINAL_FRAME_TIME = 1000 / 60;

/**
 * Do not let one delayed rendering opportunity consume an unbounded amount of
 * animation time while startup is still being stabilized. A 30 Hz display is
 * still a normal cadence, so only gaps larger than two nominal 60 Hz frames
 * are treated as catch-up.
 */
export const MAX_FRAME_DELTA = 1000 / 30;
export const STABLE_FRAME_THRESHOLD = MAX_FRAME_DELTA + 1;

export type FrameTick = {
  /** Frame time used by frame-paced animation drivers. */
  delta: number;
  /** Actual gap between rendering opportunities. */
  rawDelta: number;
};

type FramePhase = "drive" | "observe";
type FrameCallback = (tick: FrameTick) => void;

/**
 * One requestAnimationFrame loop shared by animation drivers and composition
 * observers. Drivers always run first so observers see the pose that will be
 * painted for the current rendering opportunity.
 */
class FrameScheduler {
  private drivers = new Set<FrameCallback>();
  private observers = new Set<FrameCallback>();
  private frameRequest: number | null = null;
  private previousTimestamp: number | null = null;

  subscribe(callback: FrameCallback, phase: FramePhase = "drive"): () => void {
    const callbacks = phase === "drive" ? this.drivers : this.observers;
    callbacks.add(callback);
    this.requestFrame();

    return () => {
      callbacks.delete(callback);
      this.stopIfIdle();
    };
  }

  private requestFrame(): void {
    if (this.frameRequest !== null || !this.hasCallbacks()) return;
    this.frameRequest = requestAnimationFrame(this.tick);
  }

  private tick = (timestamp: number): void => {
    this.frameRequest = null;

    const rawDelta =
      this.previousTimestamp === null
        ? NOMINAL_FRAME_TIME
        : Math.max(0, timestamp - this.previousTimestamp);
    this.previousTimestamp = timestamp;
    const frame = {
      delta: Math.min(rawDelta, MAX_FRAME_DELTA),
      rawDelta,
    };

    this.runPhase(this.drivers, frame);
    this.runPhase(this.observers, frame);

    if (this.hasCallbacks()) this.requestFrame();
    else this.previousTimestamp = null;
  };

  private runPhase(callbacks: Set<FrameCallback>, frame: FrameTick): void {
    for (const callback of [...callbacks]) {
      if (callbacks.has(callback)) callback(frame);
    }
  }

  private hasCallbacks(): boolean {
    return this.drivers.size > 0 || this.observers.size > 0;
  }

  private stopIfIdle(): void {
    if (this.hasCallbacks()) return;
    if (
      this.frameRequest !== null &&
      typeof cancelAnimationFrame !== "undefined"
    ) {
      cancelAnimationFrame(this.frameRequest);
    }
    this.frameRequest = null;
    this.previousTimestamp = null;
  }
}

export const frameScheduler = new FrameScheduler();
