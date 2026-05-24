import type { PhysicsOptions } from "@types";

/**
 * Default hero physics. Single spring, no follower stage — crisp arrival.
 * Shared by every strategy in the same transition so progress stays locked
 * across the parallel animation set.
 */
export const DEFAULT_HERO_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 320, damping: 30 },
};

export const createDefaultVariantProvider = (): PhysicsOptions =>
  DEFAULT_HERO_PHYSICS;
