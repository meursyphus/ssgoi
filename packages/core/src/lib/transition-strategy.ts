import type { TransitionConfig } from "./types";
import type { Animator } from "./animator";

export const TRANSITION_STRATEGY = Symbol.for("TRANSITION_STRATEGY");

export interface StrategyContext {
  // Current animation state
  currentAnimation: { animator: Animator; direction: "in" | "out" } | null;
}

export interface AnimationSetup {
  config: TransitionConfig;
  state: { position: number; velocity: number; from: number; to: number };
  direction: "forward" | "backward";
}

export interface TransitionConfigs {
  in?: Promise<TransitionConfig>;
  out?: Promise<TransitionConfig>;
}

export interface TransitionStrategy {
  runIn: (configs: TransitionConfigs) => Promise<AnimationSetup>;
  runOut: (configs: TransitionConfigs) => Promise<AnimationSetup>;
}

export const createDefaultStrategy = (
  context: StrategyContext
): TransitionStrategy => {
  return {
    runIn: async (configs: TransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 4: OUT animation running + IN trigger
      if (
        currentAnimation &&
        currentAnimation.animator.getIsAnimating() &&
        currentAnimation.direction === "out"
      ) {
        // Stop current OUT animation
        const currentState = currentAnimation.animator.getCurrentState();
        currentAnimation.animator.stop();

        // Use OUT config but reverse direction
        if (configs.out) {
          const outConfig = await configs.out;
          return {
            config: outConfig,
            state: currentState,
            direction: "backward",
          };
        }
      }

      // Scenario 1: No animation running OR IN already running
      if (!currentAnimation || !currentAnimation.animator.getIsAnimating()) {
        if (configs.in) {
          const config = await configs.in;
          return {
            config,
            state: { position: 0, velocity: 0, from: 0, to: 1 },
            direction: "forward",
          };
        }
      }

      // If IN is already running, just continue - return dummy setup
      return {
        config: {},
        state: { position: 0, velocity: 0, from: 0, to: 1 },
        direction: "forward",
      };
    },

    runOut: async (configs: TransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 3: IN animation running + OUT trigger
      if (
        currentAnimation &&
        currentAnimation.animator.getIsAnimating() &&
        currentAnimation.direction === "in"
      ) {
        // Stop current IN animation
        const currentState = currentAnimation.animator.getCurrentState();
        currentAnimation.animator.stop();

        // Use IN config but reverse direction
        if (configs.in) {
          const config = await configs.in;
          return {
            config,
            state: currentState,
            direction: "backward",
          };
        }
      }

      // Scenario 2: No animation running OR OUT already running
      if (
        !currentAnimation ||
        !currentAnimation.animator.getIsAnimating() ||
        currentAnimation.direction === "out"
      ) {
        if (configs.out) {
          const config = await configs.out;
          return {
            config,
            state: { position: 1, velocity: 0, from: 1, to: 0 },
            direction: "forward",
          };
        }
      }

      // Fallback
      return {
        config: {},
        state: { position: 1, velocity: 0, from: 1, to: 0 },
        direction: "forward",
      };
    },
  };
};
