/**
 * Tick Runner (RAF based Spring Animation)
 *
 * Executes real-time spring animation using requestAnimationFrame
 */

import { ticker } from "../ticker";
import {
  computeSpringConstants,
  stepSpring,
  isSettled,
  SETTLE_THRESHOLD,
  type SpringState,
  type SpringConfig,
} from "../spring-core";
import type { AnimationControls } from "./types";

export interface TickRunnerOptions {
  from: number;
  to: number;
  spring: SpringConfig;
  velocity?: number;
  onUpdate: (value: number) => void;
  onComplete: () => void;
  onStart?: () => void;
}

/**
 * Run spring animation via RAF
 */
export function runTickAnimation(
  options: TickRunnerOptions,
): AnimationControls {
  const {
    from,
    to,
    spring,
    velocity: initialVelocity = 0,
    onUpdate,
    onComplete,
    onStart,
  } = options;

  let state: SpringState = { position: from, velocity: initialVelocity };
  let isActive = true;
  let settleTime = 0;
  let started = false;

  const constants = computeSpringConstants(spring);

  const tickCallback = (deltaTime: number) => {
    if (!isActive) return;

    if (!started) {
      started = true;
      onStart?.();
    }

    // Calculate spring step
    state = stepSpring(state, to, constants, deltaTime);

    // Check convergence
    if (isSettled(state, to)) {
      settleTime += Math.min(deltaTime, 0.033);

      if (settleTime >= SETTLE_THRESHOLD) {
        state = { position: to, velocity: 0 };
        isActive = false;

        onUpdate(state.position);
        ticker.unsubscribe(tickCallback);
        onComplete();
        return;
      }
    } else {
      settleTime = 0;
    }

    onUpdate(state.position);
  };

  ticker.subscribe(tickCallback);

  return {
    stop: () => {
      if (isActive) {
        isActive = false;
        ticker.unsubscribe(tickCallback);
      }
    },
    getPosition: () => state.position,
    getVelocity: () => state.velocity,
    isRunning: () => isActive,
  };
}
