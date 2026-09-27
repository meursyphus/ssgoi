type FrameCallback = () => void;

/**
 * One requestAnimationFrame loop shared by everything that has to poll once
 * per rendering opportunity, such as a MultiAnimation waiting for a child's
 * live progress to release its dependants. Playback itself is native WAAPI
 * and never runs through here; the loop is idle whenever nothing is waiting.
 */
class FrameScheduler {
  private callbacks = new Set<FrameCallback>();
  private frameRequest: number | null = null;

  subscribe(callback: FrameCallback): () => void {
    this.callbacks.add(callback);
    this.requestFrame();

    return () => {
      this.callbacks.delete(callback);
      this.stopIfIdle();
    };
  }

  private requestFrame(): void {
    if (this.frameRequest !== null || this.callbacks.size === 0) return;
    this.frameRequest = requestAnimationFrame(this.tick);
  }

  private tick = (): void => {
    this.frameRequest = null;
    for (const callback of [...this.callbacks]) {
      if (this.callbacks.has(callback)) callback();
    }
    this.requestFrame();
  };

  private stopIfIdle(): void {
    if (this.callbacks.size > 0 || this.frameRequest === null) return;
    if (typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(this.frameRequest);
    }
    this.frameRequest = null;
  }
}

export const frameScheduler = new FrameScheduler();
