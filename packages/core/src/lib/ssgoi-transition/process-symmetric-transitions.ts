import type { SsgoiConfig } from "../types";

/**
 * Processes symmetric transitions to create bidirectional navigation
 * For each symmetric transition, creates a reverse transition automatically
 */
export function processSymmetricTransitions(
  transitions: NonNullable<SsgoiConfig["transitions"]>,
): Omit<NonNullable<SsgoiConfig["transitions"]>[number], "symmetric">[] {
  const reversedTransitions = transitions
    .filter((t) => t.symmetric)
    .map((t) => ({
      from: t.to,
      to: t.from,
      transition: t.transition,
    }));

  return [...transitions, ...reversedTransitions];
}
