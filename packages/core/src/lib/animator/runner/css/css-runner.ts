/**
 * CSS Runner (Web Animation API based Spring Animation)
 *
 * Pre-simulates spring physics and converts to keyframes,
 * then executes via Web Animation API.
 *
 * Records simulation data to accurately calculate
 * position and velocity when stopped mid-animation.
 */

import {
  type Integrator,
  type IntegratorState,
  SETTLE_THRESHOLD,
} from "../../integrator";
import type { AnimationControls, StyleObject } from "../types";
import { interpolateElapsedTime } from "./transform-interpolator";

export interface CssRunnerOptions {
  integrator: Integrator;
  element: HTMLElement;
  from: number;
  to: number;
  velocity?: number;
  style: (progress: number) => StyleObject;
  onComplete: () => void;
  onStart?: () => void;
}

/**
 * Simulation frame data
 */
interface SimulationFrame {
  time: number; // ms
  position: number;
  velocity: number;
}

const FRAME_TIME = 1000 / 60; // ~16.67ms per frame

/**
 * Full simulation (synchronous)
 * Records position and velocity over time
 */
function simulate(
  integrator: Integrator,
  from: number,
  to: number,
  initialVelocity = 0,
): SimulationFrame[] {
  const MAX_FRAMES = 600; // Max 10 seconds

  let state: IntegratorState = { position: from, velocity: initialVelocity };
  let settleTime = 0;
  const frames: SimulationFrame[] = [];

  for (let i = 0; i < MAX_FRAMES; i++) {
    const time = i * FRAME_TIME;

    // Record current state
    frames.push({
      time,
      position: state.position,
      velocity: state.velocity,
    });

    // Spring step (convert to seconds)
    state = integrator.step(state, to, FRAME_TIME / 1000);

    // Check convergence
    if (integrator.isSettled(state, to)) {
      settleTime += FRAME_TIME / 1000;
      if (settleTime >= SETTLE_THRESHOLD) {
        // Final frame - exact target value
        frames.push({
          time: (i + 1) * FRAME_TIME,
          position: to,
          velocity: 0,
        });
        break;
      }
    } else {
      settleTime = 0;
    }
  }

  return frames;
}

/**
 * Interpolate position and velocity from elapsed time
 * Uses binary search + linear interpolation
 */
function interpolateFrame(
  frames: SimulationFrame[],
  elapsedTime: number,
): { position: number; velocity: number } {
  if (frames.length === 0) {
    return { position: 0, velocity: 0 };
  }

  const firstFrame = frames[0]!;
  const lastFrame = frames[frames.length - 1]!;

  // Bounds check
  if (elapsedTime <= 0) {
    return { position: firstFrame.position, velocity: firstFrame.velocity };
  }

  if (elapsedTime >= lastFrame.time) {
    return { position: lastFrame.position, velocity: lastFrame.velocity };
  }

  // Binary search for frame
  let low = 0;
  let high = frames.length - 1;

  while (low < high - 1) {
    const mid = Math.floor((low + high) / 2);
    if (frames[mid]!.time <= elapsedTime) {
      low = mid;
    } else {
      high = mid;
    }
  }

  // Linear interpolation
  const f1 = frames[low]!;
  const f2 = frames[high]!;
  const t = (elapsedTime - f1.time) / (f2.time - f1.time);

  return {
    position: f1.position + (f2.position - f1.position) * t,
    velocity: f1.velocity + (f2.velocity - f1.velocity) * t,
  };
}

/**
 * Convert SimulationFrame[] to Keyframe[]
 */
function framesToKeyframes(
  frames: SimulationFrame[],
  styleFn: (position: number) => StyleObject,
): Keyframe[] {
  return frames.map((frame) => {
    // Pass position value directly (same behavior as tick-runner)
    return styleFn(frame.position) as Keyframe;
  });
}

/**
 * Run spring animation via Web Animation API
 */
