import type { PhysicsOptions, SpringConfig } from "../types";

/**
 * Extract physics options from transition options
 * Returns the provided physics or falls back to default spring
 */
export function getPhysics(
  options: PhysicsOptions,
  fallback: { spring: SpringConfig },
): PhysicsOptions {
  const { spring, inertia, integrator } = options;

  if (spring || inertia || integrator) {
    return { spring, inertia, integrator };
  }

  return { spring: fallback.spring };
}
