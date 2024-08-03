import type { TransitionConfig } from '$lib/types.js';
import { getContext, setContext } from 'svelte';

const CONFIG_KEY = Symbol('transition-config');

export const init = (config: TransitionConfig) => {
    setContext(CONFIG_KEY, config);
    return config;
};

export const get = () => {
    return getContext<TransitionConfig>(CONFIG_KEY);
};