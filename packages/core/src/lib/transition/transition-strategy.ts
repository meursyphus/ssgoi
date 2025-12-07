import type { MultiSpringConfig } from "../types";
import type { Animation } from "../animator/animation";

export const TRANSITION_STRATEGY = Symbol.for("TRANSITION_STRATEGY");

export interface StrategyContext {
  // Current animation state
  currentAnimation: {
    controller: Animation;
    direction: "in" | "out";
  } | null;
}

/**
 * Internal animation setup returned by strategy
 * Always uses MultiSpringConfig (normalized from user's Single/Multi config)
 * @internal
 */
export interface InternalAnimationSetup {
  config?: MultiSpringConfig;
  state: {
    position: number;
    velocity: number;
  };
  from: number;
  to: number;
  direction: "forward" | "backward";
}

/**
 * Internal transition configs passed to strategy
 * Always uses MultiSpringConfig (normalized before passing)
 * @internal
 */
export interface InternalTransitionConfigs {
  in?: MultiSpringConfig;
  out?: MultiSpringConfig;
}

export interface TransitionStrategy {
  runIn: (
    configs: InternalTransitionConfigs,
  ) => Promise<InternalAnimationSetup>;
  runOut: (
    configs: InternalTransitionConfigs,
  ) => Promise<InternalAnimationSetup>;
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
    runIn: async (configs: InternalTransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 4: OUT animation running + IN trigger
      if (currentAnimation && currentAnimation.direction === "out") {
        // Stop current OUT animation, get state from first animator
        const position = currentAnimation.controller.getCurrentValue();
        const velocity = currentAnimation.controller.getVelocity();
        currentAnimation.controller.stop();

        // Use OUT config but reverse direction
        if (configs.out) {
          // OUT animation: from=1, to=0, backward goes toward from (1)
          return {
            config: configs.out,
            state: { position, velocity },
            from: 1,
            to: 0,
            direction: "backward", // Will actually go 0→1 (backward means toward 'from')
          };
        }
      }

      // Scenario 1: No animation running OR IN already running
      const config = configs.in;
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

      // IN animation: from=0, to=1
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
    },

    runOut: async (configs: InternalTransitionConfigs) => {
      const { currentAnimation } = context;

      // Scenario 3: IN animation running + OUT trigger
      if (currentAnimation && currentAnimation.direction === "in") {
        // Stop current IN animation, get state from first animator
        const position = currentAnimation.controller.getCurrentValue();
        const velocity = currentAnimation.controller.getVelocity();
        currentAnimation.controller.stop();

        // Use IN config but reverse direction
        if (configs.in) {
          // IN animation: from=0, to=1, backward goes toward from (0)
          return {
            config: configs.in,
            state: { position, velocity },
            from: 0,
            to: 1,
            direction: "backward", // Will actually go 1→0 (backward means toward 'from')
          };
        }
      }

      // Scenario 2: No animation running OR OUT already running
      const config = configs.out;
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

      // OUT animation: from=1, to=0
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
    },
  };
};

/**
 * Page transition strategy - Always starts fresh without checking current animations
 * This is used for page-level transitions where each transition should be independent
 */
export const createPageTransitionStrategy = (): TransitionStrategy => {
  return {
    runIn: async (configs: InternalTransitionConfigs) => {
      // Always start fresh for IN transition
      const config = configs.in;
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

      // IN animation: from=0, to=1
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
    },

    runOut: async (configs: InternalTransitionConfigs) => {
      // Always start fresh for OUT transition
      const config = configs.out;
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

      // OUT animation: from=1, to=0
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
    },
  };
};
