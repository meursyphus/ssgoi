import type { TransitionConfig as SvelteTransitionConfig } from 'svelte/transition';

export type TransitionConfig = (SvelteTransitionConfig | (() => SvelteTransitionConfig));
type GetTranstionConfig = (node: HTMLElement, params: { getFromScrollTop: () => number; getToScrollTop: () => number }) => TransitionConfig

export type Transition<T = object> = (params?: T) => {
	in: GetTranstionConfig;
	out: GetTranstionConfig;
};

export interface RouteInfo {
	path: string;
}

export type TransitionEffect = {
	in: GetTranstionConfig;
	out: GetTranstionConfig;
};

export type TransitionFunction = (context: TransitionContext) => TransitionEffect;

/**
 * @todo: Add information about is-mobile here in the future
 */
export interface TransitionContext {
	// isMobile: boolean
}

export interface TransitionDefinition {
	from: string;
	to: string;
	transitions: TransitionEffect | TransitionFunction;
}

export interface TransitionConfigInput {
	transitions: TransitionDefinition[];
	defaultTransition: TransitionEffect | TransitionFunction;
}

export type TransitionRouteConfig = (from: RouteInfo, to: RouteInfo) => TransitionEffect;
