import type { Pose } from "@types";

/**
 * Pose matching rules shared by Animation implementations.
 *
 * Matching priority (first hit wins):
 *   1. Same element, same defined key       → direct seed
 *   2. Same element, opposite role keys     → mirrored seed
 *   3. No element match, custom key         → direct seed when exactly one
 *      pose carries the same key
 *   4. No element match, self is "out"      → mirrored seed when exactly one
 *      pose carries the "in" role
 *
 * Mirroring encodes the page-handoff invariant: presets draw visual
 * "presence" as `t` on the in side and `1 - t` on the out side, so when an
 * interrupting navigation flips an element's role (or replaces the node
 * entirely, as unmount-mode clones do), seeding `1 - progress` with negated
 * velocity lands the new animation on the visual state the old one left
 * behind. Presets whose in/out styles are NOT mirror images (continuation
 * choreography like rotate/strip) must simply not set reserved keys.
 *
 * Deliberate non-matches — a wrong seed is worse than a fresh start:
 *   - Unkeyed identity matches. In hidden mode the same real node flips
 *     roles between consecutive runs, so a raw value copy lands on the
 *     wrong visual state. Without keys there is no role information, so we
 *     don't seed at all (the pre-motion-matching behavior).
 *   - Cross-element fallback for the IN side. The page being left is always
 *     the page that was arriving (navigation continuity), so an "out"
 *     animation may safely borrow the unique prior "in" pose. The reverse
 *     is not true: the page arriving next may be a brand-new page (A→B
 *     interrupted by B→C), and poses carry no page identity to tell a true
 *     reverse from a chained navigation.
 *   - Ambiguous fallbacks (several poses sharing the candidate key).
 */

/** Reserved role for animations that drive the outgoing page. */
export const OUT_ROLE = "out";
/** Reserved role for animations that drive the incoming page. */
export const IN_ROLE = "in";

export type PoseMatch = {
  pose: Pose;
  /** Seed as `1 - progress` with negated velocity (role flip). */
  mirror: boolean;
};

export type PoseBounds = {
  lowerBound: number;
  upperBound: number;
};

function oppositeRole(key: string): string | null {
  if (key === OUT_ROLE) return IN_ROLE;
  if (key === IN_ROLE) return OUT_ROLE;
  return null;
}

export function findPoseMatch(
  poses: readonly Pose[],
  self: { element: HTMLElement; key?: string },
): PoseMatch | null {
  if (self.key === undefined) return null;

  const byElement = poses.filter((p) => p.element === self.element);
  if (byElement.length > 0) {
    const sameKey = byElement.find((p) => p.key === self.key);
    if (sameKey) return { pose: sameKey, mirror: false };

    const opposite = oppositeRole(self.key);
    const flipped =
      opposite !== null ? byElement.find((p) => p.key === opposite) : undefined;
    if (flipped) return { pose: flipped, mirror: true };
    return null;
  }

  const opposite = oppositeRole(self.key);
  if (opposite === null) {
    const sameKey = poses.filter((p) => p.key === self.key);
    return sameKey.length === 1 ? { pose: sameKey[0]!, mirror: false } : null;
  }
  // Reserved roles: only the OUT side may borrow continuity cross-element —
  // see the module doc for why the IN side must start fresh.
  if (self.key !== OUT_ROLE) return null;
  const candidates = poses.filter((p) => p.key === IN_ROLE);
  return candidates.length === 1
    ? { pose: candidates[0]!, mirror: true }
    : null;
}

/**
 * Translate a pose from its source t-space into `target` bounds.
 *
 * Value maps via normalized progress; velocity rescales by the span ratio so
 * perceived speed carries over even when the two animations cover different
 * ranges. A mirrored rebase flips progress (`1 - p`) and negates velocity.
 *
 * Degenerate (zero-width) spans carry no scale information — fall back to
 * the legacy raw copy rather than dividing by zero.
 */
export function rebasePose(
  pose: Pose,
  target: PoseBounds,
  mirror: boolean,
): { value: number; velocity: number } {
  const sourceLower = pose.lowerBound ?? 0;
  const sourceUpper = pose.upperBound ?? 1;
  const sourceSpan = sourceUpper - sourceLower;
  const targetSpan = target.upperBound - target.lowerBound;

  if (sourceSpan === 0 || targetSpan === 0) {
    return { value: pose.value, velocity: pose.velocity };
  }

  let progress = (pose.value - sourceLower) / sourceSpan;
  let velocity = pose.velocity / sourceSpan;
  if (mirror) {
    progress = 1 - progress;
    velocity = -velocity;
  }
  return {
    value: target.lowerBound + progress * targetSpan,
    velocity: velocity * targetSpan,
  };
}