export function runCssAnimation(options: CssRunnerOptions): AnimationControls {
  const {
    integrator,
    element,
    from,
    to,
    velocity: initialVelocity = 0,
    style: styleFn,
    onComplete,
    onStart,
  } = options;

  // Phase 1: Simulation (record position, velocity over time)
  const frames = simulate(integrator, from, to, initialVelocity);

  // Handle empty frames
  if (frames.length === 0) {
    onStart?.();
    onComplete();
    return {
      stop: () => {},
      getPosition: () => to,
      getVelocity: () => 0,
      isRunning: () => false,
    };
  }

  // Phase 2: Generate keyframes
  const keyframes = framesToKeyframes(frames, styleFn);
  const lastFrame = frames[frames.length - 1]!;
  const duration = lastFrame.time;

  // Phase 3: Execute via Web Animation API
  // Clear inline styles that will be animated to avoid conflicts
  // (especially clipPath which has issues when set inline before WAAPI animation)
  const firstKeyframe = keyframes[0];
  if (firstKeyframe) {
    for (const prop of Object.keys(firstKeyframe)) {
      (element.style as unknown as Record<string, string>)[prop] = "";
    }
  }

  const animation = element.animate(keyframes, {
    duration,
    fill: "forwards",
    easing: "linear",
    composite: "replace",
  });

  let isActive = true;
  let startTime = performance.now();

  // Extract frame times for interpolation
  const frameTimes = frames.map((f) => f.time);

  // ============================================================================
  // WAAPI startTime Synchronization (Safari/WebKit compositor timing fix)
  // ============================================================================
  //
  // Problem: Visual "jump back" glitch during animation start on heavy DOM mounts.
  //
  // Root cause (especially noticeable on Safari):
  // When animate() is called, WAAPI goes through two phases:
  //
  // 1. PENDING STATE (Main Thread rendering):
  //    - Animation enters "pending" state with unresolved startTime
  //    - Main thread immediately starts rendering frames with temporary timing
  //    - This happens BEFORE compositor thread is ready
  //
  // 2. COMPOSITOR PROMOTION:
  //    - Compositor thread sets up GPU-accelerated layer
  //    - When ready, compositor confirms the "real" startTime
  //    - This startTime may differ from what main thread was using
  //
  // The timing gap between these phases causes visual regression:
  //
  //   Frame 1: Main thread renders at 10% (temp startTime)
  //   Frame 2: Main thread renders at 15%
  //   Frame 3: Compositor ready → confirms startTime → recalculates to 5%
  //   Frame 4: Animation jumps from 15% → 5% (visible backward jump!)
  //
  // Solution:
  // At animation.ready (compositor sync complete), we:
  // 1. Read current rendered transform via getComputedStyle
  // 2. Find which keyframe matches that transform value
  // 3. Manually set startTime to maintain visual continuity
  //
  // This ensures the animation continues from where it visually was,
  // not where the compositor thinks it should be.
  //
  // References:
  // - Mozilla Bug 927349: "animation jumps from paused→future→started"
  // - Chromium Blink README: "accelerated animation still runs on main thread"
  // - WebKit Bug 236080: compositor timing with delayed animations
  // ============================================================================
  animation.ready.then(() => {
    if (!isActive) return;

    // Get current rendered transform from computed style
    const computedTransform = getComputedStyle(element).transform;

    // Try to find which keyframe matches the current rendered state
    const result = interpolateElapsedTime(
      keyframes,
      frameTimes,
      computedTransform,
    );

    const timelineTime = document.timeline.currentTime;
    if (result.success && timelineTime !== null) {
      const originalStartTime = animation.startTime;
      const correctedStartTime = Number(timelineTime) - result.frameTime;

      // Debug log for startTime synchronization
      console.log("[WAAPI Sync]", {
        computedTransform,
        interpolatedFrameTime: result.frameTime.toFixed(2) + "ms",
        confidence: result.confidence,
        originalStartTime:
          originalStartTime !== null
            ? Number(originalStartTime).toFixed(2)
            : null,
        correctedStartTime: correctedStartTime.toFixed(2),
        diff:
          originalStartTime !== null
            ? (correctedStartTime - Number(originalStartTime)).toFixed(2) + "ms"
            : "N/A",
      });

      // Adjust WAAPI startTime so animation continues from where it was rendered
      animation.startTime = correctedStartTime;

      // Also sync our internal startTime for getPosition/getVelocity calculations
      startTime = performance.now() - result.frameTime;
    }
    // If interpolation failed (no transform property), don't touch startTime
  });

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

    getPosition: () => {
      if (!isActive) {
        return lastFrame.position;
      }
      const elapsed = performance.now() - startTime;
      return interpolateFrame(frames, elapsed).position;
    },

    getVelocity: () => {
      if (!isActive) {
        return 0;
      }
      const elapsed = performance.now() - startTime;
      return interpolateFrame(frames, elapsed).velocity;
    },

    isRunning: () => isActive,
  };
}
