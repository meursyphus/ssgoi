import type { PhysicsOptions } from "@types";

/**
 * Smooth hero physics. Same base spring as `default` (so curated speed stays
 * shared across variants) plus `doubleSpring: 1` for a soft follower stage —
 * the tile glides into rest instead of snapping.
 */
export const SMOOTH_HERO_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 300, damping: 30, doubleSpring: 1 },
};

export const createSmoothVariantProvider = (): PhysicsOptions =>
  SMOOTH_HERO_PHYSICS;
