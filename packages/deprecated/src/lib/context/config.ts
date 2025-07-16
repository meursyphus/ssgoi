import type { TransitionRouteConfig } from '$lib/types.js';
import { getContext, setContext } from 'svelte';

const CONFIG_KEY = Symbol('transition-config');

export const init = (config: TransitionRouteConfig) => {
	setContext(CONFIG_KEY, config);
	return config;
};

export const get = () => {
	return getContext<TransitionRouteConfig>(CONFIG_KEY);
};
