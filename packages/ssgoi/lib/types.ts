import type { TransitionConfig as SvelteTransitionConfig } from 'svelte/transition';

export type TransitionEffect = {
  in: (node: Element, params: any) => SvelteTransitionConfig;
  out: (node: Element, params: any) => SvelteTransitionConfig;
};

export type TransitionFunction = (from: RouteInfo, to: RouteInfo) => TransitionEffect;

export interface RouteInfo {
  path: string;
}

export type TransitionConfigInput = {
  [fromRoute: string]: {
    [toRoute: string]: TransitionEffect | TransitionFunction;
  };
};

export type TransitionConfig = (from: RouteInfo, to: RouteInfo) => TransitionEffect;
