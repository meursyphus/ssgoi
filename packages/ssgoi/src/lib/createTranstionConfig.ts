import type { TransitionDefinition, TransitionEffect, TransitionFunction, TransitionContext, RouteInfo } from './types.js';
import { none } from '$lib/transitions/index.js';
import { normalizePath } from '$lib/utils/index.js';

const defaultTransition: TransitionEffect = none();

export function createTransitionConfig(config: {
  transitions: TransitionDefinition[];
  defaultTransition: TransitionEffect | TransitionFunction;
}) {
  return (from: RouteInfo, to: RouteInfo, context: TransitionContext = {}): TransitionEffect => {
    const matchingTransition = findMatchingTransition(from, to, config.transitions);

    if (matchingTransition) {
      if (typeof matchingTransition.transitions === 'function') {
        return matchingTransition.transitions(context);
      } else {
        return matchingTransition.transitions;
      }
    }

    // Fallback to default transition
    if (typeof config.defaultTransition === 'function') {
      return config.defaultTransition(context);
    } else {
      return config.defaultTransition ?? defaultTransition;
    }
  };
}

function findMatchingTransition(from: RouteInfo, to: RouteInfo, transitions: TransitionDefinition[]): TransitionDefinition | undefined {
  return transitions.find(transition => {
    const fromMatch = matchPath(from.path, transition.from);
    const toMatch = matchPath(to.path, transition.to);
    return fromMatch && toMatch;
  });
}

function matchPath(path: string, pattern: string): boolean {
  path = normalizePath(path);
  if (pattern === '*') return true;
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return path.startsWith(prefix);
  }
  return path === pattern;
}