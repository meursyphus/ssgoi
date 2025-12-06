/**
 * Ticker - Singleton requestAnimationFrame manager
 * Prevents multiple RAF calls by batching all animation updates into a single loop
 * Inspired by GSAP's ticker with mobile optimizations
 */

type TickerCallback = (deltaTime: number, elapsed: number) => void;

class Ticker {
  private listeners = new Set<TickerCallback>();
  private rafId: number | null = null;
  private isRunning = false;

  // Timing
  private startTime = Date.now();
  private lastUpdate = this.startTime;
  private elapsed = 0;

  // Lag smoothing (mobile optimization)
  private lagThreshold = 500; // ms - detect tab switches, backgrounding
  private adjustedLag = 33; // ms - max time jump to prevent animation skip
  private maxDeltaTime = 33; // ms - clamp for physics stability (30fps minimum)

  // FPS throttling
  private gap = 1000 / 240; // max 240fps
  private nextTime = this.gap;

  private tick = () => {
    const now = Date.now();
    const rawFrameElapsed = now - this.lastUpdate; // Actual elapsed time (before adjustment)
    let frameElapsed = rawFrameElapsed;

    // Lag smoothing: prevent huge time jumps (e.g., tab switch on mobile)
    // > 500ms: tab switch detected → adjust startTime to maintain sync
    if (frameElapsed > this.lagThreshold || frameElapsed < 0) {
      this.startTime += frameElapsed - this.adjustedLag;
      frameElapsed = this.adjustedLag;
    }
    // 33~500ms: clamp for physics stability (drift allowed)
    else if (frameElapsed > this.maxDeltaTime) {
      frameElapsed = this.maxDeltaTime;
    }

    this.lastUpdate = now;
    const totalElapsed = now - this.startTime;
    const overlap = totalElapsed - this.nextTime;

    // Only dispatch if enough time has passed (FPS throttling)
    if (overlap > 0) {
      // Delta time in seconds
      const deltaTime = frameElapsed / 1000;
      this.elapsed = totalElapsed / 1000;

      // Adaptive scheduling: if we're behind, add 4ms, otherwise add gap
      this.nextTime += overlap + (overlap >= this.gap ? 4 : this.gap - overlap);

      // Execute all listeners with delta time
      this.listeners.forEach((callback) => {
        callback(deltaTime, this.elapsed);
      });
    }

    if (this.listeners.size > 0) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.isRunning = false;
      this.rafId = null;
    }
  };

  subscribe(callback: TickerCallback): () => void {
    this.listeners.add(callback);

    // Start the loop if not already running
    if (!this.isRunning) {
      this.isRunning = true;
      this.rafId = requestAnimationFrame(this.tick);
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribe(callback);
    };
  }

  unsubscribe(callback: TickerCallback): void {
    this.listeners.delete(callback);

    // Stop the loop if no more listeners
    if (this.listeners.size === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.isRunning = false;
      this.rafId = null;
    }
  }

  /**
   * Configure lag smoothing behavior
   * @param threshold - Time threshold to detect lag (default: 500ms)
   * @param adjustedLag - Max time jump when lag detected (default: 33ms)
   */
  lagSmoothing(threshold: number, adjustedLag: number): void {
    this.lagThreshold = threshold;
    this.adjustedLag = Math.min(adjustedLag, threshold);
  }

  /**
   * Set maximum FPS
   * @param fps - Target FPS (default: 240)
   */
  fps(fps: number): void {
    this.gap = 1000 / fps;
    this.nextTime = this.elapsed * 1000 + this.gap;
  }

  getListenerCount(): number {
    return this.listeners.size;
  }

  getElapsed(): number {
    return this.elapsed;
  }
}

// Singleton instance
export const ticker = new Ticker();
