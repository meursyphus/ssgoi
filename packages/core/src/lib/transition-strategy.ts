import type { TransitionConfig } from "./types";
import type { Animator } from "./animator";

export const TRANSITION_STRATEGY = Symbol.for("TRANSITION_STRATEGY");

export interface StrategyContext {
  // Current animation state
  currentAnimation: { animator: Animator; direction: "in" | "out" } | null;
}

export interface AnimationSetup {
  config?: TransitionConfig;
  state: { position: number; velocity: number };
  from: number;
  to: number;
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

/**
 * Creates a transition callback that can be used with framework-specific implementations
 * This is the core logic that frameworks can wrap with their own APIs
 *
 * UX Animation Behavior - 4 Main Scenarios:
 *
 * 1. No animation running + IN trigger:
 *    - Start entrance animation (0 → 1)
 *    - Return cleanup function for exit
 *
 * 2. No animation running + OUT trigger:
 *    - Clone element, start exit animation (1 → 0)
 *    - Remove clone when complete
 *
 * 3. IN animation running + OUT trigger:
 *    - Stop current IN animation (DOM is disappearing)
 *    - Clone element for exit animation
 *    - Create REVERSED IN animation (not OUT animation) with current state
 *    - This gives natural backward motion instead of jumping to OUT definition
 *
 * 4. OUT animation running + IN trigger:
 *    - Stop current OUT animation (cleanup any cloned elements)
 *    - Create REVERSED OUT animation (not IN animation) with current state
 *    - This gives natural backward motion instead of jumping to IN definition
 *    - Switch to entrance mode
 *
 * Closure Structure:
 * - Outer function: Returns entrance callback
 * - Inner function (entrance callback): Returns cleanup callback (exit)
 * - Cleanup callback: Handles exit transitions
 */

export const createDefaultStrategy = (
  context: StrategyContext
): TransitionStrategy => {
  return {
    runIn: async (configs: TransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 4: OUT animation running + IN trigger
      if (currentAnimation && currentAnimation.direction === "out") {
        // Stop current OUT animation
        const currentState = currentAnimation.animator.getCurrentState();
        currentAnimation.animator.stop();

        // Use OUT config but reverse direction
        if (configs.out) {
          const outConfig = await configs.out;
          return {
            config: outConfig,
            state: currentState,
            from: 1, // OUT animation's from
            to: 0, // OUT animation's to
            direction: "backward", // Will actually go 0→1
          };
        }
      }

      // Scenario 1: No animation running OR IN already running
      const config = await configs.in;
      return {
        config,
        state: { position: 0, velocity: 0 },
        from: 0,
        to: 1,
        direction: "forward",
      };
    },

    runOut: async (configs: TransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 3: IN animation running + OUT trigger
      if (currentAnimation && currentAnimation.direction === "in") {
        // Stop current IN animation
        const currentState = currentAnimation.animator.getCurrentState();
        currentAnimation.animator.stop();

        // Use IN config but reverse direction
        if (configs.in) {
          const config = await configs.in;
          return {
            config,
            state: {
              position: currentState.position,
              velocity: currentState.velocity,
            },
            from: 0, // IN animation's from
            to: 1, // IN animation's to
            direction: "backward", // Will actually go 1→0
          };
        }
      }

      // Scenario 2: No animation running OR OUT already running
      const config = await configs.out;
      return {
        config,
        state: { position: 1, velocity: 0 },
        from: 1,
        to: 0,
        direction: "forward",
      };
    },
  };
};
