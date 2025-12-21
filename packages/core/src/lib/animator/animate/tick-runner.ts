/**
 * Tick Runner (RAF based Spring Animation)
 *
 * Executes real-time spring animation using requestAnimationFrame
 */

import { ticker } from "../ticker";
import {
  type Integrator,
  type IntegratorState,
  IntegratorProvider,
  SETTLE_THRESHOLD,
} from "../integrator";
import type { SpringConfig } from "../../types";
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

  let state: IntegratorState = { position: from, velocity: initialVelocity };
  let isActive = true;
  let settleTime = 0;
  let started = false;

  const integrator: Integrator = IntegratorProvider.from(spring);

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
