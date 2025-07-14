import { GetTransitionConfig } from "./types";

/**
 * Creates a transition configuration
 * 
 * @example
 * const config = createTransitionConfig({
 *   transitions: [
 *     { from: '/home', to: '/about', transition: fade() },
 *     { from: '/products', to: '/products/*', transition: slide() }
 *   ],
 *   defaultTransition: fade()
 * });
 */
export function createViewTransitionConfig(options: {
  transitions: { from: string; to: string; transition: GetTransitionConfig }[];
  defaultTransition?: GetTransitionConfig;
}) {
  return {
    getTransition: (from: string, to: string) => {
      const transition = findMatchingTransition(from, to, options.transitions);
      return transition || options.defaultTransition;
    },
  };
}

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
function findMatchingTransition<T>(
  from: string,
  to: string,
  transitions: Array<{ from: string; to: string; transition: T }>
): T | null {
  // First try to find exact match
  for (const config of transitions) {
    if (matchPath(from, config.from) && matchPath(to, config.to)) {
      return config.transition;
    }
  }

  // Then try wildcard matches
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

function matchPath(path: string, pattern: string): boolean {
  // Universal match
  if (pattern === "*") {
    return true;
  }

  // Wildcard match
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -2);
    return path === prefix || path.startsWith(prefix + "/");
  }

  // Exact match
  return path === pattern;
}
