/**
 * Tick Runner (RAF based Spring Animation)
 *
 * Executes real-time spring animation using requestAnimationFrame
 */

import { ticker } from "./ticker";
import {
  type Integrator,
  type IntegratorState,
  SETTLE_THRESHOLD,
} from "../integrator";
import type { AnimationControls } from "./types";

export interface TickRunnerOptions {
  integrator: Integrator;
  from: number;
  to: number;
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
    integrator,
    from,
    to,
    velocity: initialVelocity = 0,
    onUpdate,
    onComplete,
    onStart,
  } = options;

  let state: IntegratorState = { position: from, velocity: initialVelocity };
  let isActive = true;
  let settleTime = 0;
  let started = false;

  const tickCallback = (deltaTime: number) => {
    if (!isActive) return;

    if (!started) {
      started = true;
      onStart?.();
    }

    // Calculate spring step
    state = integrator.step(state, to, deltaTime);

    // Check convergence
    if (integrator.isSettled(state, to)) {
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
