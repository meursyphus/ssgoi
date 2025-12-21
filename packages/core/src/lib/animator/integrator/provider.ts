/**
 * Integrator Provider
 *
 * Static class that creates appropriate Integrator based on SpringConfig.
 * Acts as a factory for strategy pattern implementation.
 */

import type { SpringConfig } from "../../types";
import type { Integrator } from "./types";
import { SpringIntegrator } from "./spring-integrator";
import { DoubleSpringIntegrator } from "./double-spring-integrator";

export class IntegratorProvider {
  /**
   * Create an Integrator from SpringConfig
   *
   * @param config Spring configuration (stiffness, damping, doubleSpring)
   * @returns Appropriate Integrator instance
   */
  static from(config: SpringConfig): Integrator {
    if (config.doubleSpring) {
      const doubleSpring = config.doubleSpring;

      // Determine follower config
      let follower: number | { stiffness: number; damping: number } | undefined;

      if (typeof doubleSpring === "number") {
        // Ratio mode
        follower = doubleSpring;
      } else if (typeof doubleSpring === "object") {
        // Custom follower config
        follower = {
          stiffness: doubleSpring.stiffness,
          damping: doubleSpring.damping,
        };
      }
      // else: true → undefined (same as leader)

      return new DoubleSpringIntegrator({
        stiffness: config.stiffness,
        damping: config.damping,
        follower,
      });
    }

    return new SpringIntegrator({
      stiffness: config.stiffness,
      damping: config.damping,
    });
  }
}
