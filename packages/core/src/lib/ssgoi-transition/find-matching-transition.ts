import type { Transition } from "../types";

/**
 * Matches a path against a pattern
 * Supports exact matches and wildcard patterns
 *
 * @example
 * matchPath('/products', '/products') // true
 * matchPath('/products/123', '/products/*') // true
 * matchPath('/products/123', '/products') // false
 * matchPath('/anything', '*') // true
 */
export function matchPath(path: string, pattern: string): boolean {
  // Universal match - asterisk matches any path
  if (pattern === "*") {
    return true;
  }

  // Wildcard match - pattern ending with /* matches path and subpaths
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -2);
    return path === prefix || path.startsWith(prefix + "/");
  }

  // Exact match - paths must be identical
  return path === pattern;
}

/**
 * Finds a matching transition configuration for the given from and to paths
 *
 * First tries to find exact match for both from and to paths,
 * then falls back to wildcard matches if no exact match is found.
 */
export function findMatchingTransition<TContext>(
  from: string,
  to: string,
  transitions: Array<{
    from: string;
    to: string;
    transition: Transition<TContext>;
  }>,
): Transition<TContext> | null {
  // First try to find exact match for both from and to paths
  for (const config of transitions) {
    if (matchPath(from, config.from) && matchPath(to, config.to)) {
      return config.transition;
    }
  }

  // Then try wildcard matches if no exact match found
  for (const config of transitions) {
    if (
      (config.from === "*" || matchPath(from, config.from)) &&
      (config.to === "*" || matchPath(to, config.to))
    ) {
      return config.transition;
    }
  }

  return null;
}
