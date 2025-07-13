import { linear } from "./easing";
import type { TransitionConfig } from "./types";

export interface RunTransitionOptions {
  getConfig: () => TransitionConfig | Promise<TransitionConfig>;
  direction?: 'forward' | 'backward';
  onComplete?: () => void;
}

/**
 * Core animation engine that runs a transition using requestAnimationFrame
 * Returns a cleanup function to cancel the animation
 */
export function runTransition({
  getConfig,
  direction = 'forward',
  onComplete,
}: RunTransitionOptions): () => void {
  const startTime = performance.now();
  let animationId: number | null = null;
  let cancelled = false;

  const animate = async () => {
    if (cancelled) return;
    
    // Get fresh config on every frame
    const config = await Promise.resolve(getConfig());
    const { duration = 300, easing = linear, tick } = config;
    
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    
    // Apply direction - backward reverses the progress
    const finalProgress = direction === 'backward' ? 1 - easedProgress : easedProgress;

    // Call tick with the final progress
    tick?.(finalProgress);

    if (progress < 1 && !cancelled) {
      animationId = requestAnimationFrame(() => animate());
    } else if (!cancelled) {
      // Animation complete
      animationId = null;
      onComplete?.();
    }
  };

  // Start the animation
  animate();

  // Return cleanup function
  return () => {
    cancelled = true;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };
}
