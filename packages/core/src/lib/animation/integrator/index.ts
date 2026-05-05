/**
 * Integrator Module
 *
 * Provides numerical integration implementations for animation physics.
 * Uses strategy pattern - all integrators implement the same interface.
 */

export type { Integrator, IntegratorState } from "./types";
export {
  POSITION_THRESHOLD,
  VELOCITY_THRESHOLD,
  SETTLE_THRESHOLD,
} from "./types";

export {
  SpringIntegrator,
  type SpringIntegratorConfig,
} from "./spring-integrator";
export {
  DoubleSpringIntegrator,
  type DoubleSpringIntegratorConfig,
  type FollowerSpringConfig,
} from "./double-spring-integrator";
export {
  InertiaIntegrator,
  type InertiaIntegratorConfig,
  type ResistanceType,
} from "./inertia-integrator";

export { IntegratorProvider, type PhysicsConfig } from "./provider";
