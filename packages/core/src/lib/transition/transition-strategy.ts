import type { MultiSpringConfig, AnimationController } from "../types";

export const TRANSITION_STRATEGY = Symbol.for("TRANSITION_STRATEGY");

export interface StrategyContext {
  // Current animation state
  // Supports both single spring (Animator) and multi-spring (AnimationScheduler)
  currentAnimation: {
    controller: AnimationController;
    direction: "in" | "out";
  } | null;
}

export interface AnimationSetup {
  config?: MultiSpringConfig;
  state: {
    position: number;
    velocity: number;
  };
  from: number;
  to: number;
  direction: "forward" | "backward";
}

export interface TransitionConfigs {
  in?: Promise<MultiSpringConfig>;
  out?: Promise<MultiSpringConfig>;
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

/**
 * Helper to extract from/to from first spring (for normalized single-spring configs)
 *
 * TODO: Currently uses only the first spring's from/to values.
 * Need to consider how to handle multi-spring with different ranges per spring:
 * - Use first spring only? (current approach, works for normalized single-spring)
 * - Use min/max across all springs?
 * - Return array of ranges for each spring?
 */
const getSpringRange = (
  config: MultiSpringConfig,
  defaultFrom: number,
  defaultTo: number,
) => {
  const firstSpring = config.springs[0];
  return {
    from: firstSpring?.from ?? defaultFrom,
    to: firstSpring?.to ?? defaultTo,
  };
};

export const createDefaultStrategy = (
  context: StrategyContext,
): TransitionStrategy => {
  return {
    runIn: async (configs: TransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 4: OUT animation running + IN trigger
      if (currentAnimation && currentAnimation.direction === "out") {
        const state = currentAnimation.controller.getCurrentState();
        currentAnimation.controller.stop();
        currentAnimation.controller.reverse();

        // Use OUT config for reversal
        if (configs.out) {
          const outConfig = await configs.out;
          const { from, to } = getSpringRange(outConfig, 1, 0);
          return {
            config: outConfig,
            state: { position: state.position, velocity: state.velocity },
            from,
            to,
            direction: "backward",
          };
        }

        return {
          state: { position: 0, velocity: 0 },
          from: 0,
          to: 1,
          direction: "forward",
        };
      }

      // Scenario 1: No animation running OR IN already running
      const config = await configs.in;
      if (!config) {
        return {
          state: { position: 0, velocity: 0 },
          from: 0,
          to: 1,
          direction: "forward",
        };
      }

      const { from, to } = getSpringRange(config, 0, 1);
      return {
        config,
        state: { position: from, velocity: 0 },
        from,
        to,
        direction: "forward",
      };
    },

    runOut: async (configs: TransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 3: IN animation running + OUT trigger
      if (currentAnimation && currentAnimation.direction === "in") {
        const state = currentAnimation.controller.getCurrentState();
        currentAnimation.controller.stop();
        currentAnimation.controller.reverse();

        // Use IN config for reversal
        if (configs.in) {
          const inConfig = await configs.in;
          const { from, to } = getSpringRange(inConfig, 0, 1);
          return {
            config: inConfig,
            state: { position: state.position, velocity: state.velocity },
            from,
            to,
            direction: "backward",
          };
        }

        return {
          state: { position: 1, velocity: 0 },
          from: 1,
          to: 0,
          direction: "forward",
        };
      }

      // Scenario 2: No animation running OR OUT already running
      const config = await configs.out;
      if (!config) {
        return {
          state: { position: 1, velocity: 0 },
          from: 1,
          to: 0,
          direction: "forward",
        };
      }

      const { from, to } = getSpringRange(config, 1, 0);
      return {
        config,
        state: { position: from, velocity: 0 },
        from,
        to,
        direction: "forward",
      };
    },
  };
};

/**
 * Page transition strategy - Always starts fresh without checking current animations
 * This is used for page-level transitions where each transition should be independent
 */
export const createPageTransitionStrategy = (): TransitionStrategy => {
  return {
    runIn: async (configs: TransitionConfigs) => {
      const config = await configs.in;
      if (!config) {
        return {
          state: { position: 0, velocity: 0 },
          from: 0,
          to: 1,
          direction: "forward",
        };
      }

      const { from, to } = getSpringRange(config, 0, 1);
      return {
        config,
        state: { position: from, velocity: 0 },
        from,
        to,
        direction: "forward",
      };
    },

    runOut: async (configs: TransitionConfigs) => {
      const config = await configs.out;
      if (!config) {
        return {
          state: { position: 1, velocity: 0 },
          from: 1,
          to: 0,
          direction: "forward",
        };
      }

      const { from, to } = getSpringRange(config, 1, 0);
      return {
        config,
        state: { position: from, velocity: 0 },
        from,
        to,
        direction: "forward",
      };
    },
  };
};
