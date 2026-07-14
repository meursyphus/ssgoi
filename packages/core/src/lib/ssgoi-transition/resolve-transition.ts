import type {
  AnyTransitionConfig,
  ResolveDirection,
  SsgoiPathTransition,
  SsgoiTransitionEntry,
  SsgoiTransitionInput,
} from "@types";
import { findMatchingTransition } from "./find-matching-transition";
import { processSymmetricTransitions } from "./process-symmetric-transitions";

export type TransitionRegistry = {
  pathTransitions: SsgoiPathTransition[];
  directionTransitions: Map<string, AnyTransitionConfig>;
};

function isPathTransition(
  entry: SsgoiTransitionEntry,
): entry is SsgoiPathTransition {
  // Existing path entries win when an application attached extra metadata.
  // This keeps the new shape additive for structurally typed callers.
  return "from" in entry && "to" in entry;
}

function isTransitionGroup(
  input: SsgoiTransitionInput,
): input is readonly SsgoiTransitionInput[] {
  return Array.isArray(input);
}

/**
 * Flattens nested groups and builds the two selectors used for one device
 * class. Path entries retain the existing symmetric expansion; direction
 * tokens use declaration order as their tie-breaker, matching path selection.
 */
export function buildTransitionRegistry(
  inputs: readonly SsgoiTransitionInput[],
): TransitionRegistry {
  const pathEntries: SsgoiPathTransition[] = [];
  const directionTransitions = new Map<string, AnyTransitionConfig>();

  const collect = (entries: readonly SsgoiTransitionInput[]): void => {
    for (const entry of entries) {
      if (isTransitionGroup(entry)) {
        collect(entry);
      } else if (isPathTransition(entry)) {
        pathEntries.push(entry);
      } else if (!directionTransitions.has(entry.direction)) {
        directionTransitions.set(entry.direction, entry.transition);
      }
    }
  };
  collect(inputs);

  return {
    pathTransitions: processSymmetricTransitions(pathEntries),
    directionTransitions,
  };
}

/**
 * Resolves one real navigation through the complete selection pipeline.
 *
 * Ordering is part of this module's interface:
 *  1. classify the original pair;
 *  2. normalize the pair for path matching;
 *  3. lazily obtain the transition registry;
 *  4. prefer a registered direction token, otherwise match the path pair.
 *
 * Keeping registry construction lazy preserves the existing no-resolver
 * `middleware` -> functional-transitions order.
 */
export function resolveTransitionForPair(args: {
  from: string;
  to: string;
  middleware: (from: string, to: string) => { from: string; to: string };
  resolveDirection?: ResolveDirection;
  getRegistry: () => TransitionRegistry;
}): AnyTransitionConfig | null {
  const direction = args.resolveDirection?.({
    from: args.from,
    to: args.to,
  });
  const { from, to } = args.middleware(args.from, args.to);
  const { pathTransitions, directionTransitions } = args.getRegistry();

  if (direction != null) {
    const directionTransition = directionTransitions.get(direction);
    if (directionTransition) return directionTransition;
  }

  return findMatchingTransition(from, to, pathTransitions);
}
