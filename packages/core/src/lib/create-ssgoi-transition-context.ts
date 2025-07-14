import type { SsgoiConfig, SsgoiContext, GetTransitionConfig, Transition } from "./types";

type PendingTransition = {
  from?: string;
  to?: string;
  outResolve?: (transition: GetTransitionConfig) => void;
  inResolve?: (transition: GetTransitionConfig) => void;
};

/**
 * Creates a transition configuration
 *
 * @example
 * const config = createSggoiTransitionConfig({
 *   transitions: [
 *     { from: '/home', to: '/about', transition: fade() },
 *     { from: '/products', to: '/products/*', transition: slide() }
 *   ],
 *   defaultTransition: fade()
 * });
 */
export function createSggoiTransitionContext(
  options: SsgoiConfig
): SsgoiContext {
  const pendingTransitions = new Map<string, PendingTransition>();

  function checkAndResolve(id: string) {
    const pending = pendingTransitions.get(id);
    if (pending?.from && pending?.to) {
      const transition = findMatchingTransition(pending.from, pending.to, options.transitions);
      const result = transition || options.defaultTransition;
      
      if (result) {
        if (result.out && pending.outResolve) {
          pending.outResolve(result.out);
        }
        if (result.in && pending.inResolve) {
          pending.inResolve(result.in);
        }
      }
      
      pendingTransitions.delete(id);
    }
  }

  return {
    getTransition: async (id: string, type: 'out' | 'in', path: string) => {
      let pending = pendingTransitions.get(id);
      
      if (!pending) {
        pending = {};
        pendingTransitions.set(id, pending);
      }

      if (type === 'out') {
        pending.from = path;
        return new Promise<GetTransitionConfig>((resolve) => {
          pending!.outResolve = resolve;
          checkAndResolve(id);
        });
      } else {
        pending.to = path;
        return new Promise<GetTransitionConfig>((resolve) => {
          pending!.inResolve = resolve;
          checkAndResolve(id);
        });
      }
    }
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
function findMatchingTransition(
  from: string,
  to: string,
  transitions: Array<{ from: string; to: string; transition: Transition }>
): Transition | null {
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
