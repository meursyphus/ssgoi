import type { TransitionConfigInput, TransitionConfig, RouteInfo, TransitionEffect, TransitionFunction } from './types.js';
import { none } from '$lib/transitions/index.js';
import { normalizePath } from '$lib/utils/index.js';

const defaultTransition: TransitionEffect = none;

export function createTransitionConfig(config: TransitionConfigInput): TransitionConfig {
  return (from: RouteInfo, to: RouteInfo): TransitionEffect => {
    const fromRoute = findMatchingRoute(normalizePath(from.path), Object.keys(config));
    const toRoute = findMatchingRoute(normalizePath(to.path), Object.keys(config));

    if (fromRoute && toRoute) {
      const inTransition = config[fromRoute][toRoute];
      const outTransition = config[toRoute][fromRoute];

      return {
        in: (node, params) => {
          if (typeof inTransition === 'function') {
            return (inTransition as TransitionFunction)(from, to).in(node, params);
          }
          return (inTransition as TransitionEffect).in(node, params);
        },
        out: (node, params) => {
          if (typeof outTransition === 'function') {
            return (outTransition as TransitionFunction)(to, from).out(node, params);
          }
          return (outTransition as TransitionEffect).out(node, params);
        }
      };
    }
    
    // Fallback to a default transition if no match is found
    return defaultTransition;
  };
}

function findMatchingRoute(path: string, routes: string[]): string | undefined {
  // First, try to find an exact match
  const exactMatch = routes.find(route => route === path);
  if (exactMatch) return exactMatch;

  // If no exact match, look for parameterized routes
  const paramMatch = routes.find(route => {
    const routeParts = route.split('/');
    const pathParts = path.split('/');
    if (routeParts.length !== pathParts.length) return false;
    return routeParts.every((part, index) => part.startsWith(':') || part === pathParts[index]);
  });
  if (paramMatch) return paramMatch;

  // If still no match, check for wildcard
  return routes.find(route => route === '*');
}
