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
  computeSpringConstants,
  stepSpring,
  isSettled,
  SETTLE_THRESHOLD,
  type SpringState,
  type SpringConfig,
} from "../spring-core";
import type { AnimationControls, StyleObject } from "./types";

export interface CssRunnerOptions {
  element: HTMLElement;
  from: number;
  to: number;
  spring: SpringConfig;
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
 * Full spring simulation (synchronous)
 * Records position and velocity over time
 */
function simulateSpring(
  from: number,
  to: number,
  spring: SpringConfig,
  initialVelocity = 0,
): SimulationFrame[] {
  const constants = computeSpringConstants(spring);
  const MAX_FRAMES = 600; // Max 10 seconds

  let state: SpringState = { position: from, velocity: initialVelocity };
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
    state = stepSpring(state, to, constants, FRAME_TIME / 1000);

    // Check convergence
    if (isSettled(state, to)) {
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
    element,
    from,
    to,
    spring,
    velocity: initialVelocity = 0,
    style: styleFn,
    onComplete,
    onStart,
  } = options;

  // Phase 1: Simulation (record position, velocity over time)
  const frames = simulateSpring(from, to, spring, initialVelocity);

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
  const animation = element.animate(keyframes, {
    duration,
    fill: "forwards",
    easing: "ease-in",
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
