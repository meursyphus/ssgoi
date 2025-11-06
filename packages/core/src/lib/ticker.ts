/**
 * Ticker - Singleton requestAnimationFrame manager
 * Prevents multiple RAF calls by batching all animation updates into a single loop
 */

type TickerCallback = (timestamp: number) => void;

class Ticker {
  private listeners = new Set<TickerCallback>();
  private rafId: number | null = null;
  private isRunning = false;

  private tick = (timestamp: number) => {
    this.listeners.forEach((callback) => {
      callback(timestamp);
    });

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

  getListenerCount(): number {
    return this.listeners.size;
  }
}

// Singleton instance
export const ticker = new Ticker();
