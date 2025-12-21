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
      const ratio =
        typeof config.doubleSpring === "number" ? config.doubleSpring : 1;

      return new DoubleSpringIntegrator({
        stiffness: config.stiffness,
        damping: config.damping,
        ratio,
      });
    }

    return new SpringIntegrator({
      stiffness: config.stiffness,
      damping: config.damping,
    });
  }
}
