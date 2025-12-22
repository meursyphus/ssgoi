import type { PhysicsOptions, SpringConfig } from "../types";

/**
 * Get physics options with fallback to default spring
 */
export function getPhysics(
  physics: PhysicsOptions | undefined,
  fallback: { spring: SpringConfig },
): PhysicsOptions {
  if (physics?.spring || physics?.inertia || physics?.integrator) {
    return physics;
  }
  return { spring: fallback.spring };
}
