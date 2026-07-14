import type { ResolveDirection, TransitionConfig } from "@types";

type PathMatch = {
  matched: boolean;
  specificity: number;
};

const EXACT_MATCH_BONUS = 1_000_000;
const STATIC_SEGMENT_SCORE = 100;
const DYNAMIC_SEGMENT_SCORE = 10;

function stripQueryAndHash(path: string): string {
  const trimmed = path.trim();
  const hashIndex = trimmed.indexOf("#");
  const queryIndex = trimmed.indexOf("?");
  const cutIndex = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .reduce((min, index) => Math.min(min, index), trimmed.length);

  return trimmed.slice(0, cutIndex);
}

function normalizePath(path: string): string {
  const stripped = stripQueryAndHash(path);

  try {
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(stripped)) {
      return normalizePath(new URL(stripped).pathname);
    }
  } catch {
    // Fall through and treat it as a path-like value.
  }

  const withLeadingSlash = stripped.startsWith("/") ? stripped : `/${stripped}`;
  const collapsed = withLeadingSlash.replace(/\/+/g, "/");
  const withoutTrailingSlash =
    collapsed.length > 1 ? collapsed.replace(/\/+$/g, "") : collapsed;

  return withoutTrailingSlash || "/";
}

function normalizePattern(pattern: string): string {
  const trimmed = pattern.trim();
  if (trimmed === "*") return "*";
  return normalizePath(trimmed);
}

function splitSegments(path: string): string[] {
  if (path === "/") return [];
  return path.slice(1).split("/");
}

function isDynamicSegment(segment: string): boolean {
  return (
    segment.startsWith(":") ||
    (segment.startsWith("[") && segment.endsWith("]")) ||
    (segment.startsWith("{") && segment.endsWith("}"))
  );
}

function getPathMatch(path: string, pattern: string): PathMatch {
  const normalizedPath = normalizePath(path);
  const normalizedPattern = normalizePattern(pattern);

  if (normalizedPattern === "*") {
    return { matched: true, specificity: 0 };
  }

  if (normalizedPath === normalizedPattern) {
    return {
      matched: true,
      specificity:
        EXACT_MATCH_BONUS +
        splitSegments(normalizedPattern).length * STATIC_SEGMENT_SCORE,
    };
  }

  const pathSegments = splitSegments(normalizedPath);
  const patternSegments = splitSegments(normalizedPattern);
  let specificity = 0;

  for (let index = 0; index < patternSegments.length; index++) {
    const patternSegment = patternSegments[index];
    const pathSegment = pathSegments[index];
    const isLastPatternSegment = index === patternSegments.length - 1;

    if (patternSegment === undefined) {
      return { matched: false, specificity: 0 };
    }

    if (
      (patternSegment === "*" || patternSegment === "**") &&
      isLastPatternSegment
    ) {
      return {
        matched:
          patternSegment === "**"
            ? pathSegments.length >= index
            : pathSegments.length > index,
        specificity,
      };
    }

    if (pathSegment === undefined) {
      return { matched: false, specificity: 0 };
    }

    if (patternSegment === "*" || isDynamicSegment(patternSegment)) {
      specificity += DYNAMIC_SEGMENT_SCORE;
      continue;
    }

    if (patternSegment !== pathSegment) {
      return { matched: false, specificity: 0 };
    }

    specificity += STATIC_SEGMENT_SCORE;
  }

  return {
    matched: pathSegments.length === patternSegments.length,
    specificity,
  };
}

/**
 * Matches a path against a pattern
 * Supports exact matches, wildcard patterns, and common route segment params
 *
 * @example
 * matchPath('/products', '/products') // true
 * matchPath('/products/123', '/products/*') // true
 * matchPath('/products', '/products/**') // true
 * matchPath('/products/123/reviews', '/products/**') // true
 * matchPath('/products/123', '/products/:id') // true
 * matchPath('/products/123', '/products/[id]') // true
 * matchPath('/products/123', '/products/{id}') // true
 * matchPath('/products/123', '/products') // false
 * matchPath('/anything', '*') // true
 */
export function matchPath(path: string, pattern: string): boolean {
  return getPathMatch(path, pattern).matched;
}

/**
 * Finds a matching transition configuration for the given from and to paths
 *
 * Chooses the most specific matching config. Exact paths outrank wildcard
 * paths, deeper static wildcard prefixes outrank broader fallbacks, and equal
 * specificity preserves the original config order.
 */
export function findMatchingTransition(
  from: string,
  to: string,
  transitions: Array<{
    from: string;
    to: string;
    transition: TransitionConfig;
  }>,
): TransitionConfig | null {
  let best:
    | {
        transition: TransitionConfig;
        specificity: number;
      }
    | undefined;

  for (const config of transitions) {
    const fromMatch = getPathMatch(from, config.from);
    if (!fromMatch.matched) continue;

    const toMatch = getPathMatch(to, config.to);
    if (!toMatch.matched) continue;

    const specificity = fromMatch.specificity + toMatch.specificity;
    if (!best || specificity > best.specificity) {
      best = { transition: config.transition, specificity };
    }
  }

  return best?.transition ?? null;
}

/**
 * Resolves the transition for one real navigation, layering direction-token
 * selection over path matching.
 *
 * Precedence:
 *  1. If a `direction` token was resolved AND a `{ direction }` entry is
 *     registered for it, that entry wins — strict override over any path match.
 *  2. Otherwise (no token, or the token has no registered entry) fall through to
 *     `findMatchingTransition` on the path pair — the existing behavior.
 *
 * An unregistered token deliberately falls back rather than dead-ending, so a
 * resolver that classifies every navigation (`"forward" | "back"`) never forces
 * the app to register a handler for every token. Token comparison is exact
 * string equality (`Map.get`); wildcards/specificity remain path-only.
 */
export function selectTransition(args: {
  from: string;
  to: string;
  direction: string | null | undefined;
  pathTransitions: Array<{
    from: string;
    to: string;
    transition: TransitionConfig;
  }>;
  directionTransitions: ReadonlyMap<string, TransitionConfig>;
}): TransitionConfig | null {
  if (args.direction != null) {
    const hit = args.directionTransitions.get(args.direction);
    if (hit) return hit;
  }
  return findMatchingTransition(args.from, args.to, args.pathTransitions);
}

/**
 * The full per-navigation selection seam, extracted from the context so it is
 * node-testable without a DOM. Encodes the ordering contract:
 *
 *  1. `resolveDirection` runs FIRST, on the ORIGINAL (pre-`middleware`) pair —
 *     direction is "how we arrived", orthogonal to the URL normalization
 *     `middleware` performs for path matching (§4.2).
 *  2. `middleware` then normalizes the pair for the path fallback only.
 *  3. `selectTransition` layers the token override over the path match.
 *
 * `middleware` is invoked exactly once here; `resolveDirection` at most once.
 * Neither participates in scroll-path normalization — that path never calls in.
 */
export function resolveTransitionForPair(args: {
  from: string;
  to: string;
  middleware: (from: string, to: string) => { from: string; to: string };
  resolveDirection?: ResolveDirection;
  pathTransitions: Array<{
    from: string;
    to: string;
    transition: TransitionConfig;
  }>;
  directionTransitions: ReadonlyMap<string, TransitionConfig>;
}): TransitionConfig | null {
  const direction = args.resolveDirection
    ? args.resolveDirection({ from: args.from, to: args.to })
    : null;
  const { from, to } = args.middleware(args.from, args.to);
  return selectTransition({
    from,
    to,
    direction,
    pathTransitions: args.pathTransitions,
    directionTransitions: args.directionTransitions,
  });
}
