import { linear } from "./easing";
import type { TransitionConfig } from "./types";

export interface RunTransitionOptions {
  config: TransitionConfig;
  direction?: 'forward' | 'backward';
  onComplete?: () => void;
}

/**
 * Core animation engine that runs a transition using requestAnimationFrame
 * Returns a cleanup function to cancel the animation
 */
export function runTransition({
  config,
  direction = 'forward',
  onComplete,
}: RunTransitionOptions): () => void {
  const { duration = 300, easing = linear, tick } = config;
  const startTime = performance.now();
  let animationId: number | null = null;

  const animate = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    
    // Apply direction - backward reverses the progress
    const finalProgress = direction === 'backward' ? 1 - easedProgress : easedProgress;

    // Call tick with the final progress
    tick?.(finalProgress);

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Animation complete
      animationId = null;
      onComplete?.();
    }
  };

  // Start the animation
  animationId = requestAnimationFrame(animate);

  // Return cleanup function
  return () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };
}
