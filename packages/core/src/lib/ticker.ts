/**
 * Centralized animation ticker using a single requestAnimationFrame loop
 * All animations subscribe to this ticker instead of creating their own RAF loops
 * This improves performance by batching all animation updates in a single frame
 */

type TickerListener = (timestamp: number) => void;

class Ticker {
  private listeners = new Set<TickerListener>();
  private rafId: number | null = null;
  private isRunning = false;

  /**
   * Subscribe a listener to the ticker
   * Automatically starts the ticker if not running
   */
  subscribe(listener: TickerListener): () => void {
    this.listeners.add(listener);

    // Start ticker if not already running
    if (!this.isRunning) {
      this.start();
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribe(listener);
    };
  }

  /**
   * Unsubscribe a listener from the ticker
   * Automatically stops the ticker if no listeners remain
   */
  unsubscribe(listener: TickerListener): void {
    this.listeners.delete(listener);

    // Stop ticker if no listeners remain
    if (this.listeners.size === 0 && this.isRunning) {
      this.stop();
    }
  }

  /**
   * Start the ticker loop
   */
  private start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.tick();
  }

  /**
   * Stop the ticker loop
   */
  private stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Main ticker loop - flushes all listeners in a single frame
   */
  private tick = (timestamp: number = performance.now()): void => {
    if (!this.isRunning) return;

    // Flush all listeners with the current timestamp
    // Create a copy to avoid issues if listeners modify the set during iteration
    const listenersToCall = Array.from(this.listeners);

    for (const listener of listenersToCall) {
      // Check if listener is still subscribed (it might have unsubscribed during iteration)
      if (this.listeners.has(listener)) {
        listener(timestamp);
      }
    }

    // Continue the loop only if still running and has listeners
    if (this.isRunning && this.listeners.size > 0) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.isRunning = false;
      this.rafId = null;
    }
  };

  /**
   * Get the number of active listeners (for debugging)
   */
  getListenerCount(): number {
    return this.listeners.size;
  }
}

// Export singleton instance
export const ticker = new Ticker();
