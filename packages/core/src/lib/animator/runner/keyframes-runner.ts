/**
 * Keyframes Runner (Pre-baked WAAPI animation)
 *
 * Plays a pre-built `Keyframe[]` directly via Web Animation API. No physics
 * simulation — the caller has already composed the desired motion into
 * keyframes (e.g. multiple springs baked into a single timeline). Useful for
 * transitions that need multiple coordinated springs to drive a single CSS
 * property: bake them once, hand off to the compositor, run with zero
 * per-frame JS.
 */

import type { AnimationControls } from "./types";

export interface KeyframesRunnerOptions {
  element: HTMLElement;
  frames: Keyframe[];
  duration: number; // ms
  easing?: string; // default "linear"
  /** Reported as getPosition() at the end of the animation */
  from: number;
  to: number;
  onComplete: () => void;
  onStart?: () => void;
}

export function runKeyframesAnimation(
  options: KeyframesRunnerOptions,
): AnimationControls {
  const {
    element,
    frames,
    duration,
    easing = "linear",
    from,
    to,
    onComplete,
    onStart,
  } = options;

  // Clear any inline styles for properties we're about to animate
  // (mirrors css-runner: avoids inline styles overriding WAAPI values,
  // particularly for clip-path).
  const firstKeyframe = frames[0];
  if (firstKeyframe) {
    for (const prop of Object.keys(firstKeyframe)) {
      if (prop === "offset" || prop === "easing" || prop === "composite") {
        continue;
      }
      (element.style as unknown as Record<string, string>)[prop] = "";
    }
  }

  const animation = element.animate(frames, {
    duration,
    fill: "forwards",
    easing,
    composite: "replace",
  });

  let isActive = true;
  const startTime = performance.now();

  onStart?.();

  animation.onfinish = () => {
    if (isActive) {
      isActive = false;
      onComplete();
    }
  };

  return {
    stop: () => {
      if (isActive) {
        isActive = false;
        animation.cancel();
      }
    },

    // Linear progress mapped onto [from, to] — used by MultiAnimator for
    // stagger thresholds. The actual visual motion is whatever the keyframes
    // dictate; this mapping just gives the orchestration layer a monotonic
    // progress signal.
    getPosition: () => {
      if (!isActive) return to;
      const elapsed = performance.now() - startTime;
      const progress = Math.min(Math.max(elapsed / duration, 0), 1);
      return from + (to - from) * progress;
    },

    // Baked animations don't expose velocity — interruption/resumption isn't
    // supported here (you can stop, but can't resume mid-flight with momentum).
    getVelocity: () => 0,

    isRunning: () => isActive,
  };
}
