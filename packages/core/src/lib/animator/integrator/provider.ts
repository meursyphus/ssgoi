/**
 * Integrator Provider
 *
 * Static class that creates appropriate Integrator based on physics config.
 * Acts as a factory for strategy pattern implementation.
 */

import type { SpringConfig, InertiaConfig } from "../../types";
import type { Integrator } from "./types";
import { SpringIntegrator } from "./spring-integrator";
import { DoubleSpringIntegrator } from "./double-spring-integrator";
import { InertiaIntegrator } from "./inertia-integrator";

export interface PhysicsConfig {
  spring?: SpringConfig;
  inertia?: InertiaConfig;
}

export class IntegratorProvider {
  /**
   * Create an Integrator from physics config
   *
   * @param config Physics configuration (spring or inertia)
   * @returns Appropriate Integrator instance
   * @throws Error if both spring and inertia are provided
   */
  static from(config: PhysicsConfig): Integrator {
    // Validate: cannot have both spring and inertia
    if (config.spring && config.inertia) {
      throw new Error(
        "Cannot use both 'spring' and 'inertia' together. Choose one physics type.",
      );
    }

    // Inertia mode
    if (config.inertia) {
      return new InertiaIntegrator({
        acceleration: config.inertia.acceleration,
        resistance: config.inertia.resistance,
        resistanceType: config.inertia.resistanceType,
        min: config.inertia.min,
        max: config.inertia.max,
        bounceStiffness: config.inertia.bounceStiffness,
        bounceDamping: config.inertia.bounceDamping,
        restDelta: config.inertia.restDelta,
      });
    }

    // Spring mode (default)
    const spring = config.spring ?? { stiffness: 300, damping: 30 };

    if (spring.doubleSpring) {
      const doubleSpring = spring.doubleSpring;

      // Determine follower config
      let follower:
        | number
        | {
            stiffness: number;
            damping: number;
            restDelta?: number;
            restSpeed?: number;
          }
        | undefined;

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
        stiffness: spring.stiffness,
        damping: spring.damping,
        follower,
        restDelta: spring.restDelta,
        restSpeed: spring.restSpeed,
      });
    }

    return new SpringIntegrator({
      stiffness: spring.stiffness,
      damping: spring.damping,
      restDelta: spring.restDelta,
      restSpeed: spring.restSpeed,
    });
  }

  /**
   * Create an Integrator from SpringConfig (legacy support)
   * @deprecated Use from({ spring: config }) instead
   */
  static fromSpring(config: SpringConfig): Integrator {
    return IntegratorProvider.from({ spring: config });
  }
}
