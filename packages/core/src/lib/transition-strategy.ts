import type { TransitionConfig } from "./types";
import type { Animator } from "./animator";

export const TRANSITION_STRATEGY = Symbol.for("TRANSITION_STRATEGY");

export interface StrategyContext<TAnimationValue = number> {
  // Current animation state
  currentAnimation: { animator: Animator<TAnimationValue>; direction: "in" | "out" } | null;
}

export interface AnimationSetup<TAnimationValue = number> {
  config?: TransitionConfig<TAnimationValue>;
  state: { position: TAnimationValue; velocity: TAnimationValue extends number ? number : Record<string, number> };
  from: TAnimationValue;
  to: TAnimationValue;
  direction: "forward" | "backward";
}

export interface TransitionConfigs<TAnimationValue = number> {
  in?: Promise<TransitionConfig<TAnimationValue>>;
  out?: Promise<TransitionConfig<TAnimationValue>>;
}

export interface TransitionStrategy<TAnimationValue = number> {
  runIn: (configs: TransitionConfigs<TAnimationValue>) => Promise<AnimationSetup<TAnimationValue>>;
  runOut: (configs: TransitionConfigs<TAnimationValue>) => Promise<AnimationSetup<TAnimationValue>>;
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

export const createDefaultStrategy = <TAnimationValue = number>(
  context: StrategyContext<TAnimationValue>
): TransitionStrategy<TAnimationValue> => {
  return {
    runIn: async (configs: TransitionConfigs<TAnimationValue>) => {
      const { currentAnimation } = context;

      // Scenario 4: OUT animation running + IN trigger
      if (currentAnimation && currentAnimation.direction === "out") {
        // Stop current OUT animation
        const currentState = currentAnimation.animator.getCurrentState();
        currentAnimation.animator.stop();

        // Use OUT config but reverse direction
        if (configs.out) {
          const outConfig = await configs.out;
          // Extract from/to with defaults for out transition
          const { from = 1 as TAnimationValue, to = 0 as TAnimationValue } = outConfig;
          return {
            config: outConfig,
            state: currentState,
            from, // OUT animation's from
            to, // OUT animation's to
            direction: "backward", // Will actually go 0→1
          };
        }
      }

      // Scenario 1: No animation running OR IN already running
      const config = await configs.in;
      if (!config) {
        // No config, return minimal setup
        return {
          state: { position: 0 as TAnimationValue, velocity: 0 as TAnimationValue extends number ? number : Record<string, number> },
          from: 0 as TAnimationValue,
          to: 1 as TAnimationValue,
          direction: "forward",
        };
      }
      
      // Extract from/to with defaults for in transition
      const { from = 0 as TAnimationValue, to = 1 as TAnimationValue } = config;
      return {
        config,
        state: { position: from, velocity: 0 as TAnimationValue extends number ? number : Record<string, number> },
        from,
        to,
        direction: "forward",
      };
    },

    runOut: async (configs: TransitionConfigs<TAnimationValue>) => {
      const { currentAnimation } = context;

      // Scenario 3: IN animation running + OUT trigger
      if (currentAnimation && currentAnimation.direction === "in") {
        // Stop current IN animation
        const currentState = currentAnimation.animator.getCurrentState();
        currentAnimation.animator.stop();

        // Use IN config but reverse direction
        if (configs.in) {
          const inConfig = await configs.in;
          // Extract from/to with defaults for in transition
          const { from = 0 as TAnimationValue, to = 1 as TAnimationValue } = inConfig;
          return {
            config: inConfig,
            state: {
              position: currentState.position,
              velocity: currentState.velocity,
            },
            from, // IN animation's from
            to, // IN animation's to
            direction: "backward", // Will actually go 1→0
          };
        }
      }

      // Scenario 2: No animation running OR OUT already running
      const config = await configs.out;
      if (!config) {
        // No config, return minimal setup
        return {
          state: { position: 1 as TAnimationValue, velocity: 0 as TAnimationValue extends number ? number : Record<string, number> },
          from: 1 as TAnimationValue,
          to: 0 as TAnimationValue,
          direction: "forward",
        };
      }
      
      // Extract from/to with defaults for out transition
      const { from = 1 as TAnimationValue, to = 0 as TAnimationValue } = config;
      return {
        config,
        state: { position: from, velocity: 0 as TAnimationValue extends number ? number : Record<string, number> },
        from,
        to,
        direction: "forward",
      };
    },
  };
};
