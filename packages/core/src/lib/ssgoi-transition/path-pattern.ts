import type { PathPatterns } from "../runtime/types";

export type PathMatch = {
  matched: boolean;
  specificity: number;
  pattern: string;
};

const EXACT_MATCH_BONUS = 1_000_000;
const STATIC_SEGMENT_SCORE = 100;
const DYNAMIC_SEGMENT_SCORE = 10;
const SINGLE_WILDCARD_SCORE = 1;

function stripQueryAndHash(path: string): string {
  const trimmed = path.trim();
  const hashIndex = trimmed.indexOf("#");
  const queryIndex = trimmed.indexOf("?");
  const cutIndex = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .reduce((min, index) => Math.min(min, index), trimmed.length);

  return trimmed.slice(0, cutIndex);
}

export function normalizePath(path: string): string {
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
  // Compatibility alias. New configs should prefer the explicit `/**`.
  if (trimmed === "*") return "/**";
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

export function getPathMatch(path: string, pattern: string): PathMatch {
  const normalizedPath = normalizePath(path);
  const normalizedPattern = normalizePattern(pattern);

  if (normalizedPath === normalizedPattern) {
    return {
      matched: true,
      specificity:
        EXACT_MATCH_BONUS +
        splitSegments(normalizedPattern).length * STATIC_SEGMENT_SCORE,
      pattern,
    };
  }

  const pathSegments = splitSegments(normalizedPath);
  const patternSegments = splitSegments(normalizedPattern);
  let specificity = 0;

  for (let index = 0; index < patternSegments.length; index++) {
    const patternSegment = patternSegments[index];
    const pathSegment = pathSegments[index];
    const isLastPatternSegment = index === patternSegments.length - 1;

    if (patternSegment === "**") {
      // Deep wildcards are intentionally suffix-only. They match zero or more
      // segments, so `/posts/**` includes `/posts` itself.
      return {
        matched: isLastPatternSegment && pathSegments.length >= index,
        specificity,
        pattern,
      };
    }

    if (pathSegment === undefined || patternSegment === undefined) {
      return { matched: false, specificity: 0, pattern };
    }

    if (patternSegment === "*") {
      specificity += SINGLE_WILDCARD_SCORE;
      continue;
    }

    if (isDynamicSegment(patternSegment)) {
      specificity += DYNAMIC_SEGMENT_SCORE;
      continue;
    }

    if (patternSegment !== pathSegment) {
      return { matched: false, specificity: 0, pattern };
    }

    specificity += STATIC_SEGMENT_SCORE;
  }

  return {
    matched: pathSegments.length === patternSegments.length,
    specificity,
    pattern,
  };
}

export function getBestPathMatch(
  path: string,
  patterns: PathPatterns,
): PathMatch | null {
  const list = typeof patterns === "string" ? [patterns] : patterns;
  let best: PathMatch | null = null;

  for (const pattern of list) {
    const match = getPathMatch(path, pattern);
    if (match.matched && (!best || match.specificity > best.specificity)) {
      best = match;
    }
  }

  return best;
}

/**
 * Match a normalized path against an exact path, `:id` segment, `*` single
 * segment, or suffix `**` deep wildcard.
 */
export function matchPath(path: string, pattern: string): boolean {
  return getPathMatch(path, pattern).matched;
}
