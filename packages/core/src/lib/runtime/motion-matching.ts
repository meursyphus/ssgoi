/** Identity belongs to a transition scope. A route path is not an instance key. */
export interface MotionIdentity<TTarget> {
  target: TTarget;
  key?: string;
  role?: string;
  space?: unknown;
  lifetime?: "persistent" | "temporary";
}

export interface MotionChannel {
  schema: string;
  value: readonly number[];
  /** Units per second, in the same coordinate system as value. */
  velocity: readonly number[];
}

export interface MotionSnapshot<TTarget> extends MotionIdentity<TTarget> {
  channels: Readonly<Record<string, MotionChannel>>;
}

export type MotionMatch<TTarget> = {
  next: MotionIdentity<TTarget>;
  previous?: MotionSnapshot<TTarget>;
  reason: "element" | "key" | "enter" | "ambiguous";
};

/** One-to-one matching. Never choose an arbitrary first duplicate or array index. */
export function matchMotion<TTarget>(
  previous: readonly MotionSnapshot<TTarget>[],
  next: readonly MotionIdentity<TTarget>[],
): MotionMatch<TTarget>[] {
  const used = new Set<MotionSnapshot<TTarget>>();
  return next.map((target) => {
    const sameRole = (source: MotionSnapshot<TTarget>) =>
      source.role === target.role && source.space === target.space;
    const exact = previous.filter(
      (source) =>
        source.target === target.target &&
        sameRole(source) &&
        (source.key === undefined ||
          target.key === undefined ||
          source.key === target.key),
    );
    const candidates = exact.length
      ? exact
      : target.key === undefined
        ? []
        : previous.filter(
            (source) => source.key === target.key && sameRole(source),
          );
    const duplicateDestination =
      next.filter(
        (other) =>
          other.role === target.role &&
          other.space === target.space &&
          (other.target === target.target ||
            (target.key !== undefined && other.key === target.key)),
      ).length > 1;
    if (
      candidates.length > 1 ||
      duplicateDestination ||
      (candidates[0] && used.has(candidates[0]))
    ) {
      return { next: target, reason: "ambiguous" };
    }
    const source = candidates[0];
    if (!source) return { next: target, reason: "enter" };
    used.add(source);
    return {
      next: target,
      previous: source,
      reason: exact.length ? "element" : "key",
    };
  });
}

export function compatibleChannel(a: MotionChannel, b: MotionChannel): boolean {
  return (
    a.schema === b.schema &&
    a.value.length === b.value.length &&
    a.velocity.length === a.value.length &&
    b.velocity.length === b.value.length &&
    [...a.value, ...a.velocity, ...b.value, ...b.velocity].every(
      Number.isFinite,
    )
  );
}

/** Finite C1 residual: matches value/velocity at 0 and is exactly zero at duration. */
export function residualAt(
  offset: number,
  velocity: number,
  elapsedSeconds: number,
  durationSeconds: number,
): { value: number; velocity: number } {
  if (!(durationSeconds > 0) || elapsedSeconds >= durationSeconds)
    return { value: 0, velocity: 0 };
  const t = Math.max(0, elapsedSeconds) / durationSeconds;
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
  const h10 = t ** 3 - 2 * t ** 2 + t;
  return {
    value: h00 * offset + h10 * durationSeconds * velocity,
    velocity:
      ((6 * t ** 2 - 6 * t) * offset) / durationSeconds +
      (3 * t ** 2 - 4 * t + 1) * velocity,
  };
}
