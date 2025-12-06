import type {
  TransitionConfig,
  AnimationController,
  SingleSpringConfig,
} from "../types";

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
  config?: TransitionConfig;
  state: {
    position: number;
    velocity: number;
  };
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
  context: StrategyContext,
): TransitionStrategy => {
  return {
    runIn: async (configs: TransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 4: OUT animation running + IN trigger
      if (currentAnimation && currentAnimation.direction === "out") {
        // Stop current OUT animation
        const state = currentAnimation.controller.getCurrentState();
        currentAnimation.controller.stop();

        // Check if multi-spring animation
        if (state.type === "multi") {
          // Multi-spring: directly reverse the controller
          currentAnimation.controller.reverse();
          // Return special setup indicating already handled
          return {
            state: {
              position: 0,
              velocity: 0,
            },
            from: 0,
            to: 1,
            direction: "forward",
          };
        }

        // Single-spring: use OUT config but reverse direction
        if (configs.out) {
          const outConfig = await configs.out;
          // Extract from/to with defaults for out transition (single-spring)
          const { from = 1, to = 0 } = outConfig as SingleSpringConfig;
          return {
            config: outConfig,
            state: {
              position: state.position,
              velocity: state.velocity,
            },
            from, // OUT animation's from
            to, // OUT animation's to
            direction: "backward", // Will actually go 0→1 (backward means toward 'from')
          };
        }
      }

      // Scenario 1: No animation running OR IN already running
      const config = await configs.in;
      if (!config) {
        // No config, return minimal setup
        return {
          state: {
            position: 0,
            velocity: 0,
          },
          from: 0,
          to: 1,
          direction: "forward",
        };
      }

      // For multi-spring, return config without extracting from/to
      if ("springs" in config) {
        return {
          config,
          state: {
            position: 0,
            velocity: 0,
          },
          from: 0,
          to: 1,
          direction: "forward",
        };
      }

      // Extract from/to with defaults for in transition (single-spring)
      const { from = 0, to = 1 } = config;
      return {
        config,
        state: {
          position: from,
          velocity: 0,
        },
        from,
        to,
        direction: "forward",
      };
    },

    runOut: async (configs: TransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 3: IN animation running + OUT trigger
      if (currentAnimation && currentAnimation.direction === "in") {
        // Stop current IN animation
        const state = currentAnimation.controller.getCurrentState();
        currentAnimation.controller.stop();

        // Check if multi-spring animation
        if (state.type === "multi") {
          // Multi-spring: directly reverse the controller
          currentAnimation.controller.reverse();
          // Return special setup indicating already handled
          return {
            state: {
              position: 1,
              velocity: 0,
            },
            from: 1,
            to: 0,
            direction: "forward",
          };
        }

        // Single-spring: use IN config but reverse direction
        if (configs.in) {
          const inConfig = await configs.in;
          // Extract from/to with defaults for in transition (single-spring)
          const { from = 0, to = 1 } = inConfig as SingleSpringConfig;
          return {
            config: inConfig,
            state: {
              position: state.position,
              velocity: state.velocity,
            },
            from, // IN animation's from
            to, // IN animation's to
            direction: "backward", // Will actually go 1→0 (backward means toward 'from')
          };
        }
      }

      // Scenario 2: No animation running OR OUT already running
      const config = await configs.out;
      if (!config) {
        // No config, return minimal setup
        return {
          state: {
            position: 1,
            velocity: 0,
          },
          from: 1,
          to: 0,
          direction: "forward",
        };
      }

      // For multi-spring, return config without extracting from/to
      if ("springs" in config) {
        return {
          config,
          state: {
            position: 1,
            velocity: 0,
          },
          from: 1,
          to: 0,
          direction: "forward",
        };
      }

      // Extract from/to with defaults for out transition (single-spring)
      const { from = 1, to = 0 } = config;
      return {
        config,
        state: {
          position: from,
          velocity: 0,
        },
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
      // Always start fresh for IN transition
      const config = await configs.in;
      if (!config) {
        return {
          state: {
            position: 0,
            velocity: 0,
          },
          from: 0,
          to: 1,
          direction: "forward",
        };
      }

      // For multi-spring, return config without extracting from/to
      if ("springs" in config) {
        return {
          config,
          state: {
            position: 0,
            velocity: 0,
          },
          from: 0,
          to: 1,
          direction: "forward",
        };
      }

      // Extract from/to for single-spring
      const { from = 0, to = 1 } = config;
      return {
        config,
        state: {
          position: from,
          velocity: 0,
        },
        from,
        to,
        direction: "forward",
      };
    },

    runOut: async (configs: TransitionConfigs) => {
      // Always start fresh for OUT transition
      const config = await configs.out;
      if (!config) {
        return {
          state: {
            position: 1,
            velocity: 0,
          },
          from: 1,
          to: 0,
          direction: "forward",
        };
      }

      // For multi-spring, return config without extracting from/to
      if ("springs" in config) {
        return {
          config,
          state: {
            position: 1,
            velocity: 0,
          },
          from: 1,
          to: 0,
          direction: "forward",
        };
      }

      // Extract from/to for single-spring
      const { from = 1, to = 0 } = config;
      return {
        config,
        state: {
          position: from,
          velocity: 0,
        },
        from,
        to,
        direction: "forward",
      };
    },
  };
};
